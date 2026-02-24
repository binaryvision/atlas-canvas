import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "prototype-banner-dismissed";

export function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(wasDismissed);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <>
      <div
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-4",
          "bg-accent text-accent-foreground px-4 py-2.5 shadow-md",
          "border-b border-accent/80"
        )}
      >
        <p className="text-sm font-medium text-center flex-1 min-w-0">
          This is a working prototype for trying out and reviewing functionality.
          All design and content are placeholders and will be reviewed later.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="shrink-0 text-accent-foreground hover:bg-accent-foreground/20 h-8 px-3"
          aria-label="Dismiss banner"
        >
          Dismiss
        </Button>
      </div>
      {/* Spacer so main content is not hidden under the fixed banner */}
      <div className="h-12 flex-shrink-0" aria-hidden />
    </>
  );
}
