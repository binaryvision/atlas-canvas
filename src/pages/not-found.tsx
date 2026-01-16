import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-4 p-8 rounded-lg bg-card border border-white/5">
        <div className="flex mb-4 gap-3 items-center">
          <AlertCircle className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">404</h1>
        </div>
        <p className="text-muted-foreground">
          Page not found.
        </p>
      </div>
    </div>
  );
}
