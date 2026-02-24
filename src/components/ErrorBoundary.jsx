import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    try {
      const errorLog = JSON.parse(localStorage.getItem('war1812_error_log') || '[]');
      errorLog.push({
        timestamp: Date.now(),
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        section: this.props.section || 'unknown',
      });
      if (errorLog.length > 10) errorLog.shift();
      localStorage.setItem('war1812_error_log', JSON.stringify(errorLog));
    } catch (e) {
      console.error('Failed to log error to localStorage:', e);
    }
  }

  handleRestoreLastSave = () => {
    const { onRestoreSave } = this.props;
    if (onRestoreSave) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
      onRestoreSave();
    } else {
      window.location.reload();
    }
  };

  handleStartNewGame = () => {
    const { onStartNewGame } = this.props;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (onStartNewGame) {
      onStartNewGame();
    } else {
      localStorage.removeItem('war1812_save');
      window.location.reload();
    }
  };

  handleExportSave = () => {
    try {
      const saveData = localStorage.getItem('war1812_save');
      if (!saveData) {
        alert('No save file found to export.');
        return;
      }

      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `war1812_save_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Save file downloaded successfully!');
    } catch (error) {
      console.error('Failed to export save:', error);
      alert('Failed to export save file. Check console for details.');
    }
  };

  handleToggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { section = 'game', showExportButton = true } = this.props;
      const hasSavedGame = !!localStorage.getItem('war1812_save');

      return (
        <div className="w-full h-full flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(20,30,48,1) 0%, rgba(10,10,8,1) 100%)' }}>
          <div className="w-full max-w-2xl bg-war-navy border border-war-red/30 shadow-modal rounded-lg overflow-hidden animate-fadein">
            {/* Header */}
            <div className="px-6 py-4 border-b border-war-red/20" style={{
              background: 'linear-gradient(135deg, rgba(139,26,26,0.4) 0%, rgba(20,30,48,0.95) 100%)',
            }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                <p className="text-red-400/80 text-xs tracking-[0.2em] uppercase font-body font-bold">Error</p>
              </div>
              <h2 className="text-parchment font-display text-xl tracking-wide">
                Something Went Wrong
              </h2>
              <p className="text-parchment-dark/50 text-xs mt-1 font-body">
                The {section} encountered an unexpected error
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">
              <p className="text-parchment/70 text-sm leading-relaxed font-body">
                Don't worry! Your progress may have been auto-saved. You can try to restore your last save or start a fresh game.
              </p>

              {/* Error count warning */}
              {this.state.errorCount > 1 && (
                <div className="bg-war-red/10 border-l-2 border-war-red/40 px-4 py-3 rounded-r">
                  <p className="text-parchment/70 text-sm font-body">
                    <strong>Warning:</strong> This error has occurred {this.state.errorCount} times.
                    If it persists, try starting a new game or refreshing your browser.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3 mt-6">
                {hasSavedGame && (
                  <button
                    onClick={this.handleRestoreLastSave}
                    className="w-full px-6 py-3 bg-war-navy border border-war-gold/30 text-parchment/80 font-display text-sm
                              rounded tracking-wide hover:border-war-gold/50 hover:text-parchment
                              transition-all cursor-pointer"
                  >
                    Restore Last Save
                  </button>
                )}

                <button
                  onClick={this.handleStartNewGame}
                  className="w-full px-6 py-3 bg-war-gold text-war-ink font-display text-sm
                            rounded font-bold tracking-wide hover:bg-war-brass
                            transition-colors cursor-pointer shadow-copper"
                >
                  Start New Game
                </button>

                {showExportButton && hasSavedGame && (
                  <button
                    onClick={this.handleExportSave}
                    className="w-full px-6 py-3 border border-parchment-dark/15 text-parchment-dark/50 font-body text-sm
                              rounded hover:border-parchment-dark/30 hover:text-parchment-dark/70
                              transition-all cursor-pointer"
                  >
                    Export Save File (Backup)
                  </button>
                )}
              </div>

              {/* Technical details (collapsible) */}
              <div className="mt-6 pt-4 border-t border-parchment-dark/10">
                <button
                  onClick={this.handleToggleDetails}
                  className="text-parchment-dark/40 text-xs underline hover:text-parchment-dark/60 cursor-pointer font-body"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
                </button>

                {this.state.showDetails && this.state.error && (
                  <div className="mt-3 bg-war-ink/50 rounded p-4 overflow-auto max-h-64 border border-parchment-dark/8">
                    <p className="text-red-400/80 font-mono text-xs mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-parchment-dark/40 font-mono text-xs whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Help text */}
              <div className="mt-4 bg-black/15 rounded px-4 py-3 border-l-2 border-war-gold/20">
                <p className="text-parchment-dark/40 text-xs font-body">
                  <strong className="text-parchment-dark/60">For Teachers:</strong> Error logs are saved locally and can be reviewed in the browser console.
                  Students should report persistent errors with the date/time they occurred.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
