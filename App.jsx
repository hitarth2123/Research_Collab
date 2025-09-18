import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{ 
        textAlign: 'center',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem',
          fontWeight: '800',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          marginBottom: '0.5rem'
        }}>
          🔬 Campus Research Hub - UPDATED!
        </h1>
        <p style={{ 
          fontSize: '1.3rem',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          This is the UPDATED version - if you see this, hot reload is working!
        </p>
      </header>

      {/* Survey Form Section */}
      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: '#2c3e50', 
            marginBottom: '1rem',
            fontSize: '2rem'
          }}>
            Campus Research Collaboration Survey
          </h2>
          
          <p style={{ 
            color: '#7f8c8d', 
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}>
            Help us understand your research needs and connect with potential collaborators
          </p>

          {/* Simple Survey Form */}
          <form style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="your.email@university.edu"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Research Area/Field *
              </label>
              <input
                type="text"
                placeholder="e.g., Computer Science, Biology, Psychology"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Academic Level *
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select your academic level</option>
                <option value="undergraduate">Undergraduate Student</option>
                <option value="graduate">Graduate Student</option>
                <option value="phd">PhD Student</option>
                <option value="postdoc">Post-doctoral Researcher</option>
                <option value="faculty">Faculty Member</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Collaboration Needs *
              </label>
              <textarea
                placeholder="What type of collaboration are you looking for?"
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Submit Survey (Test Version)
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
