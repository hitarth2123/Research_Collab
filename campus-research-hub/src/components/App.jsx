import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          �� Campus Research Hub is Working!
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          If you see this message, React is loading correctly.
        </p>
      </div>
    </div>
  );
}

export default App;
