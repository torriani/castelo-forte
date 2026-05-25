import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">&#9888;</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Algo deu errado
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              {this.state.error?.message || 'Erro inesperado na aplicacao.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
              >
                Recarregar pagina
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
