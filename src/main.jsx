import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Orbit Br ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-[#1E1F22] text-[#F2F3F5] flex flex-col items-center justify-center p-6 text-center font-sans select-none overflow-y-auto">
          <img src="/logo.png" alt="Orbit Br" className="w-24 h-24 object-contain mb-4 drop-shadow-2xl" />
          <h1 className="text-2xl font-bold mb-2">Orbit Br encountered a hiccup</h1>
          <p className="text-sm text-[#949BA4] max-w-md mb-4">
            Something went wrong while rendering. Don't worry, your data is safe on MariaDB.
          </p>

          {this.state.error && (
            <div className="p-3.5 bg-black/60 rounded-lg text-[#F23F43] font-mono text-xs max-w-2xl text-left overflow-x-auto mb-5 border border-[#F23F43]/30 shadow-inner">
              <div className="font-bold mb-1">{this.state.error.name}: {this.state.error.message}</div>
              <pre className="text-[10px] text-[#949BA4] whitespace-pre-wrap leading-tight font-mono">{this.state.error.stack}</pre>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('discord_user');
                window.location.reload();
              }}
              className="px-4 py-2 rounded bg-[#4E5058] hover:bg-[#6D6F78] text-white text-xs font-semibold"
            >
              Reset Session
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-lg"
            >
              Reload Orbit Br
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

