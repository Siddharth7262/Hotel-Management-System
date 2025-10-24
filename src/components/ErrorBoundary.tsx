import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In an enterprise app, forward to an observability pipeline here.
    // For now we keep it simple and visible in console.
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <Card className="max-w-xl w-full p-8 space-y-6 text-center card-modern gradient-border">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 text-destructive grid place-items-center animate-bounce-subtle">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 9v4m0 4h.01" />
                <path d="M10 2h4l7 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent animate-gradient" style={{ backgroundImage: "var(--gradient-primary)" }}>
                Something went wrong
              </h1>
              <p className="text-muted-foreground mt-2">
                An unexpected error occurred. You can try reloading the page. If the problem
                persists, please contact support.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={this.handleReload}>
                Reload
              </Button>
              <Button onClick={() => (this.setState({ hasError: false, error: undefined }))}>
                Dismiss
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error ? (
              <pre className="mt-4 rounded-xl bg-muted p-4 text-left text-xs overflow-auto max-h-48">
                {this.state.error?.message}
              </pre>
            ) : null}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}