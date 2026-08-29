import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Paperclip, Send, CheckCircle2, BookOpen, ExternalLink, RefreshCw, Mic, Sparkles, FileText, User, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function ChatPage({ currentUser }) {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const [activeCitationModal, setActiveCitationModal] = useState(null);
  const [feedbackState, setFeedbackState] = useState({}); // { [messageId]: 'positive' | 'negative' }
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser?.id) {
      fetchConversations();
    } else {
      setConversations([]);
      setMessages([]);
      setCurrentConvId(null);
      setActiveSources([]);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (conversationId && currentUser?.id) {
      loadConversationMessages(conversationId);
    } else {
      setCurrentConvId(null);
      setMessages([]);
      setActiveSources([]);
    }
  }, [conversationId, currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fetchConversations = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await apiClient.get('/chat/conversations');
      if (res.data.success && Array.isArray(res.data.conversations)) {
        setConversations(res.data.conversations);
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversations([]);
    }
  };

  const loadConversationMessages = async (id) => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    setCurrentConvId(id);
    try {
      const res = await apiClient.get(`/chat/conversations/${id}`);
      if (res.data.success && Array.isArray(res.data.messages)) {
        const formatted = res.data.messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          user_label: m.sender === 'user' ? (currentUser?.role || 'Student') : null,
          content: m.content,
          citations: m.citations || [],
          confidence: m.is_unknown ? 'Low Confidence' : 'High Confidence',
          is_verified: !m.is_unknown,
          feedback: m.feedback
        }));
        setMessages(formatted);

        // Collect citations
        const allCitations = [];
        res.data.messages.forEach((m) => {
          if (m.sender === 'assistant' && Array.isArray(m.citations)) {
            allCitations.push(...m.citations);
          }
        });

        if (allCitations.length > 0) {
          setActiveSources(allCitations.map((c, idx) => ({
            id: c.id || idx + 1,
            document_title: c.document_title || `Source Doc ${idx + 1}`,
            type_label: c.category || 'Document',
            category: c.category || 'DOCUMENT',
            similarity_score: c.similarity_score || 90,
            badge_color: (c.similarity_score || 90) > 85 ? 'blue' : 'green',
            snippet: c.snippet || ''
          })));
        } else {
          setActiveSources([]);
        }
      }
    } catch (err) {
      console.error('Error loading conversation messages:', err);
      setMessages([]);
      setActiveSources([]);
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate('/chat', { replace: true });
      }
    } finally {
      setIsLoading(false);
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
      const res = await apiClient.post('/chat/query', {
        message: userText,
        conversation_id: currentConvId
      });

      if (res.data.success) {
        if (!currentConvId && res.data.conversation_id) {
          setCurrentConvId(res.data.conversation_id);
          navigate(`/chat/${res.data.conversation_id}`, { replace: true });
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
        fetchConversations();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'An error occurred while communicating with the RAG pipeline. Please check server connectivity.',
          citations: [],
          confidence: 'Error',
          is_verified: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, rating) => {
    if (!messageId) return;
    setFeedbackState((prev) => ({ ...prev, [messageId]: rating }));
    try {
      await apiClient.post('/chat/feedback', {
        message_id: messageId,
        feedback: rating
      });
    } catch (err) {
      console.error('Error recording feedback:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header */}
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
            AI College Research Assistant
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
            Grounded RAG Search & Institutional Policy Verification
          </div>
        </div>

        {/* Status Badges */}
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
            pgvector Base: Online
          </div>

          <div style={{
            background: '#dbeafe',
            color: '#1d4ed8',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={13} />
            Gemini LLM: Ready
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        
        {/* Chat Feed Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 36px', overflowY: 'auto' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
            
            {messages.length === 0 && !isLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#f3e8ff', color: '#7e22ce', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Sparkles size={28} />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  Welcome to EduQuery AI
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                  Ask any question regarding institutional regulations, course attendance rules, grading policies, fees, or campus guidelines.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setInputMessage('What is the minimum attendance requirement for semester exams?'); }}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                  >
                    "What is minimum attendance for exams?"
                  </button>
                  <button
                    onClick={() => { setInputMessage('What is the GPA grading scale for courses?'); }}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                  >
                    "What is the GPA grading scale?"
                  </button>
                </div>
              </div>
            )}

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
                  /* Assistant Response Card */
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                                <CheckCircle2 size={12} /> Verified Grounded Answer
                              </span>
                            )}
                          </div>

                          {/* Thumbs Up / Down Feedback Controls */}
                          {msg.id && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => handleFeedback(msg.id, 'positive')}
                                title="Helpful answer"
                                style={{
                                  background: feedbackState[msg.id] === 'positive' ? '#dcfce7' : '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: feedbackState[msg.id] === 'positive' ? '#15803d' : '#64748b',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <ThumbsUp size={13} />
                              </button>

                              <button
                                onClick={() => handleFeedback(msg.id, 'negative')}
                                title="Not helpful"
                                style={{
                                  background: feedbackState[msg.id] === 'negative' ? '#fef2f2' : '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: feedbackState[msg.id] === 'negative' ? '#dc2626' : '#64748b',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <ThumbsDown size={13} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ fontSize: '0.925rem', color: '#1e293b', lineHeight: 1.6, marginBottom: '18px', whiteSpace: 'pre-wrap' }}>
                          {msg.content}
                        </div>

                        {/* Citations */}
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
                                  gap: '4px'
                                }}
                              >
                                [{cIdx + 1}] {cit.document_title} ({cit.similarity_score}%)
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
                <RefreshCw size={16} className="animate-spin" /> Synthesizing grounded response from verified documents...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Prompt Bar */}
          <div style={{ maxWidth: '820px', margin: '20px auto 0', width: '100%' }}>
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

              <input
                type="text"
                placeholder="Ask any question about college regulations, fees, exams, or policies..."
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

        {/* Right Active Sources Drawer */}
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
            Retrieved Sources ({activeSources.length})
          </div>

          {activeSources.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '12px 0' }}>
              No active sources retrieved yet. Submit a query to see grounded document citations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeSources.map((source, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                      <FileText size={15} color="#0b3bbd" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {source.document_title}
                      </span>
                    </div>

                    <span style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      flexShrink: 0
                    }}>
                      {source.similarity_score}%
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, marginBottom: '8px' }}>
                    "{source.snippet}"
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
                    Inspect source text <ExternalLink size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            zIndex: 9999,
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
                <span style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  {activeCitationModal.category || 'DOCUMENT'}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '6px 0 0 0', fontWeight: 800 }}>
                  {activeCitationModal.document_title}
                </h3>
              </div>
              <button onClick={() => setActiveCitationModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              "{activeCitationModal.snippet}"
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
