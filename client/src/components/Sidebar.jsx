import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Plus, LogOut, Clock, Shield, Trash2 } from 'lucide-react';
import apiClient from '../api/apiClient';

const LOGO_URL = 'https://res.cloudinary.com/dvakxuk58/image/upload/v1788005318/IMG_20260829_173724_xw36nc.png';

export default function Sidebar({ currentUser, setCurrentUser, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchConversations();
    } else {
      setConversations([]);
    }
  }, [location.pathname, currentUser?.id]);

  const fetchConversations = async () => {
    if (!currentUser?.id) {
      setConversations([]);
      return;
    }
    try {
      const res = await apiClient.get('/chat/conversations');
      if (res.data.success && Array.isArray(res.data.conversations)) {
        setConversations(res.data.conversations);
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error('Error fetching conversations in sidebar:', err);
      setConversations([]);
    }
  };

  const isActive = (path) => {
    if (path === '/chat') {
      return location.pathname === '/chat' || location.pathname.startsWith('/chat/');
    }
    return location.pathname === path;
  };

  const onLogoutClick = async (e) => {
    if (e) e.stopPropagation();
    if (handleLogout) {
      await handleLogout();
    } else if (setCurrentUser) {
      setCurrentUser(null);
    }
    navigate('/auth', { replace: true });
  };


  const handleDeleteConv = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await apiClient.delete(`/chat/conversations/${id}`);
      if (res.data.success) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (location.pathname === `/chat/${id}`) {
          navigate('/chat', { replace: true });
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  return (
    <aside className="sidebar">
      <div>
        {/* Brand Logo Section using Cloudinary Image Logo */}
        <Link to="/" className="sidebar-brand">
          <img
            src={LOGO_URL}
            alt="EduQuery AI Logo"
            style={{
              width: '36px',
              height: '36px',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(11, 59, 189, 0.25)'
            }}
          />
          <div>
            <div className="sidebar-brand-title">EduQuery AI</div>
            <div className="sidebar-brand-sub">College RAG Assistant</div>
          </div>
        </Link>

        {/* Primary Action Button */}
        <button 
          onClick={() => navigate('/chat')}
          className="btn-new-research"
        >
          <Plus size={16} /> New Research
        </button>

        {/* Main Navigation with Strict Role-Based Conditional Rendering */}
        <nav className="sidebar-nav">
          <Link 
            to="/chat" 
            className={`sidebar-nav-item ${isActive('/chat') ? 'active' : ''}`}
          >
            <MessageSquare size={18} />
            <span>AI Chat</span>
          </Link>

          <Link 
            to="/documents" 
            className={`sidebar-nav-item ${isActive('/documents') ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span>Documents</span>
          </Link>

          {/* Admin tab is ONLY visible when user role is strictly 'admin' */}
          {currentUser?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
            >
              <Shield size={18} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Conversation History List */}
        <div className="sidebar-section-title">Conversation History</div>
        <div className="sidebar-history-list">
          {conversations.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', padding: '8px 12px' }}>
              No recent chats
            </div>
          ) : (
            conversations.slice(0, 8).map((item) => {
              const isSelectedConv = location.pathname === `/chat/${item.id}`;
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '6px',
                    background: isSelectedConv ? '#eff6ff' : 'transparent',
                    padding: '2px 4px',
                    marginBottom: '2px'
                  }}
                >
                  <Link
                    to={`/chat/${item.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      fontSize: '0.8rem',
                      color: isSelectedConv ? '#0b3bbd' : '#475569',
                      fontWeight: isSelectedConv ? 700 : 500,
                      textDecoration: 'none',
                      flex: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <Clock size={14} color={isSelectedConv ? '#0b3bbd' : '#94a3b8'} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title || 'Conversation'}
                    </span>
                  </Link>

                  <button
                    onClick={(e) => handleDeleteConv(e, item.id)}
                    title="Delete Conversation"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>


      {/* Bottom User Profile Section */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={() => navigate('/auth')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-avatar">
            {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.full_name || 'User profile'}
            </div>
            <div className="sidebar-user-role" style={{ textTransform: 'capitalize' }}>
              {currentUser?.role || 'student'}
            </div>
          </div>
          <button 
            onClick={onLogoutClick}
            title="Logout"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <LogOut size={16} />
          </button>

        </div>
      </div>
    </aside>
  );
}

