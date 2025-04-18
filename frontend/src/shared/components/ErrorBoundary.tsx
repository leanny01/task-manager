import React from 'react';
import styled from 'styled-components';
import { ErrorIcon } from './Icons';

const ErrorContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.colors.background.light};
  border-radius: 0.375rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const ErrorIconWrapper = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log the error to an error reporting service here
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorContainer>
                    <ErrorIconWrapper>
                        <ErrorIcon size={16} />
                    </ErrorIconWrapper>
                    <span>Something went wrong</span>
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
} 