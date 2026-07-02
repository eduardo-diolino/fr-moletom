import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught in React boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-50 border-2 border-dashed border-red-200 text-red-800 text-xs font-bold font-mono tracking-wider rounded-none my-4 text-center">
          ⚠️ Ocorreu um erro ao renderizar este componente.
          {this.state.error && (
            <div className="mt-2 text-[10px] text-red-600 font-normal">
              Erro: {this.state.error.message}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
