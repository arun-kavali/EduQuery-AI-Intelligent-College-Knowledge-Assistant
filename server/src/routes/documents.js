const express = require('express');
const multer = require('multer');
const { supabase } = require('../services/supabaseService');
const { extractTextFromFile, chunkText, generateEmbedding, RAGServiceError } = require('../services/ragService');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB file size limit
});

/**
 * GET /api/documents
 * List all college knowledge base documents
 */
router.get('/', requireAuth, async (req, res) => {
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
    res.status(500).json({ success: false, stage: 'database', message: err.message });
  }
});

/**
 * GET /api/documents/:id
 * Get single document details & chunks preview
 */
router.get('/:id', requireAuth, async (req, res) => {
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
    res.status(500).json({ success: false, stage: 'database', message: err.message });
  }
});

/**
 * POST /api/documents/upload
 * Detailed Stage-by-Stage Server-Side Logging & Error Handling
 */
router.post('/upload', (req, res, next) => {
  console.log('[UPLOAD 1] Incoming document upload request received.');
  next();
}, requireAdmin, (req, res, next) => {
  console.log('[UPLOAD 2 & 3] Admin authentication & authorization verified for user:', req.user?.email);
  next();
}, upload.single('file'), async (req, res) => {
  try {
    const { title, category, department, description } = req.body;
    const file = req.file;

    if (!file) {
      console.error('[UPLOAD FAILED AT STEP 4] No file received by Multer.');
      return res.status(400).json({
        success: false,
        stage: 'file_upload',
        message: 'No file received by server. Please select a PDF, DOCX, or TXT document.'
      });
    }

    console.log(`[UPLOAD 4] File received via Multer: "${file.originalname}" (${file.size} bytes, mimetype: ${file.mimetype}).`);

    // File type validation
    const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (!allowedMimeTypes.includes(file.mimetype) && !['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      console.error(`[UPLOAD FAILED AT STEP 4] Unsupported file format: ${file.originalname} (${file.mimetype})`);
      return res.status(400).json({
        success: false,
        stage: 'file_upload',
        message: 'Unsupported file format. Please upload a PDF, DOCX, or TXT document.'
      });
    }

    const docTitle = title || file.originalname.replace(/\.[^/.]+$/, '');
    const docCategory = category || 'General';
    const docDept = department || 'General';

    // 1. Text Extraction Stage
    let extractedText = '';
    try {
      extractedText = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
    } catch (textErr) {
      console.error('[UPLOAD FAILED AT STEP 5] Text extraction failed:', textErr.message);
      return res.status(500).json({
        success: false,
        stage: 'text_extraction',
        message: 'Unable to extract document text: ' + textErr.message
      });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.error('[UPLOAD FAILED AT STEP 5] Extracted text is empty.');
      return res.status(400).json({
        success: false,
        stage: 'text_extraction',
        message: 'Extracted text is empty. Document may be scanned image or empty.'
      });
    }

    console.log(`[UPLOAD 5] Text extraction successful (${extractedText.length} characters).`);

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
          uploaded_by: req.user.id,
          processing_status: 'processing'
        }
      ])
      .select()
      .single();

    if (docErr) {
      console.error('[UPLOAD FAILED AT STEP 8] Supabase document record insertion error:', docErr.message);
      return res.status(500).json({
        success: false,
        stage: 'database',
        message: 'Supabase document insertion failed: ' + docErr.message
      });
    }

    console.log(`[UPLOAD 8] Document record inserted into Supabase with ID: ${docRecord.id}`);

    // 3. Text Chunking Stage
    let textChunks = [];
    try {
      textChunks = chunkText(extractedText, 1000, 200);
    } catch (chunkErr) {
      console.error('[UPLOAD FAILED AT STEP 6] Chunking failed:', chunkErr.message);
      await supabase.from('documents').update({ processing_status: 'failed', processing_error: chunkErr.message }).eq('id', docRecord.id);
      return res.status(500).json({
        success: false,
        stage: 'chunking',
        message: 'Chunk generation failed: ' + chunkErr.message
      });
    }

    console.log(`[UPLOAD 6] Chunk generation successful (${textChunks.length} chunks).`);

    // 4. Embedding Generation & Vector Insertion Stage
    const chunkRecords = [];
    for (let idx = 0; idx < textChunks.length; idx++) {
      const chunkContent = textChunks[idx];
      let embedding = null;

      try {
        embedding = await generateEmbedding(chunkContent);
      } catch (embErr) {
        console.error(`[UPLOAD FAILED AT STEP 7] Embedding generation failed for chunk #${idx + 1}:`, embErr.message);
        await supabase.from('documents').update({ processing_status: 'failed', processing_error: embErr.message }).eq('id', docRecord.id);
        return res.status(500).json({
          success: false,
          stage: 'embedding',
          message: 'Gemini embedding generation failed: ' + embErr.message
        });
      }

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

    console.log(`[UPLOAD 7] Gemini embedding generation successful (${chunkRecords.length} vectors generated, length: ${chunkRecords[0].embedding.length}).`);

    // 5. Insert document_chunks into Supabase
    const { error: chunkInsertErr } = await supabase.from('document_chunks').insert(chunkRecords);
    if (chunkInsertErr) {
      console.error('[UPLOAD FAILED AT STEP 9] Supabase document_chunks insertion error:', chunkInsertErr.message);
      await supabase.from('documents').update({ processing_status: 'failed', processing_error: chunkInsertErr.message }).eq('id', docRecord.id);
      return res.status(500).json({
        success: false,
        stage: 'database',
        message: 'Supabase document_chunks insertion failed: ' + chunkInsertErr.message
      });
    }

    console.log('[UPLOAD 9] Chunks inserted into Supabase document_chunks table successfully.');

    // 6. Update document status to 'indexed'
    const { data: indexedDocument, error: statusUpdateError } = await supabase
      .from('documents')
      .update({
        chunk_count: textChunks.length,
        processing_status: 'indexed',
        processing_error: null
      })
      .eq('id', docRecord.id)
      .select()
      .single();

    if (statusUpdateError) {
      await supabase
        .from('documents')
        .update({ processing_status: 'failed', processing_error: statusUpdateError.message })
        .eq('id', docRecord.id);
      return res.status(500).json({
        success: false,
        stage: 'database',
        message: 'Document chunks were stored, but the indexed status could not be persisted: ' + statusUpdateError.message
      });
    }

    console.log('[UPLOAD SUCCESS] Document fully indexed into RAG vector store!');

    res.json({
      success: true,
      stage: 'complete',
      message: 'Document uploaded and successfully indexed into RAG vector store.',
      document: {
        ...indexedDocument
      }
    });
  } catch (err) {
    console.error('[UPLOAD EXCEPTION]:', err);
    res.status(err instanceof RAGServiceError ? 502 : 500).json({
      success: false,
      stage: err.stage || 'server',
      message: err.message || 'Internal server error during upload.'
    });
  }
});

/**
 * DELETE /api/documents/:id
 * Admin Delete document & cascading vector chunks
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await supabase.from('document_chunks').delete().eq('document_id', id);
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Document and vector embeddings deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, stage: 'database', message: err.message });
  }
});

module.exports = router;
