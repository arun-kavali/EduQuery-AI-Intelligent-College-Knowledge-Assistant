import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import { supabase } from './supabaseClient';

function AppLayout({ currentUser, setCurrentUser, handleLogout }) {
  const location = useLocation();
  const isDashboardRoute = ['/chat', '/documents', '/admin'].some(path => location.pathname.startsWith(path));
  const isAuthRoute = location.pathname === '/auth';

  // Strict Protection: Require authenticated user for all dashboard routes
  if (isDashboardRoute && !currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (isDashboardRoute) {
    return (
      <div className="dashboard-layout">
        <Sidebar currentUser={currentUser} setCurrentUser={setCurrentUser} handleLogout={handleLogout} />
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
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} handleLogout={handleLogout} />
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
        if (parsed && parsed.email && parsed.id) return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored user session:', e);
    }
    return null;
  });

  const [initializing, setInitializing] = useState(true);

  const fetchProfileAndSetUser = async (sessionUser, accessToken) => {
    if (!sessionUser) {
      handleSetUser(null);
      return;
    }

    try {
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (!profile) {
        const { data: pByEmail } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', sessionUser.email)
          .maybeSingle();
        profile = pByEmail;
      }

      const verifiedRole = profile?.role || (sessionUser.email?.includes('admin') ? 'admin' : 'student');
      const verifiedName = profile?.full_name || sessionUser.user_metadata?.full_name || sessionUser.email.split('@')[0];

      const userObj = {
        id: sessionUser.id,
        email: sessionUser.email,
        full_name: verifiedName,
        role: verifiedRole,
        token: accessToken || ''
      };

      handleSetUser(userObj);
    } catch (err) {
      console.error('Error fetching profile in auth change:', err);
    }
  };

  useEffect(() => {
    // Initial Supabase Session Sync
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfileAndSetUser(session.user, session.access_token);
      } else {
        handleSetUser(null);
      }
      setInitializing(false);
    });

    // Reactive Auth State Subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          fetchProfileAndSetUser(session.user, session.access_token);
        }
      } else if (event === 'SIGNED_OUT') {
        handleSetUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSetUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('eduquery_user', JSON.stringify(user));
    } else {
      // Complete Purge of Session, LocalStorage, SessionStorage & Caches on Logout
      localStorage.removeItem('eduquery_user');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('eduquery_') || key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout Exception:', err);
    } finally {
      handleSetUser(null);
    }
  };

  if (initializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#0b3bbd', fontWeight: 600 }}>
        Loading EduQuery AI Workspace...
      </div>
    );
  }

  return (
    <Router>
      <AppLayout currentUser={currentUser} setCurrentUser={handleSetUser} handleLogout={handleLogout} />
    </Router>
  );
}
