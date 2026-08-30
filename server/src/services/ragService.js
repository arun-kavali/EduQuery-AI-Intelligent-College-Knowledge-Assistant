const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('./supabaseService');

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const GENERATION_MODEL = process.env.GEMINI_GENERATION_MODEL || 'gemini-3.6-flash';

class RAGServiceError extends Error {
  constructor(stage, message, cause) {
    super(message);
    this.name = 'RAGServiceError';
    this.stage = stage;
    this.cause = cause;
  }
}

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || /your[_-]/i.test(apiKey)) {
    throw new RAGServiceError('ai_configuration', 'Gemini is not configured. Set a valid GEMINI_API_KEY.');
  }
  return new GoogleGenerativeAI(apiKey);
}

async function extractTextFromFile(buffer, fileType, originalName) {
  const ext = originalName.split('.').pop().toLowerCase();
  if (fileType.includes('pdf') || ext === 'pdf') return (await pdfParse(buffer)).text;
  if (fileType.includes('word') || ext === 'docx' || ext === 'doc') return (await mammoth.extractRawText({ buffer })).value;
  return buffer.toString('utf-8');
}

function chunkText(text, chunkSize = 1000, chunkOverlap = 200) {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').trim();
  if (!cleaned) return [];
  const chunks = [];
  for (let start = 0; start < cleaned.length; start += chunkSize - chunkOverlap) {
    const chunk = cleaned.slice(start, start + chunkSize).trim();
    if (chunk.length > 20) chunks.push(chunk);
    if (start + chunkSize >= cleaned.length) break;
  }
  return chunks;
}

async function generateEmbedding(text) {
  try {
    const response = await getAiClient().getGenerativeModel({ model: EMBEDDING_MODEL }).embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768
    });
    const values = response?.embedding?.values;
    if (!Array.isArray(values) || values.length !== 768) {
      throw new Error(`Gemini returned an invalid embedding dimension (${values?.length ?? 0}).`);
    }
    return values;
  } catch (error) {
    if (error instanceof RAGServiceError) throw error;
    throw new RAGServiceError('embedding', 'Gemini embedding generation failed.', error);
  }
}

async function searchSimilarChunks(queryEmbedding, matchThreshold = 0.25, matchCount = 4, category = null, department = null) {
  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    filter_category: category,
    filter_department: department
  });
  if (error) throw new RAGServiceError('retrieval', 'Vector retrieval failed.', error);
  return data || [];
}

async function generateRAGAnswer(userQuery, retrievedChunks) {
  if (!retrievedChunks.length) {
    return { answer: "I couldn't find relevant information in the official college documents.", citations: [], is_unknown: true };
  }
  const contextText = retrievedChunks.map((chunk, index) =>
    `[Source ${index + 1}: ${chunk.metadata?.document_title || `Document ${chunk.document_id}`} (${chunk.metadata?.category || 'General'})]\n${chunk.content}`
  ).join('\n\n---\n\n');
  const prompt = `You are EduQuery AI, the official college knowledge assistant. Answer only from the supplied context. If it is insufficient, say: "I couldn't find complete information regarding this in the official college documents."\n\nCONTEXT:\n${contextText}\n\nQUESTION:\n${userQuery}`;
  let answer;
  try {
    const result = await getAiClient().getGenerativeModel({ model: GENERATION_MODEL }).generateContent(prompt);
    answer = result?.response?.text?.();
  } catch (error) {
    if (error instanceof RAGServiceError) throw error;
    throw new RAGServiceError('generation', 'Gemini answer generation failed.', error);
  }
  if (!answer) throw new RAGServiceError('generation', 'Gemini returned an empty answer.');
  return {
    answer,
    citations: retrievedChunks.map(chunk => ({
      document_id: chunk.document_id,
      document_title: chunk.metadata?.document_title || 'College Document',
      category: chunk.metadata?.category || 'General',
      chunk_index: chunk.chunk_index,
      snippet: `${chunk.content.substring(0, 180)}...`,
      similarity_score: Number(((chunk.similarity || 0) * 100).toFixed(1))
    })),
    is_unknown: false
  };
}

module.exports = { RAGServiceError, extractTextFromFile, chunkText, generateEmbedding, searchSimilarChunks, generateRAGAnswer };
