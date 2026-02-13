
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches unhandled React rendering errors and displays a friendly
 * recovery screen instead of a white screen crash.
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        console.error('🔴 ErrorBoundary caught an error:', error);
        console.error('🔴 Component stack:', errorInfo.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        } else {
            // Hard reload as last resort
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        fontFamily: "'Outfit', 'Public Sans', sans-serif",
                        textAlign: 'center',
                    }}
                >
                    {/* Error icon */}
                    <div
                        style={{
                            width: '96px',
                            height: '96px',
                            backgroundColor: '#0f172a',
                            borderRadius: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '32px',
                            border: '4px solid #0f172a',
                            boxShadow: '8px 8px 0px 0px rgba(15, 23, 42, 0.1)',
                            transform: 'rotate(-3deg)',
                        }}
                    >
                        <span style={{ fontSize: '48px' }}>⚠️</span>
                    </div>

                    <h1
                        style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: '#0f172a',
                            textTransform: 'uppercase',
                            fontStyle: 'italic',
                            letterSpacing: '-0.05em',
                            marginBottom: '8px',
                        }}
                    >
                        ¡Oops!
                    </h1>

                    <p
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            marginBottom: '32px',
                        }}
                    >
                        Algo salió mal
                    </p>

                    {/* Error details (collapsible in dev) */}
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                backgroundColor: '#fff',
                                border: '2px solid #e2e8f0',
                                borderRadius: '1rem',
                                padding: '16px',
                                marginBottom: '24px',
                                textAlign: 'left',
                                fontSize: '0.7rem',
                                color: '#64748b',
                                overflow: 'auto',
                                maxHeight: '150px',
                                fontFamily: 'monospace',
                            }}
                        >
                            <strong style={{ color: '#f43f5e' }}>{this.state.error.message}</strong>
                            {this.state.errorInfo && (
                                <pre style={{ marginTop: '8px', fontSize: '0.6rem', whiteSpace: 'pre-wrap' }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>
                    )}

                    <button
                        onClick={this.handleReset}
                        style={{
                            width: '100%',
                            maxWidth: '320px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            padding: '20px 32px',
                            borderRadius: '2.5rem',
                            border: '4px solid #0f172a',
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            fontStyle: 'italic',
                            letterSpacing: '-0.03em',
                            cursor: 'pointer',
                            boxShadow: '8px 8px 0px 0px rgba(15, 23, 42, 0.1)',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        Volver al menú
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
