import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AuthPage({ currentUser, setCurrentUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const userProfile = {
      email: email || (selectedRole === 'admin' ? 'demo@eduquery.ai' : 'student@eduquery.edu'),
      full_name: selectedRole === 'admin' ? 'Campus Admin' : 'Student',
      role: selectedRole
    };
    if (setCurrentUser) {
      setCurrentUser(userProfile);
    }
    navigate(selectedRole === 'admin' ? '/admin' : '/chat');
  };

  const handleDemoFill = () => {
    setEmail('demo@eduquery.ai');
    setPassword('demo123');
    setSelectedRole('student');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#f8fafc' }}>
      
      {/* Left Column: Deep Royal Blue / Purple Gradient Panel */}
      <div style={{
        flex: 1.2,
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #4c1d95 100%)',
        color: '#ffffff',
        padding: '60px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow shapes */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '480px', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.15, color: '#ffffff', marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Your College Knowledge, <br />
            Verified.
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '36px' }}>
            Access verified institutional knowledge and grounded research application.
          </p>

          <Link 
            to="/" 
            className="btn btn-secondary" 
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(8px)'
            }}
          >
            Explore Platform <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Right Column: Centered Auth Form Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#f8fafc'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
          width: '100%',
          maxWidth: '420px',
          padding: '40px 36px'
        }}>
          
          {/* Logo Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img
              src="https://res.cloudinary.com/dvakxuk58/image/upload/v1788005318/IMG_20260829_173724_xw36nc.png"
              alt="EduQuery AI Logo"
              style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '10px', margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(11, 59, 189, 0.25)' }}
            />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              EduQuery AI
            </h2>
          </div>


          {/* Segmented Log In / Register Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #f1f5f9',
            marginBottom: '28px'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                paddingBottom: '10px',
                border: 'none',
                background: 'transparent',
                borderBottom: isLogin ? '2px solid #0b3bbd' : '2px solid transparent',
                marginBottom: '-2px',
                fontWeight: isLogin ? 700 : 500,
                color: isLogin ? '#0b3bbd' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                paddingBottom: '10px',
                border: 'none',
                background: 'transparent',
                borderBottom: !isLogin ? '2px solid #0b3bbd' : '2px solid transparent',
                marginBottom: '-2px',
                fontWeight: !isLogin ? 700 : 500,
                color: !isLogin ? '#0b3bbd' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Register
            </button>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#475569' }}>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: '8px', padding: '10px 14px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#475569' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '8px', padding: '10px 38px 10px 14px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Radio Switcher matching Reference UI */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              margin: '20px 0 24px',
              fontSize: '0.875rem',
              color: '#334155',
              fontWeight: 600
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="userRole"
                  value="student"
                  checked={selectedRole === 'student'}
                  onChange={() => setSelectedRole('student')}
                  style={{ accentColor: '#0b3bbd' }}
                />
                <span>Student</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="userRole"
                  value="admin"
                  checked={selectedRole === 'admin'}
                  onChange={() => setSelectedRole('admin')}
                  style={{ accentColor: '#0b3bbd' }}
                />
                <span>Admin</span>
              </label>
            </div>

            {/* Login Button */}
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
                boxShadow: '0 4px 12px rgba(11, 59, 189, 0.25)'
              }}
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Bottom Links & Demo Account Helper */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Forgot pass? </span>
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: '#0b3bbd', fontWeight: 600, cursor: 'pointer' }}
            >
              {isLogin ? 'Register' : 'Login'}
            </span>
          </div>

          <div
            onClick={handleDemoFill}
            style={{
              marginTop: '20px',
              background: '#eff6ff',
              border: '1px dashed #93c5fd',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '0.78rem',
              color: '#1d4ed8',
              fontWeight: 600
            }}
          >
            ⚡ Auto-fill Demo Account Details
          </div>

        </div>
      </div>

    </div>
  );
}

