const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('./supabaseService');

// Model Configuration
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const GENERATION_MODEL = process.env.GEMINI_GENERATION_MODEL || 'gemini-3.6-flash';

// Retrieve Gemini API Key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
const isPlaceholderKey = !apiKey || 
  apiKey.toLowerCase().includes('your_') || 
  apiKey.toLowerCase().includes('your-') || 
  apiKey.trim() === '';

let aiClient = null;

if (!isPlaceholderKey) {
  try {
    aiClient = new GoogleGenerativeAI(apiKey);
    console.log(`=================================================`);
    console.log(`🟢 [AI Provider Mode] LIVE GEMINI MODE ACTIVE`);
    console.log(`🔑 Client Initialized via process.env.GEMINI_API_KEY`);
    console.log(`📌 Embedding Model  : ${EMBEDDING_MODEL} (768 dimensions)`);
    console.log(`⚡ Generation Model : ${GENERATION_MODEL}`);
    console.log(`=================================================`);
  } catch (e) {
    console.error('[AI Provider Error] Failed to initialize Google Gemini client:', e.message);
  }
} else {
  console.warn(`=================================================`);
  console.warn(`⚠️ [AI Provider Mode] FALLBACK MODE ACTIVE`);
  console.warn(`🔒 GEMINI_API_KEY is missing or placeholder in server/.env`);
  console.warn(`📌 System will use deterministic local 768-d embeddings`);
  console.warn(`=================================================`);
}

/**
 * Extract raw text from uploaded Buffer according to file type
 */
async function extractTextFromFile(buffer, fileType, originalName) {
  const ext = originalName.split('.').pop().toLowerCase();
  if (fileType.includes('pdf') || ext === 'pdf') {
    const parsed = await pdfParse(buffer);
    return parsed.text;
  } else if (fileType.includes('word') || ext === 'docx' || ext === 'doc') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    return buffer.toString('utf-8');
  }
}

/**
 * Recursive character text splitter (Target Size: 1000, Overlap: 200)
 */
function chunkText(text, chunkSize = 1000, chunkOverlap = 200) {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ');
  const separators = ['\n\n', '\n', '. ', ' ', ''];
  
  function splitSegment(segment) {
    if (segment.length <= chunkSize) {
      return [segment];
    }
    for (const sep of separators) {
      if (sep === '') {
        const parts = [];
        for (let i = 0; i < segment.length; i += chunkSize - chunkOverlap) {
          parts.push(segment.slice(i, i + chunkSize));
        }
        return parts;
      }
      const parts = segment.split(sep);
      if (parts.length > 1) {
        const subChunks = [];
        let current = '';
        for (const part of parts) {
          const piece = current ? current + sep + part : part;
          if (piece.length <= chunkSize) {
            current = piece;
          } else {
            if (current) subChunks.push(current);
            current = part;
          }
        }
        if (current) subChunks.push(current);
        return subChunks;
      }
    }
    return [segment];
  }

  const rawChunks = splitSegment(cleaned);
  return rawChunks.map(c => c.trim()).filter(c => c.length > 20);
}

/**
 * Generate 768-dimensional float embedding vector for input text using Google Gemini
 */
async function generateEmbedding(text) {
  if (aiClient) {
    try {
      const model = aiClient.getGenerativeModel({ model: EMBEDDING_MODEL });
      const response = await model.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 768
      });
      
      if (response && response.embedding && response.embedding.values) {
        const values = response.embedding.values;
        let finalValues = values;
        if (values.length > 768) {
          finalValues = values.slice(0, 768);
        }
        console.log(`[LIVE GEMINI API] Generated ${finalValues.length}-d vector embedding via ${EMBEDDING_MODEL}.`);
        return finalValues;
      }
    } catch (err) {
      console.error(`[LIVE GEMINI API ERROR - Embedding (${EMBEDDING_MODEL})]:`, err.message);
    }
  }

  // Fallback: Deterministic local 768-d vector generator for offline dev testing
  console.log('[FALLBACK MODE] Generating deterministic 768-d vector for text chunk.');
  const vector = new Array(768).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 768; i++) {
    const val = Math.sin(hash + i) * 10000;
    vector[i] = parseFloat((val - Math.floor(val) - 0.5).toFixed(6));
  }
  return vector;
}

/**
 * Cosine similarity helper
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Perform Vector Similarity Search
 */
