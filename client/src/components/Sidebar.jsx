import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Plus, User, LogOut, Clock } from 'lucide-react';

export default function Sidebar({ currentUser, setCurrentUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/chat') {
      return location.pathname.startsWith('/chat');
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (setCurrentUser) {
      setCurrentUser(null);
    }
    navigate('/auth');
  };

  // Mock conversation history list matching reference image
  const historyItems = [
    { id: '1', title: 'conversation history' },
    { id: '2', title: 'conversation histor...' },
    { id: '3', title: 'conversation histor...' },
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* Brand Logo Section */}
        <Link to="/" className="sidebar-brand">
          <div className="sidebar-logo-icon">
            EQ
          </div>
          <div>
            <div className="sidebar-brand-title">EduQuery AI</div>
            <div className="sidebar-brand-sub">Cowtiegen courcen assistant</div>
          </div>
        </Link>

        {/* Primary Action Button */}
        <button 
          onClick={() => navigate('/chat')}
          className="btn-new-research"
        >
          <Plus size={16} /> New Research
        </button>

        {/* Main Navigation */}
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

          <Link 
            to="/admin" 
            className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Conversation History List */}
        <div className="sidebar-section-title">Conversation</div>
        <div className="sidebar-history-list">
          {historyItems.map((item) => (
            <Link
              key={item.id}
              to={`/chat`}
              className="sidebar-history-item"
            >
              <Clock size={14} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card" onClick={() => navigate('/auth')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-avatar">
            {currentUser?.full_name ? currentUser.full_name.charAt(0) : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.full_name || 'User profile'}
            </div>
            <div className="sidebar-user-role">
              {currentUser?.role || 'student'}
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
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

