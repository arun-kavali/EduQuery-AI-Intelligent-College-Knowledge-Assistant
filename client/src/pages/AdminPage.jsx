import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, RefreshCw, FileText, Grid, MessageSquare, ThumbsUp, Play, Layers } from 'lucide-react';

export default function AdminPage({ currentUser }) {
  const [stats, setStats] = useState({
    total_documents: '12,458',
    total_vector_chunks: '1.2M',
    total_conversations: '84,902',
    avg_feedback_score: '4.8'
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState(null);
  
  // Test Bench state
  const [testQuery, setTestQuery] = useState('What are the main components of Transformer models?');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState({
    chunks: [
      {
        id: 'chk_9284',
        score: '0.92',
        snippet: '"The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected..."'
      },
      {
        id: 'chk_1102',
        score: '0.88',
        snippet: '"An attention function can be described as mapping a query and a set of key-value pairs to an output, where..."'
      }
    ],
    answer: 'Based on the retrieved context, the main components of a Transformer model are the Encoder and Decoder stacks. Both utilize self-attention mechanisms and point-wise feed-forward networks.'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      if (res.data.success && res.data.stats) {
        setStats({
          total_documents: res.data.stats.total_documents ? res.data.stats.total_documents.toLocaleString() : '12,458',
          total_vector_chunks: res.data.stats.total_vector_chunks ? (res.data.stats.total_vector_chunks > 1000000 ? `${(res.data.stats.total_vector_chunks/1000000).toFixed(1)}M` : res.data.stats.total_vector_chunks.toLocaleString()) : '1.2M',
          total_conversations: res.data.stats.total_conversations ? res.data.stats.total_conversations.toLocaleString() : '84,902',
          avg_feedback_score: '4.8'
        });
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadFile(file);
    setIsUploading(true);
    setUploadStatusMsg('Extracting text, chunking text, and building vector embeddings...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('category', 'Academics');

    try {
      const res = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-user-role': currentUser?.role || 'admin'
        }
      });
      if (res.data.success) {
        setUploadStatusMsg(`Document indexed successfully! ${res.data.message}`);
        fetchStats();
      }
    } catch (err) {
      setUploadStatusMsg(err.response?.data?.error || 'Ingestion failed. Please check server connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const runTestBenchQuery = async () => {
    if (!testQuery.trim()) return;
    setIsTesting(true);
    try {
      const res = await axios.post('/api/chat/query', { message: testQuery });
      if (res.data.success) {
        setTestResults({
          chunks: (res.data.citations || []).map((c, i) => ({
            id: `chk_${Math.floor(1000 + Math.random() * 9000)}`,
            score: (c.similarity_score / 100).toFixed(2),
            snippet: `"${c.snippet}"`
          })),
          answer: res.data.answer
        });
      }
    } catch (err) {
      console.error('Test query error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ padding: '36px 40px 80px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Admin Control Center
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            System overview and RAG pipeline management.
          </p>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> Updated Just Now
        </div>
      </div>

      {/* Row 1: Metric Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        
        {/* Metric 1 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
              TOTAL DOCUMENTS
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
            {stats.total_documents}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
            ↗ +342 this week
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
              KNOWLEDGE CHUNKS
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
            {stats.total_vector_chunks}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
            Indexed in vector DB
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
              AI CONVERSATIONS
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
            {stats.total_conversations}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>
            ↗ +12% vs last month
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
              AVG FEEDBACK SCORE
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ThumbsUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
            {stats.avg_feedback_score} <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>/5</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
            Based on 12k ratings
          </div>
        </div>

      </div>

      {/* Row 2: 2 Column Main Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
        
        {/* Left Column: Ingestion Pipeline */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Ingestion Pipeline
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px' }}>
            Upload academic papers to index them into the knowledge base.
          </p>

          {/* Drag & Drop Upload Zone */}
          <label style={{
            display: 'block',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            background: '#f8fafc',
            padding: '36px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '28px',
            transition: 'all 0.15s ease'
          }}>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <UploadCloud size={24} />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              Drag & Drop Documents
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              PDF, TXT, or DOCX up to 50MB
            </div>
          </label>

          {uploadStatusMsg && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.85rem', marginBottom: '20px' }}>
              {uploadStatusMsg}
            </div>
          )}

          {/* Current Processing Task Box */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              Current Processing Task
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {uploadFile ? uploadFile.name : 'attention_is_all_you_need.pdf'}
                </span>
                <span style={{ fontWeight: 800, color: '#1d4ed8' }}>
                  65%
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ width: '65%', height: '100%', background: '#1d4ed8', borderRadius: '4px' }} />
              </div>

              {/* Step Stepper Icons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1d4ed8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Upload</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1d4ed8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Extract</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', border: '2px solid #1d4ed8', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={12} className="animate-spin" />
                  </div>
                  <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Embed</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }} />
                  </div>
                  <span>Index</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Retrieval Test Bench */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Retrieval Test Bench
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '24px' }}>
            Debug and visualize the RAG pipeline execution.
          </p>

          {/* Test Query Input Form */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Test Query</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
              <button
                onClick={runTestBenchQuery}
                disabled={isTesting}
                className="btn btn-primary"
                style={{ background: '#0b3bbd', padding: '8px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Play size={14} /> Run
              </button>
            </div>
          </div>

          {/* Results Container */}
          <div style={{
            flex: 1,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="#7e22ce" /> Retrieved Chunks (Top 2)
            </div>

            {testResults.chunks.map((chk, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    ID: {chk.id}
                  </span>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    Score: {chk.score}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  {chk.snippet}
                </div>
              </div>
            ))}

            {/* Synthesized Response */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✨ Synthesized Response
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #7e22ce',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '0.825rem',
                color: '#1e293b',
                lineHeight: 1.5
              }}>
                {testResults.answer}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
