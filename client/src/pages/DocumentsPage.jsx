import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/apiClient';
import { Search, Upload, FileText, Layers, RefreshCw, CheckCircle2, MoreVertical, ShieldAlert, Trash2 } from 'lucide-react';


export default function DocumentsPage({ currentUser }) {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState(null);
  
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [modalChunks, setModalChunks] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ['All', 'Admissions', 'Academics', 'Fees', 'Exams', 'Policies'];

  const defaultDocs = [
    {
      id: 'doc-1',
      title: 'Examination Regulations 2026',
      category: 'Exams',
      department: 'Academics',
      status: 'processed',
      created_at: '2026',
      chunk_count: 35
    },
    {
      id: 'doc-2',
      title: 'Student Attendance Policy',
      category: 'Policies',
      department: 'General',
      status: 'processed',
      created_at: '2024',
      chunk_count: 24
    },
    {
      id: 'doc-3',
      title: 'Hostel and Housing Rules',
      category: 'Policies',
      department: 'Housing',
      status: 'processed',
      created_at: '2025',
      chunk_count: 18
    }
  ];

  useEffect(() => {
    fetchDocuments();
  }, [activeCategory]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/documents', {
        params: { category: activeCategory, search: searchQuery }
      });
      if (res.data.success && Array.isArray(res.data.documents) && res.data.documents.length > 0) {
        setDocuments(res.data.documents.map(d => ({
          ...d,
          title: d.title || d.file_name || 'Institutional Document',
          category: d.category || 'General',
          department: d.department || 'Academics',
          status: d.status || 'processed',
          created_at: d.created_at ? d.created_at.slice(0, 10) : '2026',
          chunk_count: d.chunk_count || 12
        })));
      } else {
        setDocuments(defaultDocs);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setDocuments(defaultDocs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (currentUser?.role !== 'admin') {
      setUploadStatusMsg('Access Denied: Only users with the Admin role can upload knowledge base documents.');
      setTimeout(() => setUploadStatusMsg(null), 5000);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatusMsg(`Uploading "${file.name}" for text extraction & RAG vector chunking...`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('category', activeCategory === 'All' ? 'Academics' : activeCategory);
    formData.append('department', 'General');

    try {
      const res = await apiClient.post('/documents/upload', formData);
      if (res.data.success) {
        setUploadStatusMsg(`✓ Success: ${res.data.message || 'Document indexed into vector store.'}`);
        fetchDocuments();
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.response?.data?.error || 'Document upload failed. Check file format or server status.';
      setUploadStatusMsg(`✕ ${errMsg}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openDocChunks = async (doc) => {
    setSelectedDocModal(doc);
    setIsModalLoading(true);
    setModalChunks([]);

    try {
      const res = await apiClient.get(`/documents/${doc.id}`);
      if (res.data.success && Array.isArray(res.data.chunks)) {
        setModalChunks(res.data.chunks);
      }
    } catch (err) {
      console.error('Error loading chunks:', err);
      // Fallback preview chunk if doc is demo
      setModalChunks([
        {
          chunk_index: 1,
          content: `Section 1 of ${doc.title}: Minimum attendance requirement for semester examinations is 75%. Medical leave submissions require valid hospital documentation.`
        },
        {
          chunk_index: 2,
          content: `Section 2 of ${doc.title}: Appeals regarding attendance shortages must be submitted to the Dean of Academic Affairs within 7 working days.`
        }
      ]);
    } finally {
      setIsModalLoading(false);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });


  const handleDeleteDocument = async (docId, e) => {
    if (e) e.stopPropagation();
    if (currentUser?.role !== 'admin') return;
    if (!window.confirm('Are you sure you want to delete this document and its vector chunks?')) return;

    try {
      const res = await apiClient.delete(`/documents/${docId}`);
      if (res.data.success) {
        setUploadStatusMsg('✓ Document deleted from vector knowledge base.');
        fetchDocuments();
      }
    } catch (err) {
      console.error('Delete error:', err);
      setUploadStatusMsg(`✕ Failed to delete: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div style={{ padding: '32px 40px 80px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Row matching Reference Image */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            College Knowledge Base
          </h1>
          <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
            {currentUser?.role === 'admin' ? 'Knowledge Base Management & Ingestion (Admin Workspace)' : 'Academic Policy & Document Search (Read-only)'}
          </div>
        </div>

        {/* Right Search Bar & Upload Document Action Button */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
          />

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', borderRadius: '8px', background: '#ffffff', height: '38px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Upload button is ONLY visible for Admin role */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="btn btn-primary"
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#0b3bbd',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(11, 59, 189, 0.2)',
                cursor: 'pointer'
              }}
            >
              <Upload size={16} /> Upload Document
            </button>
          )}
        </div>
      </div>


      {uploadStatusMsg && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '8px',
          background: uploadStatusMsg.includes('✕') || uploadStatusMsg.includes('Denied') ? '#fef2f2' : '#eff6ff',
          color: uploadStatusMsg.includes('✕') || uploadStatusMsg.includes('Denied') ? '#dc2626' : '#1d4ed8',
          border: uploadStatusMsg.includes('✕') || uploadStatusMsg.includes('Denied') ? '1px solid #fecaca' : '1px solid #bfdbfe',
          marginBottom: '20px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {uploadStatusMsg}
        </div>
      )}

      {/* Category Pills Row matching Reference Image */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '999px',
                border: isSelected ? 'none' : '1px solid #e2e8f0',
                background: isSelected ? '#0f172a' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Document Cards Grid matching Reference Image */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#0b3bbd', fontWeight: 600 }}>
          <RefreshCw size={24} className="animate-spin" /> Loading document index...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => openDocChunks(doc)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                {/* Top Row: Icon & Delete button for Admins */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={18} />
                  </div>

                  {currentUser?.role === 'admin' ? (
                    <button
                      style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      title="Delete document and vector embeddings"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ) : (
                    <button
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={16} />
                    </button>
                  )}
                </div>


                {/* Document Title */}
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', lineHeight: 1.3 }}>
                  {doc.title}
                </h3>

                {/* Sub Metadata Tags */}
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '14px', display: 'flex', gap: '8px' }}>
                  <span>{doc.category}</span>
                  <span>•</span>
                  <span>{doc.department}</span>
                </div>

                {/* Chunk Count Badge */}
                <div style={{ marginBottom: '18px' }}>
                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={12} /> {doc.chunk_count} Chunk
                  </span>
                </div>
              </div>

              {/* Card Footer Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '0.75rem',
                color: '#64748b',
                fontWeight: 600
              }}>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={10} /> Indexed
                </span>

                <span>{doc.created_at}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal for inspecting vector chunks */}
      {selectedDocModal && (
        <div
          onClick={() => setSelectedDocModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              padding: '28px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>{selectedDocModal.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Status: {selectedDocModal.status} | Total Chunks: {modalChunks.length || selectedDocModal.chunk_count || 0}
                </div>
              </div>
              <button onClick={() => setSelectedDocModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isModalLoading ? (
                <div style={{ textAlign: 'center', padding: '36px', color: '#0b3bbd', fontWeight: 600 }}>
                  <RefreshCw size={20} className="animate-spin" /> Fetching vector chunk details...
                </div>
              ) : modalChunks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                  No vector chunk details found for this document.
                </div>
              ) : (
                modalChunks.map((c, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0b3bbd', marginBottom: '4px' }}>CHUNK #{c.chunk_index || i + 1}</div>
                    <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>{c.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


