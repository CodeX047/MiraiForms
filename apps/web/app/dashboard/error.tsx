"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Dashboard Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground max-w-md">
        We encountered an unexpected error while loading this dashboard view.
        Our team has been notified.
      </p>
      <div className="mt-4 flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload page
        </Button>
      </div>
    </div>
  );
}
