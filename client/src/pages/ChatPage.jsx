import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Paperclip, Send, CheckCircle2, BookOpen, ExternalLink, RefreshCw, Mic, Sparkles, FileText, User } from 'lucide-react';

export default function ChatPage({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([
    // Initial reference conversation matching center reference Image
    {
      id: 'demo-1',
      sender: 'user',
      user_label: 'Student',
      content: 'What is the minimum attendance requirement for semester examinations?'
    },
    {
      id: 'demo-2',
      sender: 'assistant',
      confidence: 'High Confidence',
      is_verified: true,
      content: 'What is the minimum attendance requirement for semester examinations? Articles are to minimum on attendance issued once standard policies content on semester examination requirements, and another requirements and non-attendance shows top the values in the grounded response.',
      citations: [
        { id: 1, document_title: 'Examination Regulations', category: 'DOCUMENT', similarity_score: 93, snippet: 'This is minimum attendance requirement for semester examinations 7 Absences it on...' },
        { id: 2, document_title: 'Examax Regulations', category: 'POLICY', similarity_score: 78, snippet: 'Snippet on minimum attendance requirement for semester examination for to...' },
        { id: 3, document_title: 'Examination Regulations', category: 'DOCUMENT', similarity_score: 89, snippet: 'Snippet have no exemptions attendance requirements to relevant policy and agreement...' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([
    {
      id: 1,
      document_title: 'Examination Re...',
      type_label: 'Document',
      category: 'DOCUMENT',
      similarity_score: 93,
      badge_color: 'blue',
      snippet: 'This is minimum attendance requirement for semester examinations 7 Absences it on...'
    },
    {
      id: 2,
      document_title: 'Student Atten...',
      type_label: 'Policy',
      category: 'POLICY',
      similarity_score: 78,
      badge_color: 'green',
      snippet: 'Snippet on minimum attendance requirement for semester examination for to...'
    },
    {
      id: 3,
      document_title: 'Student Atten...',
      type_label: 'Document',
      category: 'DOCUMENT',
      similarity_score: 89,
      badge_color: 'green',
      snippet: 'Snippet have no exemptions attendance requirements to relevant policy and agreement...'
    }
  ]);
  const [activeCitationModal, setActiveCitationModal] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/chat/conversations');
      if (res.data.success && res.data.conversations.length > 0) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage;
    setInputMessage('');
    const userMsg = { sender: 'user', user_label: currentUser?.role || 'Student', content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await axios.post('/api/chat/query', {
        message: userText,
        conversation_id: currentConvId
      });

      if (res.data.success) {
        if (!currentConvId && res.data.conversation_id) {
          setCurrentConvId(res.data.conversation_id);
        }

        const newCitations = res.data.citations || [];
        const botMsg = {
          id: res.data.message_id || Date.now(),
          sender: 'assistant',
          content: res.data.answer,
          citations: newCitations,
          confidence: res.data.is_unknown ? 'Low Confidence' : 'High Confidence',
          is_verified: !res.data.is_unknown
        };

        setMessages((prev) => [...prev, botMsg]);
        if (newCitations.length > 0) {
          setActiveSources(newCitations.map((c, idx) => ({
            id: c.id || idx + 1,
            document_title: c.document_title || `Source Doc ${idx + 1}`,
            type_label: c.category || 'Document',
            category: c.category || 'DOCUMENT',
            similarity_score: c.similarity_score || 90,
            badge_color: c.similarity_score > 85 ? 'blue' : 'green',
            snippet: c.snippet || ''
          })));
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'An error occurred while connecting with the backend RAG pipeline. Please ensure the backend server is running.',
          citations: [],
          confidence: 'Error',
          is_verified: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      
      {/* Top Header matching reference image */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            AI Research Assistant
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Cowtiegen courcen assistant
          </div>
        </div>

        {/* Top-Right Green Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
            Knowledge Base: Online
          </div>

          <div style={{
            background: '#dcfce7',
            color: '#15803d',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
            AI Status: Ready
          </div>
        </div>
      </header>

      {/* Main Body Grid: Chat Feed (Left) + Active Sources Panel (Right) */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        
        {/* Chat Feed Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 36px', overflowY: 'auto' }}>
          
          {/* Messages Feed Container */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ width: '100%' }}>
                
                {msg.sender === 'user' ? (
                  /* Student Question Card */
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#e2e8f0',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      <User size={18} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {msg.user_label || 'Student'}
                      </div>
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        fontSize: '0.925rem',
                        color: '#0f172a',
                        lineHeight: 1.5,
                        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Assistant Response Card with Badges & Citation Pills */
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {/* Purple Sparkle AI Logo Icon */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: '#7e22ce',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(126, 34, 206, 0.25)'
                    }}>
                      <Sparkles size={18} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        background: '#f8f5ff',
                        border: '1px solid #e9d5ff',
                        borderRadius: '14px',
                        padding: '20px 24px',
                        boxShadow: '0 2px 8px rgba(126, 34, 206, 0.05)'
                      }}>
                        {/* Status Badges Row inside AI Card */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                          <span style={{
                            background: '#f3e8ff',
                            color: '#7e22ce',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {msg.confidence || 'High Confidence'}
                          </span>

                          {msg.is_verified !== false && (
                            <span style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #bbf7d0',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <CheckCircle2 size={12} /> Verified Answer
                            </span>
                          )}
                        </div>

                        {/* Text Content */}
                        <div style={{ fontSize: '0.925rem', color: '#1e293b', lineHeight: 1.6, marginBottom: '18px', whiteSpace: 'pre-wrap' }}>
                          {msg.content}
                        </div>

                        {/* Citation Pills Row */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #e9d5ff' }}>
                            {msg.citations.map((cit, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => setActiveCitationModal(cit)}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid #d8b4fe',
                                  borderRadius: '6px',
                                  padding: '4px 10px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#7e22ce',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                [{cit.id || cIdx + 1}] {cit.document_title}
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7e22ce', fontSize: '0.875rem', fontWeight: 600, paddingLeft: '46px' }}>
                <RefreshCw size={16} className="animate-spin" /> Synthesizing grounded response from documents...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Prompt Bar matching Reference Image */}
          <div style={{ maxWidth: '780px', margin: '20px auto 0', width: '100%' }}>
            <form
              onSubmit={handleSendMessage}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '999px',
                padding: '6px 10px 6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color="#64748b" />
              </div>

              <Paperclip size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
              
              <input
                type="text"
                placeholder="AI floating AI prompt..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  background: 'transparent'
                }}
              />

              <Mic size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: inputMessage.trim() ? '#0b3bbd' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() ? 'pointer' : 'default',
                  transition: 'background 0.15s ease',
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Right Active Sources Drawer matching Reference Image */}
        <aside style={{
          width: '300px',
          minWidth: '300px',
          background: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Active Sources
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeSources.map((source, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} color="#0b3bbd" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {source.document_title}
                    </span>
                  </div>

                  <span style={{
                    background: source.badge_color === 'blue' ? '#eff6ff' : '#dcfce7',
                    color: source.badge_color === 'blue' ? '#1d4ed8' : '#15803d',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}>
                    {source.similarity_score}%
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                  {source.type_label || 'Document'}
                </div>

                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, marginBottom: '10px' }}>
                  {source.snippet}
                </p>

                <button
                  onClick={() => setActiveCitationModal(source)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0b3bbd',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  View source <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

      </div>

      {/* Citation Detail Modal */}
      {activeCitationModal && (
        <div
          onClick={() => setActiveCitationModal(null)}
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
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '6px' }}>{activeCitationModal.category || 'DOCUMENT'}</span>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{activeCitationModal.document_title}</h3>
              </div>
              <button onClick={() => setActiveCitationModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6 }}>
              {activeCitationModal.snippet}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

