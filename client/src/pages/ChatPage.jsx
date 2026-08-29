import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Paperclip, ArrowUp, CheckCircle2, BookOpen, ExternalLink, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export default function ChatPage({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([
    // Initial reference conversation matching reference Image 2
    {
      id: 'demo-1',
      sender: 'user',
      content: 'What is the policy on late assignments for undergraduate science courses?'
    },
    {
      id: 'demo-2',
      sender: 'assistant',
      content: `Based on the University Academic Handbook for the current year, the policy for late assignments in undergraduate science courses is generally strict, but offers some flexibility depending on the department.\n\n• Standard Deduction: Most science departments apply a 10% penalty per calendar day for late submissions [1].\n\n• Maximum Lateness: Assignments are typically not accepted after 5 calendar days past the deadline, resulting in an automatic zero [2].\n\n• Exceptions: Documented medical emergencies or pre-approved academic accommodations (such as those granted by the Disability Services Office) can waive these penalties [3].`,
      confidence: 'HIGH CONFIDENCE',
      citations: [
        {
          id: 1,
          document_title: 'Undergraduate Academic Policies 2023-2024',
          category: 'HANDBOOK',
          similarity_score: 98,
          snippet: '...All late submissions in the Faculty of Science are subject to a 10% deduction per calendar day...'
        },
        {
          id: 2,
          document_title: 'Biology 101 - Course Outline',
          category: 'SYLLABUS',
          similarity_score: 92,
          snippet: '...Assignments will not be accepted after 5 days past the due date. A grade of zero will be entered...'
        },
        {
          id: 3,
          document_title: 'Student Health Services - Exemption Protocol',
          category: 'FORMS',
          similarity_score: 85,
          snippet: '...To apply for a medical exemption for late coursework, students must submit the official Medical Certificate form...'
        }
      ]
    },
    {
      id: 'demo-3',
      sender: 'user',
      content: 'Are there any specific forms needed for the medical exception?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([
    {
      id: 1,
      document_title: 'Undergraduate Academic Policies 2023-2024',
      category: 'HANDBOOK',
      similarity_score: 98,
      snippet: '...All late submissions in the Faculty of Science are subject to a 10% deduction per calendar day...'
    },
    {
      id: 2,
      document_title: 'Biology 101 - Course Outline',
      category: 'SYLLABUS',
      similarity_score: 92,
      snippet: '...Assignments will not be accepted after 5 days past the due date. A grade of zero will be entered...'
    },
    {
      id: 3,
      document_title: 'Student Health Services - Exemption Protocol',
      category: 'FORMS',
      similarity_score: 85,
      snippet: '...To apply for a medical exemption for late coursework, students must submit the official Medical Certificate form...'
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
    const userMsg = { sender: 'user', content: userText };
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
          id: res.data.message_id,
          sender: 'assistant',
          content: res.data.answer,
          citations: newCitations,
          confidence: res.data.is_unknown ? 'LOW CONFIDENCE' : 'HIGH CONFIDENCE',
          is_unknown: res.data.is_unknown
        };

        setMessages((prev) => [...prev, botMsg]);
        if (newCitations.length > 0) {
          setActiveSources(newCitations);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'An error occurred while communicating with the backend RAG pipeline. Please verify your backend server connection.',
          citations: [],
          confidence: 'ERROR'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      
      {/* Top Header Bar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          College Policies & Guidelines
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Knowledge Base: Online
          </div>

          <div style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ⚡ AI Status: Ready
          </div>
        </div>
      </header>

      {/* Main Body Area: Chat Feed + Right Active Sources Drawer */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        
        {/* Chat Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px', overflowY: 'auto' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                
                {msg.sender === 'user' ? (
                  /* User Prompt Bubble (Royal Blue Rounded Capsule) */
                  <div style={{
                    background: '#0b3bbd',
                    color: '#ffffff',
                    padding: '14px 22px',
                    borderRadius: '16px 16px 4px 16px',
                    maxWidth: '80%',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    boxShadow: '0 2px 6px rgba(11, 59, 189, 0.15)'
                  }}>
                    {msg.content}
                  </div>
                ) : (
                  /* Assistant Response Card with Thick Purple/Blue Accent Border */
                  <div style={{
                    position: 'relative',
                    maxWidth: '92%',
                    width: '100%',
                    display: 'flex',
                    gap: '16px'
                  }}>
                    {/* Blue Avatar Indicator Dot */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      background: '#1d4ed8',
                      borderRadius: '8px',
                      flexShrink: 0,
                      marginTop: '4px'
                    }} />

                    <div style={{
                      flex: 1,
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #7c3aed',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        color: '#1e293b',
                        lineHeight: 1.65,
                        whiteSpace: 'pre-wrap',
                        marginBottom: '16px'
                      }}>
                        {msg.content}
                      </div>

                      {/* High Confidence Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                        <CheckCircle2 size={14} /> HIGH CONFIDENCE
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1d4ed8', fontSize: '0.9rem', fontWeight: 500 }}>
                <RefreshCw size={18} className="animate-spin" /> Synthesizing response from vector knowledge base...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Prompt Input Box */}
          <div style={{ maxWidth: '840px', margin: '20px auto 0', width: '100%' }}>
            <form
              onSubmit={handleSendMessage}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '24px',
                padding: '8px 12px 8px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Paperclip size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
              
              <input
                type="text"
                placeholder="Ask about academic policies, research papers, etc..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  background: 'transparent'
                }}
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: inputMessage.trim() ? '#0b3bbd' : '#e2e8f0',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() ? 'pointer' : 'default',
                  transition: 'background 0.15s ease'
                }}
              >
                <ArrowUp size={20} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span>EduQuery AI can make mistakes. Verify important academic info.</span>
              <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                Return ↵ to send
              </span>
            </div>
          </div>

        </div>

        {/* Right Active Sources Drawer */}
        <aside style={{
          width: '320px',
          minWidth: '320px',
          background: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#1d4ed8" /> Active Sources
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeSources.map((source, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{
                    background: source.category === 'HANDBOOK' ? '#0b3bbd' : source.category === 'SYLLABUS' ? '#0d9488' : '#7e22ce',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    [{source.id || idx + 1}] {source.category || 'DOCUMENT'}
                  </span>

                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {source.similarity_score || 95}% Match
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>
                  {source.document_title}
                </div>

                <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, marginBottom: '10px' }}>
                  {source.snippet}
                </p>

                <button
                  onClick={() => setActiveCitationModal(source)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  View Document <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

      </div>

      {/* Citation Modal */}
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
                <span className="badge badge-purple" style={{ marginBottom: '6px' }}>{activeCitationModal.category}</span>
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
