import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, FileText, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: '2024 Undergraduate Admissions Prospectus',
      category: 'Admissions',
      department: 'Registrar',
      status: 'INDEXED',
      created_at: '2023-10-12',
      chunk_count: 45
    },
    {
      id: 'doc-2',
      title: 'Faculty Code of Conduct V2.1',
      category: 'Policies',
      department: 'HR',
      status: 'PROCESSING',
      created_at: 'Just now',
      chunk_count: null
    },
    {
      id: 'doc-3',
      title: 'Tuition and Fee Schedule 2024-2025',
      category: 'Fees',
      department: 'Bursar',
      status: 'INDEXED',
      created_at: '2023-10-10',
      chunk_count: 12
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [modalChunks, setModalChunks] = useState([]);

  const categories = ['All', 'Admissions', 'Academics', 'Fees', 'Policies'];

  useEffect(() => {
    fetchDocuments();
  }, [activeCategory]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/documents', {
        params: { category: activeCategory, search: searchQuery }
      });
      if (res.data.success && res.data.documents.length > 0) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDocChunks = async (doc) => {
    setSelectedDocModal(doc);
    try {
      const res = await axios.get(`/api/documents/${doc.id}`);
      if (res.data.success) {
        setModalChunks(res.data.chunks || []);
      }
    } catch (err) {
      console.error('Error loading chunks:', err);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ padding: '36px 40px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            College Knowledge Base
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage and search indexed institutional documents.
          </p>
        </div>

        {/* Right Search Input & Filter Button */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', borderRadius: '8px', background: '#ffffff' }}
            />
          </div>

          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155'
          }}>
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Category Filter Pills Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: 'none',
              background: activeCategory === cat ? '#1d4ed8' : '#ffffff',
              color: activeCategory === cat ? '#ffffff' : '#475569',
              boxShadow: activeCategory === cat ? '0 2px 6px rgba(29, 78, 216, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Cards Grid */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#1d4ed8' }}>
          <RefreshCw size={24} className="animate-spin" /> Loading documents...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => openDocChunks(doc)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                {/* Header Row: Icon & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#f3e8ff',
                    color: '#7e22ce',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={20} />
                  </div>

                  {doc.status === 'INDEXED' ? (
                    <span style={{
                      background: '#e0f2fe',
                      color: '#0284c7',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      letterSpacing: '0.04em'
                    }}>
                      INDEXED
                    </span>
                  ) : (
                    <span style={{
                      background: '#f1f5f9',
                      color: '#64748b',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <RefreshCw size={12} className="animate-spin" /> PROCESSING
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', lineHeight: 1.35 }}>
                  {doc.title}
                </h3>

                {/* Metadata Tag Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '4px', fontWeight: 500 }}>
                    {doc.category}
                  </span>
                  {doc.department && (
                    <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '4px', fontWeight: 500 }}>
                      {doc.department}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '0.78rem',
                color: '#94a3b8',
                fontWeight: 500
              }}>
                <span>{doc.created_at}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={14} /> {doc.chunk_count !== null ? `${doc.chunk_count} Chunks` : '-- Chunks'}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing vector chunks */}
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
              maxWidth: '650px',
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
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{selectedDocModal.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Status: {selectedDocModal.status} | Total Chunks: {selectedDocModal.chunk_count || 0}
                </div>
              </div>
              <button onClick={() => setSelectedDocModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modalChunks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                  No vector chunk details found or loading...
                </div>
              ) : (
                modalChunks.map((c, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '4px' }}>CHUNK #{c.chunk_index}</div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{c.content}</div>
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
