import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Plus, User, LogOut } from 'lucide-react';

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

  return (
    <aside className="sidebar">
      <div>
        {/* Logo Section */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              EQ
            </div>
            <div>
              <div className="sidebar-logo-title">EduQuery AI</div>
              <div className="sidebar-logo-sub">Academic Research</div>
            </div>
          </Link>

          {/* New Research Action Button */}
          <button 
            onClick={() => navigate('/chat')}
            className="btn-new-research"
          >
            <Plus size={16} /> New Research
          </button>
        </div>

        {/* Primary Navigation Links */}
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
      </div>

      {/* Footer Navigation Section */}
      <div className="sidebar-footer">
        <button className="sidebar-footer-item" onClick={() => navigate('/auth')}>
          <User size={18} />
          <span>Profile ({currentUser?.role || 'User'})</span>
        </button>

        <button className="sidebar-footer-item" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
