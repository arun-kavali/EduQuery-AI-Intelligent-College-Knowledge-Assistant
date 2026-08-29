import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Lock, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';

export default function AuthPage({ currentUser, setCurrentUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const userProfile = {
      email: email || (selectedRole === 'admin' ? 'demo@eduquery.ai' : 'student@eduquery.edu'),
      full_name: selectedRole === 'admin' ? 'Campus Admin' : 'Alex Student',
      role: selectedRole
    };
    setCurrentUser(userProfile);
    navigate(selectedRole === 'admin' ? '/admin' : '/chat');
  };

  const handleDemoFill = () => {
    setEmail('demo@eduquery.ai');
    setPassword('demo123');
    setSelectedRole('student');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      
      {/* Left Column: Purple Indigo Brand Banner */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
        color: '#ffffff',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#ffffff' }}>
          <div style={{ width: '36px', height: '36px', background: '#ffffff', color: '#4338ca', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>EduQuery AI</span>
        </Link>

        {/* Hero Text */}
        <div style={{ maxWidth: '480px', margin: 'auto 0' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Your College Knowledge, Verified.
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#c7d2fe', lineHeight: 1.6, marginBottom: '40px' }}>
            Access high-fidelity academic information retrieval. Engineered for rigorous research and seamless synthesis.
          </p>

          {/* Classroom Graphic Card Overlay */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '180px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>EQ EduQuery AI</div>
              <div style={{ fontSize: '0.9rem', color: '#e0e7ff' }}>Welcome back!</div>
            </div>
            
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', fontWeight: 600, color: '#ffffff' }}>
              <ShieldCheck size={16} color="#a5b4fc" />
              <span>Trusted by 500+ Institutions</span>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div style={{ fontSize: '0.825rem', color: '#a5b4fc' }}>
          © 2024 EduQuery AI. All rights reserved.
        </div>
      </div>

      {/* Right Column: Clean White Sign In Form */}
      <div style={{
        width: '560px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              {isLogin ? 'Welcome back' : 'Create an Account'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Sign in to continue your research.
            </p>
          </div>

          {/* Segmented Log In / Register Toggle */}
          <div style={{
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: isLogin ? '#ffffff' : 'transparent',
                boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontWeight: isLogin ? 700 : 500,
                color: isLogin ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: !isLogin ? '#ffffff' : 'transparent',
                boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontWeight: !isLogin ? 700 : 500,
                color: !isLogin ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Register
            </button>
          </div>

          {/* Role Toggle Switcher: Student vs Admin */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: selectedRole === 'student' ? '2px solid #1d4ed8' : '1px solid #e2e8f0',
                background: selectedRole === 'student' ? '#eff6ff' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                color: selectedRole === 'student' ? '#1d4ed8' : '#475569',
                cursor: 'pointer'
              }}
            >
              <GraduationCap size={18} /> Student
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: selectedRole === 'admin' ? '2px solid #1d4ed8' : '1px solid #e2e8f0',
                background: selectedRole === 'admin' ? '#eff6ff' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600,
                color: selectedRole === 'admin' ? '#1d4ed8' : '#475569',
                cursor: 'pointer'
              }}
            >
              <Lock size={18} /> Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label className="form-label">Institutional Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#forgot" style={{ fontSize: '0.78rem', color: '#1d4ed8', fontWeight: 600 }}>Forgot password?</a>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#0b3bbd',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '24px 0',
            color: '#94a3b8',
            fontSize: '0.85rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span>Or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* SSO Button */}
          <button
            type="button"
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}
          >
            <Landmark size={18} /> Continue with Institution SSO
          </button>

          {/* Bottom Purple Demo Card Callout */}
          <div
            onClick={handleDemoFill}
            style={{
              background: '#f3e8ff',
              border: '1px dashed #c084fc',
              borderRadius: '10px',
              padding: '14px 16px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7e22ce', marginBottom: '4px' }}>
              Try Demo Account
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b21a8' }}>
              Use <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>demo@eduquery.ai</code> / <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>demo123</code>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
