import { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
    children: ReactNode;
}
interface State {
    hasError: boolean;
    error?: Error;
}
declare class ErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private handleReload;
    private handleReset;
    render(): any;
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map