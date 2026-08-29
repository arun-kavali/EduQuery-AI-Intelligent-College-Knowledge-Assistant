const express = require('express');
const multer = require('multer');
const { supabase } = require('../services/supabaseService');
const { extractTextFromFile, chunkText, generateEmbedding } = require('../services/ragService');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB file size limit
});

/**
 * GET /api/documents
 * List all college knowledge base documents
 */
router.get('/', async (req, res) => {
  try {
    const { category, department, search } = req.query;
    let query = supabase.from('documents').select('*').order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (department && department !== 'General') {
      query = query.eq('department', department);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, documents: data || [] });
  } catch (err) {
    console.error('Error fetching documents:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/documents/:id
 * Get single document details & chunks preview
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: doc, error: docErr } = await supabase.from('documents').select('*').eq('id', id).single();
    if (docErr) throw docErr;

    const { data: chunks, error: chunkErr } = await supabase
      .from('document_chunks')
      .select('id, chunk_index, content, created_at')
      .eq('document_id', id)
      .order('chunk_index', { ascending: true });

    if (chunkErr) throw chunkErr;

    res.json({
      success: true,
      document: doc,
      chunks: chunks || []
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/documents/upload
 * Admin Upload document, extract text, chunk, embed, and insert into Supabase
 */
router.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, category, department, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // File type validation
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(file.mimetype) && !['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file format. Please upload a PDF, DOCX, or TXT file.'
      });
    }

    const docTitle = title || file.originalname.replace(/\.[^/.]+$/, '');
    const docCategory = category || 'General';
    const docDept = department || 'General';

    console.log(`[Upload] Processing ${file.originalname} (${file.size} bytes) for RAG Ingestion...`);

    // 1. Extract raw text from uploaded file
    const extractedText = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Failed to extract text from document.' });
    }

    // 2. Insert document record into Supabase
    const { data: docRecord, error: docErr } = await supabase
      .from('documents')
      .insert([
        {
          title: docTitle,
          file_name: file.originalname,
          file_type: file.mimetype || 'application/pdf',
          file_path: `/uploads/${file.originalname}`,
          file_size: file.size,
          category: docCategory,
          department: docDept,
          status: 'processing'
        }
      ])
      .select()
      .single();

    if (docErr) throw docErr;

    // 3. Chunk text into ~1000 char segments with overlap
    const textChunks = chunkText(extractedText, 1000, 200);
    console.log(`[RAG Chunking] Generated ${textChunks.length} chunks for ${docTitle}`);

    // 4. Generate embeddings and store document_chunks
    const chunkRecords = [];
    for (let idx = 0; idx < textChunks.length; idx++) {
      const chunkContent = textChunks[idx];
      const embedding = await generateEmbedding(chunkContent);

      chunkRecords.push({
        document_id: docRecord.id,
        chunk_index: idx + 1,
        content: chunkContent,
        embedding: embedding,
        metadata: {
          document_id: docRecord.id,
          document_title: docTitle,
          category: docCategory,
          department: docDept,
          description: description || ''
        }
      });
    }

    const { error: chunkErr } = await supabase.from('document_chunks').insert(chunkRecords);
    if (chunkErr) throw chunkErr;

    // 5. Update document status to processed
    await supabase
      .from('documents')
      .update({
        chunk_count: textChunks.length,
        status: 'processed'
      })
      .eq('id', docRecord.id);

    res.json({
      success: true,
      message: 'Document uploaded and successfully indexed into RAG vector store.',
      document: {
        ...docRecord,
        chunk_count: textChunks.length,
        status: 'processed'
      }
    });
  } catch (err) {
    console.error('Error during document upload & RAG ingestion:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/documents/:id
 * Admin Delete document & cascading vector chunks
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete chunks first
    await supabase.from('document_chunks').delete().eq('document_id', id);
    // Delete main document record
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Document and vector embeddings deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
