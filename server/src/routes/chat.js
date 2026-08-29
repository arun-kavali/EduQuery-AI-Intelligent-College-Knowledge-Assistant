const express = require('express');
const { supabase } = require('../services/supabaseService');
const { generateEmbedding, searchSimilarChunks, generateRAGAnswer } = require('../services/ragService');

const router = express.Router();

/**
 * POST /api/chat/query
 * Primary RAG query pipeline endpoint
 */
router.post('/query', async (req, res) => {
  try {
    const { message, conversation_id, category, department } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Query message cannot be empty.' });
    }

    console.log(`[RAG Query] User asked: "${message}"`);

    // 1. Get or create conversation record
    let convId = conversation_id;
    if (!convId) {
      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .insert([{ title: message.substring(0, 35) + '...', department: department || 'General' }])
        .select()
        .single();
      if (!convErr && conv) convId = conv.id;
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
 * Fetch user chat sessions
 */
router.get('/conversations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, conversations: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/chat/conversations/:id
 * Get full message list for a conversation
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
 * Delete a conversation
 */
router.delete('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
