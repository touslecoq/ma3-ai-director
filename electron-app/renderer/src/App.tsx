import { useState } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="app">
      <header className="app-header">
        <h1>GrandMA3 AI Director</h1>
        <nav className="main-nav">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={currentView === 'dashboard' ? 'active' : ''}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('songs')}
            className={currentView === 'songs' ? 'active' : ''}
          >
            Songs
          </button>
          <button 
            onClick={() => setCurrentView('tempo')}
            className={currentView === 'tempo' ? 'active' : ''}
          >
            Tempo
          </button>
          <button 
            onClick={() => setCurrentView('ai')}
            className={currentView === 'ai' ? 'active' : ''}
          >
            AI Agent
          </button>
          <button 
            onClick={() => setCurrentView('video')}
            className={currentView === 'video' ? 'active' : ''}
          >
            Video Analysis
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={currentView === 'settings' ? 'active' : ''}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'dashboard' && (
          <div className="view">
            <h2>Dashboard</h2>
            <div className="status-grid">
              <div className="status-card">
                <h3>GrandMA3 Connection</h3>
                <p className="status-offline">Disconnected</p>
              </div>
              <div className="status-card">
                <h3>Python Backend</h3>
                <p className="status-offline">Not Running</p>
              </div>
              <div className="status-card">
                <h3>Audio Input</h3>
                <p className="status-offline">No Signal</p>
              </div>
              <div className="status-card">
                <h3>Current Song</h3>
                <p className="status-info">No song loaded</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'songs' && (
          <div className="view">
            <h2>Song & Setlist Manager</h2>
            <p>Manage your songs, setlists, and automated cue generation</p>
          </div>
        )}

        {currentView === 'tempo' && (
          <div className="view">
            <h2>Real-Time Tempo Tracking</h2>
            <div className="tempo-display">
              <div className="tempo-value">-- BPM</div>
              <p>No audio input detected</p>
            </div>
          </div>
        )}

        {currentView === 'ai' && (
          <div className="view">
            <h2>AI Lighting Assistant</h2>
            <div className="chat-interface">
              <div className="chat-messages">
                <p className="placeholder">Ask me to create lighting looks...</p>
              </div>
              <input 
                type="text" 
                placeholder="Describe the lighting you want..."
                className="chat-input"
              />
            </div>
          </div>
        )}

        {currentView === 'video' && (
          <div className="view">
            <h2>Video Look Extraction</h2>
            <div className="upload-zone">
              <p>Drop video files here to analyze lighting</p>
              <button className="upload-button">Browse Files</button>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="view">
            <h2>Settings</h2>
            <div className="settings-section">
              <h3>GrandMA3 Connection</h3>
              <label>
                Host:
                <input type="text" defaultValue="192.168.1.50" />
              </label>
              <label>
                Port:
                <input type="number" defaultValue="30000" />
              </label>
            </div>
            <div className="settings-section">
              <h3>AI Configuration</h3>
              <label>
                OpenAI API Key:
                <input type="password" placeholder="sk-..." />
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
