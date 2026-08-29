import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Cpu, Database, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 72px)', padding: '60px 40px 100px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        
        {/* Left Column: Hero Content */}
        <div>
          <h1 style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: 1.15, color: '#0f172a', marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Ask Your College. <br />
            <span style={{ color: '#1d4ed8' }}>Get Verified Answers.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '36px', maxWidth: '540px' }}>
            Elevate academic research with high-fidelity information retrieval. Access deeply grounded answers sourced directly from verified institutional documents and peer-reviewed knowledge bases.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
            <Link 
              to="/chat" 
              className="btn btn-primary" 
              style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '8px', background: '#0b3bbd', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Start Researching <ArrowRight size={18} />
            </Link>

            <Link 
              to="/auth" 
              className="btn btn-secondary" 
              style={{ padding: '14px 24px', fontSize: '1rem', borderRadius: '8px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155' }}
            >
              Request Demo
            </Link>
          </div>

          {/* Key Statistics */}
          <div style={{ display: 'flex', gap: '48px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>10,000+</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>Grounded AI Answers</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>500+</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>Verified Document Sources</div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Diagram Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          padding: '50px 40px',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            
            {/* Dashed connector line background */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <path d="M 110 130 C 170 130, 170 130, 210 130" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="2" fill="none" />
              <path d="M 330 130 C 370 70, 370 70, 410 70" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="2" fill="none" />
              <path d="M 330 130 C 370 190, 370 190, 410 190" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="2" fill="none" />
            </svg>

            {/* Node 1: Student Query */}
            <div style={{
              zIndex: 2,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px 20px',
              width: '130px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ width: '40px', height: '40px', background: '#2563eb', borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <User size={20} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Student Query</div>
            </div>

            {/* Node 2: AI Retrieval Engine (Center) */}
            <div style={{
              zIndex: 2,
              background: '#ffffff',
              border: '2px solid #2563eb',
              borderRadius: '12px',
              padding: '24px 16px',
              width: '160px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
            }}>
              <div style={{ width: '48px', height: '48px', background: '#0b3bbd', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Cpu size={24} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d4ed8' }}>AI Retrieval Engine</div>
            </div>

            {/* Right Side Stack: Knowledge Base & Verified Answer */}
            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Knowledge Base */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                width: '150px',
                textAlign: 'center'
              }}>
                <div style={{ width: '36px', height: '36px', background: '#7e22ce', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <Database size={18} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Knowledge Base</div>
              </div>

              {/* Verified Answer */}
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '16px 20px',
                width: '150px',
                textAlign: 'center'
              }}>
                <div style={{ width: '36px', height: '36px', background: '#2563eb', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8' }}>Verified Answer</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
