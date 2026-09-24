import { BookOpen } from "lucide-react";

export default function LoadingScreen() {
  return (
    <main className="loading-screen">
      <div className="loading-content" role="status" aria-live="polite">
        <div className="loading-icon">
          <BookOpen className="h-7 w-7" strokeWidth={1.8} />
        </div>

        <p className="loading-title">Memory Bible</p>

        <p className="loading-label">
          Loading
          <span className="loading-dots" aria-hidden="true">
            ...
          </span>
        </p>

        <div className="loading-track" aria-hidden="true">
          <div className="loading-progress" />
        </div>
      </div>
    </main>
  );
}
