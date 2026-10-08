import { BookOpen } from "lucide-react";

type LoadingStateProps = {
  message: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="loading-icon h-12 w-12 rounded-2xl">
        <BookOpen className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <p className="text-sm font-medium text-(--bible-page-text)/70">
        {message}
        <span className="loading-dots" aria-hidden="true">
          ...
        </span>
      </p>
    </div>
  );
}
