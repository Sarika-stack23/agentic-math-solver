import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('custom_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('custom_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('custom_gemini_api_key');
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('custom_gemini_api_key');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '450px',
        padding: '2rem',
        position: 'relative',
        borderRadius: '16px'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>
        
        <h3 className="text-gradient" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
          ⚙️ Evaluator Settings
        </h3>
        
        <div style={{ background: 'hsla(var(--success), 0.1)', border: '1px solid hsla(var(--success), 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'hsl(var(--success))', boxShadow: '0 0 10px hsl(var(--success))' }} />
          <div>
            <h4 style={{ color: 'hsl(var(--success))', margin: 0, fontSize: '1rem' }}>System Active</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>App is fully plug-and-play using the backend API key. No configuration is required to use this application.</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
            Optional API Key Override
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter custom Gemini API Key..."
            className="input"
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            Only use this if the built-in system key has reached its rate limits during an intense evaluation session. This will override the default key in your local browser only.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={handleClear} disabled={!apiKey && !localStorage.getItem('custom_gemini_api_key')}>
            Clear Override
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: '100px', background: 'linear-gradient(135deg, hsl(var(--accent-primary)) 0%, #8b5cf6 100%)', border: 'none' }}>
            {isSaved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
