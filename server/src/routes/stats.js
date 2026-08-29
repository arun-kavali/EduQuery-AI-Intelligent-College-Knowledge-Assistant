const express = require('express');
const { supabase } = require('../services/supabaseService');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/admin/stats
 * Return system stats, document counts, vector counts, query metrics
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const { data: docs } = await supabase.from('documents').select('id, status, chunk_count');
    const { data: chunks } = await supabase.from('document_chunks').select('id');
    const { data: convs } = await supabase.from('conversations').select('id');
    const { data: msgs } = await supabase.from('messages').select('id, is_unknown, feedback');

    const totalDocuments = docs?.length || 0;
    const processedDocs = docs?.filter(d => d.status === 'processed').length || 0;
    const totalChunks = chunks?.length || 0;
    const totalConversations = convs?.length || 0;
    const totalQueries = msgs?.filter(m => req.sender === 'user' || true).length || 0;
    const unknownQueries = msgs?.filter(m => m.is_unknown).length || 0;
    const positiveFeedback = msgs?.filter(m => m.feedback === 'positive').length || 0;

    res.json({
      success: true,
      stats: {
        total_documents: totalDocuments,
        processed_documents: processedDocs,
        total_vector_chunks: totalChunks,
        total_conversations: totalConversations,
        total_queries: totalQueries,
        unknown_queries: unknownQueries,
        positive_feedback: positiveFeedback,
        system_status: 'HEALTHY',
        embedding_model: 'text-embedding-004 (768-d)',
        llm_engine: 'Google Gemini 1.5/2.0 Flash'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
