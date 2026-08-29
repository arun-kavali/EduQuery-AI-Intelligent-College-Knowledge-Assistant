import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function Navbar({ currentUser, setCurrentUser }) {
  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px',
          height: '34px',
          background: '#0b3bbd',
          color: '#ffffff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.9rem'
        }}>
          EQ
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          EduQuery AI
        </span>
      </Link>

      {/* Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{
          color: '#0f172a',
          fontWeight: 600,
          fontSize: '0.9rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Platform <ChevronDown size={14} color="#64748b" />
        </Link>
        <a href="#resources" style={{
          color: '#475569',
          fontWeight: 500,
          fontSize: '0.9rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          Resources <ChevronDown size={14} color="#64748b" />
        </a>
        <a href="#pricing" style={{ color: '#475569', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}>
          Pricing
        </a>
        <a href="#about" style={{ color: '#475569', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}>
          About
        </a>
      </nav>

      {/* Auth Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link 
          to="/auth" 
          style={{
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}
        >
          Sign in
        </Link>

        <Link 
          to="/auth" 
          className="btn btn-primary" 
          style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, background: '#0b3bbd' }}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

