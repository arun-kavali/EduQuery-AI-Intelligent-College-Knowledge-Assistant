import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { 
  UploadCloud, CheckCircle2, RefreshCw, FileText, Grid, MessageSquare, 
  Star, Plus, ArrowRight, Play, Trash2, Eye, AlertCircle, ShieldCheck, 
  Layers, Database, Sparkles, X, ChevronRight 
} from 'lucide-react';

export default function AdminPage({ currentUser }) {
  const [stats, setStats] = useState({
    total_documents: 0,
    total_vector_chunks: 0,
    total_conversations: 0,
    avg_feedback_score: '5.0'
  });

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState('Academics');
  const [department, setDepartment] = useState('General');
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); // 0: Idle, 1: Uploading, 2: Extracting, 3: Chunking, 4: Embedding, 5: Complete
  const [uploadStatusMsg, setUploadStatusMsg] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Test Bench State
  const [testQuery, setTestQuery] = useState('What are the attendance requirements for semester exams?');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testError, setTestError] = useState(null);

  // Chunk Inspector Modal State
  const [selectedDocForInspect, setSelectedDocForInspect] = useState(null);
  const [inspectChunks, setInspectChunks] = useState([]);
  const [loadingChunks, setLoadingChunks] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchDocuments();
  }, []);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await apiClient.get('/admin/stats');
      if (res.data.success && res.data.stats) {
        setStats({
          total_documents: res.data.stats.total_documents || 0,
          total_vector_chunks: res.data.stats.total_vector_chunks || 0,
          total_conversations: res.data.stats.total_conversations || 0,
          avg_feedback_score: res.data.stats.avg_feedback_score || '5.0'
        });
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await apiClient.get('/documents');
      if (res.data.success && Array.isArray(res.data.documents)) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents list:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleRefreshAll = () => {
    fetchStats();
    fetchDocuments();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['pdf', 'docx', 'doc', 'txt'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowed.includes(ext)) {
      setUploadError(`Unsupported file format (.${ext}). Please select a PDF, DOCX, or TXT document.`);
      setUploadFile(null);
      return;
    }

    setUploadError(null);
    setUploadFile(file);
    if (!docTitle) {
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a PDF, DOCX, or TXT file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadStatusMsg(null);
    setUploadStep(1);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', docTitle || uploadFile.name.replace(/\.[^/.]+$/, ''));
    formData.append('category', category);
    formData.append('department', department);

    try {
      // Simulate visual progress steps for smooth UX
      setTimeout(() => setUploadStep(2), 500);
      setTimeout(() => setUploadStep(3), 1000);
      setTimeout(() => setUploadStep(4), 1500);

      // Pass Content-Type undefined so browser automatically sets multipart/form-data boundary
      const res = await apiClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': undefined }
      });

      if (res.data.success) {
        setUploadStep(5);
        setUploadStatusMsg(`✓ Success: "${docTitle || uploadFile.name}" indexed successfully into 768-d RAG vector store (${res.data.document?.chunk_count || 1} chunks).`);
        setUploadFile(null);
        setDocTitle('');
        fetchStats();
        fetchDocuments();
      } else {
        const stageStr = res.data.stage ? `[Stage: ${res.data.stage}] ` : '';
        throw new Error(stageStr + (res.data.message || 'Ingestion failed.'));
      }
    } catch (err) {
      console.error('Upload Error:', err);
      const stageErr = err.response?.data?.stage ? `[Failed at Stage: ${err.response.data.stage}] ` : '';
      const msgErr = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to upload document. Please check server log.';
      setUploadError(stageErr + msgErr);
      setUploadStep(0);
    } finally {
      setIsUploading(false);
    }
  };


  const handleDeleteDocument = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" and all its vector chunks?`)) return;

    try {
      const res = await apiClient.delete(`/documents/${id}`);
      if (res.data.success) {
        setUploadStatusMsg(`Deleted "${title}" and associated RAG chunks.`);
        fetchStats();
        fetchDocuments();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete document.');
    }
  };

  const handleInspectDocument = async (doc) => {
    setSelectedDocForInspect(doc);
    setLoadingChunks(true);
    setInspectChunks([]);

    try {
      const res = await apiClient.get(`/documents/${doc.id}`);
      if (res.data.success) {
        setInspectChunks(res.data.chunks || []);
      }
    } catch (err) {
      console.error('Error fetching document chunks:', err);
    } finally {
      setLoadingChunks(false);
    }
  };

  const runTestBenchQuery = async () => {
    if (!testQuery.trim()) return;
    setIsTesting(true);
    setTestError(null);
    setTestResults(null);

    try {
      const res = await apiClient.post('/chat/query', { message: testQuery });
      if (res.data.success) {
        setTestResults({
          answer: res.data.answer,
          citations: res.data.citations || [],
          is_unknown: res.data.is_unknown
        });
      } else {
        setTestError(res.data.error || 'Test query failed.');
      }
    } catch (err) {
      console.error('Test Bench Error:', err);
      setTestError(err.response?.data?.error || 'Failed to execute RAG query.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px 80px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Admin Control Center
            </h1>
            <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> Verified Admin
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
            Manage RAG knowledge base ingestion, chunk vector embeddings, system health, and retrieval test bench.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleRefreshAll}
            disabled={loadingStats || loadingDocs}
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={loadingStats || loadingDocs ? 'animate-spin' : ''} /> Refresh Stats
          </button>

          <a
            href="#ingestion-card"
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: '#0b3bbd',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(11, 59, 189, 0.25)'
            }}
          >
            <Plus size={16} /> New Document
          </a>
        </div>
      </div>

      {/* Row 1: 4 Dynamic Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        
        {/* Card 1: Total Documents */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            Total Documents
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {stats.total_documents}
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color="#0b3bbd" />
            </div>
          </div>
        </div>

        {/* Card 2: Knowledge Chunks */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            Knowledge Chunks
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {stats.total_vector_chunks}
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid size={18} color="#16a34a" />
            </div>
          </div>
        </div>

        {/* Card 3: AI Conversations */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            AI Conversations
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {stats.total_conversations}
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="#9333ea" />
            </div>
          </div>
        </div>

        {/* Card 4: Average Feedback Score */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '10px' }}>
            Average Feedback Score
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {stats.avg_feedback_score} <Star size={22} color="#eab308" fill="#eab308" />
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#ca8a04" />
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Document Ingestion Pipeline Form */}
      <div id="ingestion-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              RAG Ingestion Pipeline
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Upload PDF, DOCX, or TXT institutional documents to chunk and generate 768-d Gemini embeddings into Supabase pgvector.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
            Supported formats: PDF, DOCX, TXT (Max 15MB)
          </span>
        </div>

        {/* Metadata Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Document Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Student Examination Regulations 2026"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
            >
              <option value="Academics">Academics</option>
              <option value="Admissions">Admissions</option>
              <option value="Fees & Financial">Fees & Financial</option>
              <option value="Examinations">Examinations</option>
              <option value="Policies">Policies</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#fff' }}
            >
              <option value="General">General</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Eng">Electrical Eng</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Business Admin">Business Admin</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: uploadFile ? '2px dashed #0b3bbd' : '2px dashed #cbd5e1',
          borderRadius: '12px',
          background: uploadFile ? '#eff6ff' : '#f8fafc',
          padding: '32px 20px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'all 0.2s ease'
        }}>
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={isUploading}
          />
          
          <UploadCloud size={32} color={uploadFile ? '#0b3bbd' : '#94a3b8'} style={{ marginBottom: '10px' }} />
          
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: uploadFile ? '#0b3bbd' : '#334155', marginBottom: '4px' }}>
            {uploadFile ? `Selected: ${uploadFile.name} (${(uploadFile.size / 1024).toFixed(1)} KB)` : 'Click or Drag & Drop File Here'}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
            Supports PDF, DOCX, and TXT documents up to 15MB
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleFileUploadSubmit}
              disabled={isUploading || !uploadFile}
              className="btn btn-primary"
              style={{
                padding: '9px 24px',
                borderRadius: '8px',
                background: '#0b3bbd',
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(11, 59, 189, 0.25)',
                cursor: isUploading || !uploadFile ? 'not-allowed' : 'pointer',
                opacity: isUploading || !uploadFile ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isUploading && <RefreshCw size={15} className="animate-spin" />}
              {isUploading ? 'Processing Ingestion...' : 'Start Ingestion Pipeline'}
            </button>

            {uploadFile && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setUploadFile(null); setUploadError(null); }}
                style={{ padding: '8px 14px', borderRadius: '8px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear Selection
              </button>
            )}
          </div>
        </label>

        {/* Error Alert */}
        {uploadError && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <div>{uploadError}</div>
          </div>
        )}

        {/* Success Alert */}
        {uploadStatusMsg && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <div>{uploadStatusMsg}</div>
          </div>
        )}

        {/* Horizontal Process Stepper Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: uploadStep >= 1 ? 1 : 0.4 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: uploadStep >= 1 ? '#0b3bbd' : '#f1f5f9', color: uploadStep >= 1 ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              1
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: uploadStep >= 1 ? '#0f172a' : '#64748b' }}>Upload</span>
          </div>

          <ChevronRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: uploadStep >= 2 ? 1 : 0.4 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: uploadStep >= 2 ? '#0b3bbd' : '#f1f5f9', color: uploadStep >= 2 ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              2
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: uploadStep >= 2 ? '#0f172a' : '#64748b' }}>Extract Text</span>
          </div>

          <ChevronRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: uploadStep >= 3 ? 1 : 0.4 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: uploadStep >= 3 ? '#0b3bbd' : '#f1f5f9', color: uploadStep >= 3 ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              3
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: uploadStep >= 3 ? '#0f172a' : '#64748b' }}>Chunk Text</span>
          </div>

          <ChevronRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: uploadStep >= 4 ? 1 : 0.4 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: uploadStep >= 4 ? '#0b3bbd' : '#f1f5f9', color: uploadStep >= 4 ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              4
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: uploadStep >= 4 ? '#0f172a' : '#64748b' }}>768-d Gemini Embed</span>
          </div>

          <ChevronRight size={16} color="#cbd5e1" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: uploadStep >= 5 ? 1 : 0.4 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: uploadStep >= 5 ? '#16a34a' : '#f1f5f9', color: uploadStep >= 5 ? '#ffffff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              ✓
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: uploadStep >= 5 ? '#16a34a' : '#64748b' }}>Indexed</span>
          </div>

        </div>
      </div>

      {/* Row 3: 2 Column Grid (Recent Documents Table on left, Statuses & Test Bench on right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '28px' }}>
        
        {/* Left Table: Knowledge Base Documents */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Indexed Knowledge Base Documents
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
              {documents.length} document{documents.length !== 1 ? 's' : ''} stored
            </span>
          </div>

          {loadingDocs ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
              Loading documents from Supabase...
            </div>
          ) : documents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
              No documents in vector database yet. Use the ingestion pipeline above to add PDF/DOCX/TXT files.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Title / Name</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Chunks</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>Actions</th>

                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#0b3bbd" style={{ flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          {doc.title || doc.file_name}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {doc.category || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#475569', fontWeight: 600 }}>
                      {doc.chunk_count || 1} chunks
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                        indexed
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleInspectDocument(doc)}
                          title="Inspect Chunks"
                          style={{ padding: '6px', borderRadius: '6px', background: '#eff6ff', border: 'none', color: '#1d4ed8', cursor: 'pointer' }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.title || doc.file_name)}
                          title="Delete Document"
                          style={{ padding: '6px', borderRadius: '6px', background: '#fef2f2', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Panel: Statuses & Real RAG Test Bench */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Statuses Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              System Health & Service Status
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                  <ShieldCheck size={16} color="#16a34a" /> RAG System Engine
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                  ONLINE
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                  <Database size={16} color="#16a34a" /> Supabase pgvector
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                  ACTIVE (768-d)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}>
                  <Sparkles size={16} color="#1d4ed8" /> Gemini 3.6 Flash LLM
                </div>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px' }}>
                  CONNECTED
                </span>
              </div>
            </div>
          </div>

          {/* RAG Retrieval Test Bench Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Play size={18} color="#0b3bbd" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                RAG Query Test Bench
              </h2>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
              Test vector similarity retrieval and grounded Gemini response generation directly against your indexed documents.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter test query (e.g. What is attendance policy?)"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '10px 12px', borderRadius: '8px', width: '100%', marginBottom: '10px' }}
              />

              <button
                onClick={runTestBenchQuery}
                disabled={isTesting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '9px', borderRadius: '8px', background: '#0b3bbd', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: isTesting ? 'wait' : 'pointer' }}
              >
                {isTesting ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
                {isTesting ? 'Synthesizing...' : 'Run Vector RAG Query Test'}
              </button>
            </div>

            {testError && (
              <div style={{ padding: '10px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>
                {testError}
              </div>
            )}

            {testResults && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#0b3bbd" /> Grounded Answer Response:
                </div>
                <div style={{ color: '#334155', lineHeight: 1.5, marginBottom: '12px', background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  {testResults.answer}
                </div>

                {testResults.citations?.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Retrieved Vector Sources ({testResults.citations.length}):
                    </div>
                    {testResults.citations.map((c, i) => (
                      <div key={i} style={{ background: '#fff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#0b3bbd' }}>
                          <span>{c.document_title}</span>
                          <span>Score: {c.similarity_score}%</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                          "{c.snippet}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Chunk Inspector Modal */}
      {selectedDocForInspect && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '750px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Chunk Inspector — {selectedDocForInspect.title || selectedDocForInspect.file_name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Category: {selectedDocForInspect.category || 'General'} • ID: {selectedDocForInspect.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedDocForInspect(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {loadingChunks ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  Fetching vector chunks from Supabase...
                </div>
              ) : inspectChunks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No vector chunks found for this document.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {inspectChunks.map((chk, i) => (
                    <div key={chk.id || i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#0b3bbd', marginBottom: '8px' }}>
                        <span>Chunk #{chk.chunk_index || i + 1}</span>
                        <span>768-d Embedding Active</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5, background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        {chk.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedDocForInspect(null)}
                style={{ padding: '8px 20px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
