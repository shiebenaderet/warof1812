import React from 'react';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * Features:
 * - Catches render errors, lifecycle errors, and constructor errors
 * - Provides user-friendly error messages
 * - Offers recovery options: restore last save or start new game
 * - Allows exporting save file as backup
 */
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
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error details in state
    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    // Log to localStorage for teacher dashboard analysis
    try {
      const errorLog = JSON.parse(localStorage.getItem('war1812_error_log') || '[]');
      errorLog.push({
        timestamp: Date.now(),
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        section: this.props.section || 'unknown',
      });
      // Keep only last 10 errors to prevent localStorage bloat
      if (errorLog.length > 10) errorLog.shift();
      localStorage.setItem('war1812_error_log', JSON.stringify(errorLog));
    } catch (e) {
      console.error('Failed to log error to localStorage:', e);
    }
  }

  handleRestoreLastSave = () => {
    const { onRestoreSave } = this.props;
    if (onRestoreSave) {
      // Reset error boundary state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
      // Call parent's restore function
      onRestoreSave();
    } else {
      // Fallback: try to reload from localStorage directly
      window.location.reload();
    }
  };

  handleStartNewGame = () => {
    const { onStartNewGame } = this.props;

    // Clear error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (onStartNewGame) {
      onStartNewGame();
    } else {
      // Fallback: clear localStorage and reload
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

      // Create a blob and download link
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
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-war-navy via-black to-war-navy p-4">
          <div className="w-full max-w-2xl bg-war-navy border-4 border-war-red shadow-2xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-war-red to-war-navy px-6 py-4 border-b border-war-gold border-opacity-30">
              <h2 className="text-2xl font-serif text-parchment flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                Oops! Something Went Wrong
              </h2>
              <p className="text-parchment-dark text-sm mt-1">
                The {section} encountered an unexpected error
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">
              <p className="text-parchment text-base leading-relaxed">
                Don't worry! Your progress may have been auto-saved. You can try to restore your last save or start a fresh game.
              </p>

              {/* Error count warning */}
              {this.state.errorCount > 1 && (
                <div className="bg-war-red bg-opacity-20 border-l-4 border-war-red px-4 py-3 rounded">
                  <p className="text-parchment text-sm">
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
                    className="w-full px-6 py-3 bg-gradient-to-r from-war-blue to-war-navy text-parchment font-bold text-lg
                              border-2 border-war-gold rounded-lg shadow-md
                              hover:from-war-navy hover:to-war-blue hover:shadow-xl
                              transition-all duration-200 transform hover:scale-105"
                  >
                    Restore Last Save
                  </button>
                )}

                <button
                  onClick={this.handleStartNewGame}
                  className="w-full px-6 py-3 bg-gradient-to-r from-war-red to-war-navy text-parchment font-bold text-lg
                            border-2 border-war-gold rounded-lg shadow-md
                            hover:from-war-navy hover:to-war-red hover:shadow-xl
                            transition-all duration-200 transform hover:scale-105"
                >
                  Start New Game
                </button>

                {showExportButton && hasSavedGame && (
                  <button
                    onClick={this.handleExportSave}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-parchment font-semibold
                              border-2 border-gray-500 rounded-lg shadow-md
                              hover:from-gray-600 hover:to-gray-800 hover:shadow-xl
                              transition-all duration-200"
                  >
                    Export Save File (Backup)
                  </button>
                )}
              </div>

              {/* Technical details (collapsible) */}
              <div className="mt-6 pt-4 border-t border-gray-600">
                <button
                  onClick={this.handleToggleDetails}
                  className="text-parchment-dark text-sm underline hover:text-parchment"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
                </button>

                {this.state.showDetails && this.state.error && (
                  <div className="mt-3 bg-black bg-opacity-40 rounded p-4 overflow-auto max-h-64">
                    <p className="text-war-red font-mono text-xs mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Help text */}
              <div className="mt-4 bg-war-navy bg-opacity-50 rounded-lg px-4 py-3 border-l-4 border-war-gold">
                <p className="text-parchment-dark text-sm">
                  <strong>For Teachers:</strong> Error logs are saved locally and can be reviewed in the browser console.
                  Students should report persistent errors with the date/time they occurred.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}
