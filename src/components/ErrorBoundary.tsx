import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('vrai_church_uploaded_photos');
      localStorage.removeItem('vrai_church_gallery_photos');
    } catch {}
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg w-full bg-stone-800 border border-stone-700 rounded-2xl p-8 shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white font-heading">
                Victorious Royal Assembly Portal
              </h2>
              <p className="text-xs text-stone-300">
                A rendering issue was caught. You can refresh the view or reset local cache safely.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-stone-950 p-3 rounded-lg text-left text-[11px] text-rose-300 font-mono overflow-auto max-h-32 border border-stone-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Reload Preview
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Reset Stored Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
