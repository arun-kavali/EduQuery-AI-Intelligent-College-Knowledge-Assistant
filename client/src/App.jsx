import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/admin" element={<AdminPage currentUser={currentUser} />} />
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
  const [currentUser, setCurrentUser] = useState({
    email: 'student@eduquery.edu',
    full_name: 'Demo Student',
    role: 'student'
  });

  return (
    <Router>
      <AppLayout currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </Router>
  );
}
