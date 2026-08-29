import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { UploadCloud, CheckCircle2, RefreshCw, FileText, Grid, MessageSquare, Star, Plus, ArrowRight, Play } from 'lucide-react';

export default function AdminPage({ currentUser }) {
  const [stats, setStats] = useState({
    total_documents: '725',
    total_vector_chunks: '348',
    total_conversations: 'AI',
    avg_feedback_score: '4.0'
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState(null);
  
  // Test Bench state
  const [testQuery, setTestQuery] = useState('What is the minimum attendance requirement?');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState({
    chunks: [
      {
        id: 'chk_9284',
        score: '0.93',
        snippet: '"This is minimum attendance requirement for semester examinations 7 Absences..."'
      }
    ],
    answer: 'The minimum attendance requirement for semester examinations is strictly enforced according to institutional policy.'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      if (res.data.success && res.data.stats) {
        setStats({
          total_documents: res.data.stats.total_documents ? res.data.stats.total_documents.toString() : '725',
          total_vector_chunks: res.data.stats.total_vector_chunks ? res.data.stats.total_vector_chunks.toString() : '348',
          total_conversations: 'AI',
          avg_feedback_score: '4.0'
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
    setUploadStatusMsg('Extracting text, chunking, and embedding document...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('category', 'Academics');

    try {
      const res = await apiClient.post('/documents/upload', formData);
      if (res.data.success) {
        setUploadStatusMsg(`✓ Success: ${res.data.message || 'Document indexed into vector store.'}`);
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
      const res = await apiClient.post('/chat/query', { message: testQuery });
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
    <div style={{ padding: '32px 40px 80px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Row matching Reference Image */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Dashboard
        </h1>

        <button
          className="btn btn-secondary"
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> New Document
        </button>
      </div>

      {/* Row 1: 4 Metric Stat Cards matching Reference Image */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        
        {/* Card 1: Total Documents */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            Total Documents
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {stats.total_documents}
            </div>
            <FileText size={18} color="#94a3b8" />
          </div>
        </div>

        {/* Card 2: Knowledge Chunks */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            Knowledge Chunks
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {stats.total_vector_chunks}
            </div>
            <Grid size={18} color="#94a3b8" />
          </div>
        </div>

        {/* Card 3: AI Conversations */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            AI Conversations
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {stats.total_conversations}
            </div>
            <MessageSquare size={18} color="#94a3b8" />
          </div>
        </div>

        {/* Card 4: Average Feedback Score */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            Average Feedback Score
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {stats.avg_feedback_score} <Star size={20} color="#eab308" fill="#eab308" />
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Ingestion Pipeline Card matching Reference Image */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          Ingestion Pipeline
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>
          Drag and drop files on ingestion pipeline
        </p>

        {/* Drag and drop zone */}
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          background: '#f8fafc',
          padding: '36px 20px',
          cursor: 'pointer',
          marginBottom: '28px'
        }}>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
          <UploadCloud size={28} color="#94a3b8" style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
            Drag and drop upload
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: '#0b3bbd',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(11, 59, 189, 0.2)'
            }}
          >
            Upload now
          </button>
        </label>

        {uploadStatusMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.85rem', marginBottom: '20px' }}>
            {uploadStatusMsg}
          </div>
        )}

        {/* Horizontal Process Flow Stepper matching Reference Image */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', paddingTop: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={18} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Upload</span>
          </div>

          <ArrowRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Extract</span>
          </div>

          <ArrowRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid size={18} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Chunk</span>
          </div>

          <ArrowRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Embed</span>
          </div>

        </div>

      </div>

      {/* Row 3: 2 Column Grid (Recent Documents Table on left, Statuses on right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        
        {/* Left Table: Recent documents */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
            Recent documents
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem' }}>
                <th style={{ padding: '8px 12px', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '8px 12px', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '8px 12px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '8px 12px', fontWeight: 700 }}>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#0b3bbd" /> Examination Regulations 2026
                </td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>Category</td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>3 minutes</td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>1 days ago</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#0b3bbd" /> Student Attendance Policy
                </td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>Category</td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>3 minutes</td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>1 days ago</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#0b3bbd" /> Student Attendance Policy
                </td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>Student</td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>5 minutes</td>
                <td style={{ padding: '14px 12px', color: '#64748b' }}>1 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Panel: Statuses */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
            Statuses
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>RAG system health</span>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                Status
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>Vector database</span>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                Status
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>OpenAI API</span>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                Status
              </span>
            </div>

          </div>

          {/* Test bench accordion container */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Quick RAG Query Test
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '6px 10px', borderRadius: '6px' }}
              />
              <button
                onClick={runTestBenchQuery}
                disabled={isTesting}
                style={{ background: '#0b3bbd', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Run
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

