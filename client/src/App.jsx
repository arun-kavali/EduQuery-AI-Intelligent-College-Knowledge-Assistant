import React, { useState, useEffect } from 'react';
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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return {
      email: 'student@eduquery.edu',
      full_name: 'Demo Student',
      role: 'student'
    };
  });

  const handleSetUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('eduquery_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eduquery_user');
    }
  };

  return (
    <Router>
      <AppLayout currentUser={currentUser} setCurrentUser={handleSetUser} />
    </Router>
  );
}

