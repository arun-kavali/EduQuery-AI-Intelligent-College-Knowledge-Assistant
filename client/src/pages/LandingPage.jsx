import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Cpu, Database, MessageSquare, ShieldCheck, Sparkles, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 72px)', padding: '60px 48px 100px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Main Hero Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
          
          {/* Left Column: Headline & Action Buttons */}
          <div>
            <h1 style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: 1.15, color: '#0f172a', marginBottom: '20px', letterSpacing: '-0.03em' }}>
              Ask Your College. <br />
              <span>Get Verified Answers.</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '36px', maxWidth: '520px' }}>
              EduQuery AI — Intelligent College Knowledge Assistant for fast and safe application.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link 
                to="/chat" 
                className="btn btn-primary" 
                style={{ padding: '14px 28px', fontSize: '0.95rem', borderRadius: '8px', background: '#0b3bbd', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(11, 59, 189, 0.25)' }}
              >
                Start Researching <ArrowRight size={18} />
              </Link>

              <Link 
                to="/documents" 
                className="btn btn-secondary" 
                style={{ padding: '14px 24px', fontSize: '0.95rem', borderRadius: '8px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}
              >
                Explore Platform
              </Link>
            </div>
          </div>

          {/* Right Column: Visual RAG Architecture Card Container */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
            padding: '36px 32px',
            position: 'relative'
          }}>
            {/* Header Badge */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <span style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#64748b'
              }}>
                RAG architecture
              </span>
            </div>

            {/* Diagram Flow Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
              
              {/* Horizontal Process Nodes */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
                
                {/* Node 1: Extract */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 14px',
                  textAlign: 'center',
                  flex: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ width: '36px', height: '36px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <FileText size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Extract</div>
                </div>

                <div style={{ color: '#cbd5e1', fontWeight: 800 }}>→</div>

                {/* Node 2: Center RAG Box */}
                <div style={{
                  background: '#f3e8ff',
                  border: '2px solid #a855f7',
                  borderRadius: '14px',
                  padding: '18px 16px',
                  textAlign: 'center',
                  flex: 1.2,
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.15)'
                }}>
                  <div style={{ width: '40px', height: '40px', background: '#7e22ce', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Cpu size={20} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7e22ce' }}>RAG</div>
                </div>

                <div style={{ color: '#cbd5e1', fontWeight: 800 }}>→</div>

                {/* Node 3: Embed */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 14px',
                  textAlign: 'center',
                  flex: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ width: '36px', height: '36px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Database size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Embed</div>
                </div>

              </div>

              {/* Bottom Output Connector */}
              <div style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '24px',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.825rem',
                color: '#475569',
                fontWeight: 600
              }}>
                <MessageSquare size={16} color="#7e22ce" />
                <span>AI conversation</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Feature Cards Row (3 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          
          {/* Card 1 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '28px 24px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            transition: 'transform 0.15s ease'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Ask Verified College
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
              Ask more about admin regulations and get verified grounded answers.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '28px 24px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            transition: 'transform 0.15s ease'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Features Platform
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
              Complete your web service research releasing live features.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '28px 24px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            transition: 'transform 0.15s ease'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Star size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Average Feedback
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
              High overall answer accuracy supported by citations.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}


