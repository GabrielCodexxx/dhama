import React from 'react';

interface ModeSelectorProps {
  mode: 'solo' | '2p' | 'extreme';
  setMode: (mode: 'solo' | '2p' | 'extreme') => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => (
  <div style={{ marginBottom: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
    <button
      onClick={() => setMode('solo')}
      style={{
        padding: '8px 24px',
        background: mode === 'solo' ? '#2196f3' : '#eee',
        color: mode === 'solo' ? '#fff' : '#333',
        border: 'none',
        borderRadius: 8,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: 18,
      }}
    >
      Solo (vs AI)
    </button>
    <button
      onClick={() => setMode('2p')}
      style={{
        padding: '8px 24px',
        background: mode === '2p' ? '#2196f3' : '#eee',
        color: mode === '2p' ? '#fff' : '#333',
        border: 'none',
        borderRadius: 8,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: 18,
      }}
    >
      2 Player
    </button>
    <button
      onClick={() => setMode('extreme')}
      style={{
        padding: '8px 24px',
        background: mode === 'extreme' ? '#d32f2f' : '#eee',
        color: mode === 'extreme' ? '#fff' : '#333',
        border: 'none',
        borderRadius: 8,
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: 18,
      }}
    >
      Extreme Mode
    </button>
  </div>
);

export default ModeSelector; 