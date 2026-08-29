import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';

function AppLayout({ currentUser, setCurrentUser }) {
  const location = useLocation();
  const isDashboardRoute = ['/chat', '/documents', '/admin'].some(path => location.pathname.startsWith(path));
  const isAuthRoute = location.pathname === '/auth';

  // Strict Protection: Require login for all dashboard routes
  if (isDashboardRoute && !currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (isDashboardRoute) {
    return (
      <div className="dashboard-layout">
        <Sidebar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <main className="dashboard-main">
          <Routes>
            <Route path="/chat" element={<ChatPage currentUser={currentUser} />} />
            <Route path="/chat/:conversationId" element={<ChatPage currentUser={currentUser} />} />
            <Route path="/documents" element={<DocumentsPage currentUser={currentUser} />} />
            <Route
              path="/admin"
              element={
                currentUser?.role === 'admin' ? (
                  <AdminPage currentUser={currentUser} />
                ) : (
                  <Navigate to="/chat" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    );
  }

  if (isAuthRoute) {
    if (currentUser) {
      return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/chat'} replace />;
    }
    return <AuthPage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="app-container">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('eduquery_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    return null;
  });

  const handleSetUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('eduquery_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eduquery_user');
      // Clear conversation caches on logout to guarantee complete data isolation
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('eduquery_conversations_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  return (
    <Router>
      <AppLayout currentUser={currentUser} setCurrentUser={handleSetUser} />
    </Router>
  );
}
