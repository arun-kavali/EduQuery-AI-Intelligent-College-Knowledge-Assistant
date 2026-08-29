import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase as sbClient } from '../supabaseClient';


export default function AuthPage({ currentUser, setCurrentUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!email || !password) {
      setAuthError('Please enter both email address and password.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Strict Login: ONLY use signInWithPassword. NEVER auto-create accounts!
        const { data, error } = await sbClient.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          setAuthError('No account found or invalid login credentials. Please check your email and password, or register first.');
          setLoading(false);
          return;
        }

        if (data && data.user) {
          // Fetch verified user profile role from Supabase PostgreSQL public.profiles table
          const { data: profile } = await sbClient
            .from('profiles')
            .select('*')
            .eq('email', data.user.email)
            .maybeSingle();

          const verifiedRole = profile?.role || 'student';
          const verifiedName = profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0];

          const userProfile = {
            id: data.user.id,
            email: data.user.email,
            full_name: verifiedName,
            role: verifiedRole,
            token: data.session?.access_token || ''
          };

          if (setCurrentUser) {
            setCurrentUser(userProfile);
          }

          setAuthSuccess(`Welcome back, ${verifiedName}! Redirecting...`);
          setTimeout(() => {
            navigate(verifiedRole === 'admin' ? '/admin' : '/chat');
          }, 800);
        }
      } else {
        // Public Registration: MUST ALWAYS assign role 'student'. Never allow Admin self-registration.
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        const { data, error } = await sbClient.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0],
              role: 'student'
            }
          }
        });

        if (error) {
          setAuthError(`Registration failed: ${error.message}`);
          setLoading(false);
          return;
        }

        if (data && data.user) {
          // Ensure profile is inserted into public.profiles table with default role 'student'
          try {
            await sbClient.from('profiles').upsert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: fullName.trim() || email.split('@')[0],
                role: 'student'
              }
            ]);
          } catch (pErr) {
            console.warn('Profile upsert warning:', pErr);
          }

          setAuthSuccess('Account created successfully with Student access! Please log in now.');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      setAuthError('An unexpected authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              {isLogin ? 'Sign in to access your knowledge dashboard' : 'Create your student knowledge account'}
            </div>
          </div>

          {/* Segmented Log In / Register Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #f1f5f9',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setAuthError(null); setAuthSuccess(null); }}
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
              onClick={() => { setIsLogin(false); setAuthError(null); setAuthSuccess(null); }}
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

          {/* Alert Messages */}
          {authError && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <div>{authError}</div>
            </div>
          )}

          {authSuccess && (
            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <div>{authSuccess}</div>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem', color: '#475569' }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#475569' }}>Email</label>
              <input
                type="email"
                required
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
                  required
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

            {/* Login / Register Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#0b3bbd',
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(11, 59, 189, 0.25)',
                cursor: loading ? 'wait' : 'pointer',
                marginTop: '12px'
              }}
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: '#64748b' }}>
            <span>{isLogin ? "Don't have an account? " : "Already registered? "}</span>
            <span
              onClick={() => { setIsLogin(!isLogin); setAuthError(null); setAuthSuccess(null); }}
              style={{ color: '#0b3bbd', fontWeight: 600, cursor: 'pointer' }}
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