async function searchSimilarChunks(queryEmbedding, userQuery = '', matchThreshold = 0.25, matchCount = 4, category = null, department = null) {
  try {
    const { data: rpcChunks, error } = await supabase.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      filter_category: category,
      filter_department: department
    });

    if (!error && rpcChunks && rpcChunks.length > 0) {
      return rpcChunks;
    }
  } catch (err) {
    console.warn('[RPC Vector Search Warning]:', err.message);
  }

  // Fallback: Query document_chunks table directly
  try {
    const { data: chunks, error } = await supabase
      .from('document_chunks')
      .select('id, document_id, chunk_index, content, metadata, embedding');

    if (error || !chunks || chunks.length === 0) {
      return [];
    }

    const queryWords = (userQuery || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);

    const scored = chunks.map(chunk => {
      let sim = 0;
      if (chunk.embedding && Array.isArray(chunk.embedding) && Array.isArray(queryEmbedding)) {
        sim = cosineSimilarity(queryEmbedding, chunk.embedding);
      }

      // Check text keyword relevance match
      if (chunk.content && userQuery) {
        const chunkTextLower = chunk.content.toLowerCase();
        let queryMatchCount = 0;
        queryWords.forEach(w => {
          if (chunkTextLower.includes(w)) queryMatchCount++;
        });

        if (queryWords.length > 0 && queryMatchCount === 0) {
          sim = Math.min(sim, 0.15);
        } else if (queryMatchCount > 0) {
          sim = Math.max(sim, 0.35 + (queryMatchCount * 0.15));
        }
      }

      return {
        id: chunk.id,
        document_id: chunk.document_id,
        chunk_index: chunk.chunk_index,
        content: chunk.content,
        metadata: chunk.metadata || {},
        similarity: parseFloat(Math.min(0.99, sim).toFixed(4))
      };
    });

    return scored
      .filter(c => c.similarity >= matchThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, matchCount);
  } catch (e) {
    console.error('Fallback search error:', e.message);
    return [];
  }
}

/**
 * Generate Grounded RAG Response using Retrieved Chunks & Gemini LLM
 */
async function generateRAGAnswer(userQuery, retrievedChunks) {
  if (!retrievedChunks || retrievedChunks.length === 0) {
    return {
      answer: "I am sorry, but I couldn't find relevant information regarding your query in the official college documents. Please try rephrasing your question or check the documents listed in the Document Hub.",
      citations: [],
      is_unknown: true
    };
  }

  const contextText = retrievedChunks.map((chunk, idx) => {
    const title = chunk.metadata?.document_title || `Document ${chunk.document_id}`;
    const category = chunk.metadata?.category || 'General';
    return `[Source ${idx + 1}: ${title} (${category})]\n${chunk.content}`;
  }).join('\n\n---\n\n');

  const systemPrompt = `You are EduQuery AI, the official intelligent college knowledge assistant.
Answer the user's question using ONLY the provided document context below.

RULES:
1. Base your answer strictly on the context provided. Do not invent rules, dates, or details.
2. If the context does not contain sufficient details to answer accurately, state: "I couldn't find complete information regarding this in the official college documents."
3. Keep your tone polite, professional, and academic.
4. Highlight important dates, fees, policies, or contact details clearly.

PROVIDED COLLEGE DOCUMENT CONTEXT:
${contextText}

USER QUESTION:
${userQuery}`;

  let answerText = '';

  if (aiClient) {
    try {
      const model = aiClient.getGenerativeModel({ model: GENERATION_MODEL });
      const response = await model.generateContent(systemPrompt);
      if (response && response.response && response.response.text) {
        answerText = response.response.text();
        console.log(`[LIVE GEMINI API] Synthesized RAG answer via ${GENERATION_MODEL}.`);
      }
    } catch (err) {
      console.error(`[LIVE GEMINI API ERROR - LLM (${GENERATION_MODEL})]:`, err.message);
    }
  }

  if (!answerText) {
    // Grounded context summary generator fallback for offline dev testing
    console.log('[FALLBACK MODE] Generating local grounded context summary.');
    const topChunk = retrievedChunks[0];
    const sourceTitle = topChunk.metadata?.document_title || 'official college document';
    answerText = `Based on the ${sourceTitle}:\n\n${topChunk.content}\n\n*Source: ${sourceTitle} (Relevance Score: ${((topChunk.similarity || 0.85) * 100).toFixed(0)}%)*`;
  }

  const citations = retrievedChunks.map(chunk => ({
    document_id: chunk.document_id,
    document_title: chunk.metadata?.document_title || 'College Document',
    category: chunk.metadata?.category || 'General',
    chunk_index: chunk.chunk_index,
    snippet: chunk.content.substring(0, 180) + '...',
    similarity_score: parseFloat(((chunk.similarity || 0.85) * 100).toFixed(1))
  }));

  return {
    answer: answerText,
    citations,
    is_unknown: false
  };
}

module.exports = {
  extractTextFromFile,
  chunkText,
  generateEmbedding,
  searchSimilarChunks,
  generateRAGAnswer
};
