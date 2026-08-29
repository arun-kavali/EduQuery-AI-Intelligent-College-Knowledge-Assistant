const express = require('express');
const { supabase } = require('../services/supabaseService');
const { generateEmbedding, searchSimilarChunks, generateRAGAnswer } = require('../services/ragService');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply requireAuth to all chat routes to enforce authentication & user_id scoping
router.use(requireAuth);

/**
 * POST /api/chat/query
 * Primary RAG query pipeline endpoint with authenticated user_id tracking
 */
router.post('/query', async (req, res) => {
  try {
    const { message, conversation_id, category, department } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Query message cannot be empty.' });
    }

    const authUserId = req.user?.id;
    console.log(`[RAG Query] User (${authUserId}) asked: "${message}"`);

    // 1. Get or create conversation record with user ownership
    let convId = conversation_id;
    if (!convId) {
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .insert([
          {
            user_id: authUserId,
            title: message.substring(0, 35) + '...',
            department: department || 'General'
          }
        ])
        .select()
        .single();
      if (!convErr && conv) convId = conv.id;
    } else {
      // Verify user owns this existing conversation
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id, user_id')
        .eq('id', convId)
        .maybeSingle();

      if (existingConv && existingConv.user_id && existingConv.user_id !== authUserId) {
        return res.status(403).json({ success: false, error: 'Access Denied: You do not own this conversation.' });
      }
    }

    // Save user message to database
    if (convId) {
      await supabase.from('messages').insert([
        { conversation_id: convId, sender: 'user', content: message }
      ]);
    }

    // 2. Convert query to vector embedding
    const queryEmbedding = await generateEmbedding(message);

    // 3. Retrieve top-K relevant chunks via vector search
    const retrievedChunks = await searchSimilarChunks(
      queryEmbedding,
      message,
      0.25, // Similarity threshold
      4,    // Match count
      category,
      department
    );

    console.log(`[RAG Search] Retrieved ${retrievedChunks.length} relevant chunks`);

    // 4. Synthesize grounded answer using LLM
    const ragResult = await generateRAGAnswer(message, retrievedChunks);

    // 5. Save assistant answer to database
    let messageRecord = null;
    if (convId) {
      const { data: msg, error: msgErr } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: convId,
            sender: 'assistant',
            content: ragResult.answer,
            citations: ragResult.citations,
            is_unknown: ragResult.is_unknown
          }
        ])
        .select()
        .single();
      if (!msgErr) messageRecord = msg;
    }

    res.json({
      success: true,
      conversation_id: convId,
      message_id: messageRecord?.id || null,
      answer: ragResult.answer,
      citations: ragResult.citations,
      is_unknown: ragResult.is_unknown,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error during RAG chat query:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/chat/conversations
 * Fetch ONLY the authenticated user's chat sessions
 */
router.get('/conversations', async (req, res) => {
  try {
    const authUserId = req.user?.id;
    if (!authUserId) {
      return res.status(401).json({ success: false, error: 'User authentication required.' });
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', authUserId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, conversations: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/chat/conversations/:id
 * Get full message list for a conversation owned by the user
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authUserId = req.user?.id;

    // Verify conversation ownership
    const { data: conv } = await supabase
      .from('conversations')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle();

    if (!conv || (conv.user_id && conv.user_id !== authUserId)) {
      return res.status(403).json({ success: false, error: 'Access Denied: You do not own this conversation.' });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, messages: messages || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/chat/conversations/:id
 * Delete a conversation owned by the user
 */
router.delete('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const authUserId = req.user?.id;

    // Verify conversation ownership
    const { data: conv } = await supabase
      .from('conversations')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle();

    if (!conv || (conv.user_id && conv.user_id !== authUserId)) {
      return res.status(403).json({ success: false, error: 'Access Denied: You cannot delete this conversation.' });
    }

    await supabase.from('messages').delete().eq('conversation_id', id);
    const { error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Conversation deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/chat/feedback
 * Submit answer feedback (thumbs up / down)
 */
router.post('/feedback', async (req, res) => {
  try {
    const { message_id, feedback } = req.body;
    if (!message_id || !['positive', 'negative'].includes(feedback)) {
      return res.status(400).json({ success: false, error: 'Invalid message_id or feedback value.' });
    }

    const { error } = await supabase
      .from('messages')
      .update({ feedback })
      .eq('id', message_id);

    if (error) throw error;
    res.json({ success: true, message: 'Feedback recorded.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
