import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ currentUser, setCurrentUser }) {
  const location = useLocation();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b3bbd', letterSpacing: '-0.02em' }}>
          EduQuery AI
        </span>
      </Link>

      {/* Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{
          color: '#0b3bbd',
          fontWeight: 700,
          fontSize: '0.95rem',
          textDecoration: 'none',
          borderBottom: '2px solid #0b3bbd',
          paddingBottom: '4px'
        }}>
          Platform
        </Link>
        <a href="#resources" style={{ color: '#475569', fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none' }}>
          Resources
        </a>
        <a href="#pricing" style={{ color: '#475569', fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none' }}>
          Pricing
        </a>
        <a href="#about" style={{ color: '#475569', fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none' }}>
          About
        </a>
      </nav>

      {/* Auth Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/auth" style={{ color: '#0b3bbd', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
          Log In
        </Link>
        <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
          Get Started
        </Link>
      </div>
    </header>
  );
}
