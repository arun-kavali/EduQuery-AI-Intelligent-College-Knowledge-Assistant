import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Upload, FileText, Layers, RefreshCw, CheckCircle2, MoreVertical } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'Examination Regulations 2026',
      category: 'Category',
      department: 'Departments',
      status: 'INDEXED',
      created_at: 'Uploaded 2026',
      chunk_count: 35
    },
    {
      id: 'doc-2',
      title: 'Student Attendance Policy',
      category: 'Category',
      department: 'Departments',
      status: 'INDEXED',
      created_at: 'Uploaded 2024',
      chunk_count: 24
    },
    {
      id: 'doc-3',
      title: 'Student Attendance Policy',
      category: 'Category',
      department: 'Departments',
      status: 'INDEXED',
      created_at: 'Uploaded 2028',
      chunk_count: 35
    },
    {
      id: 'doc-4',
      title: 'Student Attendance Policy',
      category: 'Category',
      department: 'Departments',
      status: 'INDEXED',
      created_at: 'Uploaded 2023',
      chunk_count: 23
    },
    {
      id: 'doc-5',
      title: 'Examination Regulations 2026',
      category: 'Category',
      department: 'Departments',
      status: 'INDEXED',
      created_at: 'Uploaded 2024',
      chunk_count: 35
    },
    {
      id: 'doc-6',
      title: 'Student Attendance Policy',
      category: 'Category',
      department: 'Departments',
      status: 'INDEXED',
      created_at: 'Uploaded 2023',
      chunk_count: 35
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [modalChunks, setModalChunks] = useState([]);

  const categories = ['All', 'Admissions', 'Academics', 'Fees', 'Exams', 'Policies'];

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
        setDocuments(res.data.documents.map(d => ({
          ...d,
          title: d.title || 'Institutional Document',
          category: d.category || 'Category',
          department: d.department || 'Departments',
          status: d.status || 'INDEXED',
          created_at: d.created_at ? `Uploaded ${d.created_at.slice(0, 4)}` : 'Uploaded 2026',
          chunk_count: d.chunk_count || 35
        })));
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
    <div style={{ padding: '32px 40px 80px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Row matching Reference Image */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          College Knowledge Base
        </h1>

        {/* Right Search Bar & Upload Document Action Button */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
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

          <button
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
              boxShadow: '0 2px 6px rgba(11, 59, 189, 0.2)'
            }}
          >
            Upload Document
          </button>
        </div>
      </div>

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
                {/* Top Row: Icon & Three Dots */}
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

                  <button
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={16} />
                  </button>
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
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0b3bbd', marginBottom: '4px' }}>CHUNK #{c.chunk_index}</div>
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

