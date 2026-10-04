import { Trash2 } from "lucide-react";

type ConfirmPopupProps = {
  title: string;
  message: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmPopup({
  title,
  message,
  confirmText,
  onClose,
  onConfirm,
}: ConfirmPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-(--bible-gold)/30 bg-(--bible-card-bg) p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <Trash2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-(--bible-card-text)">
              {title}
            </h2>

            <p className="mt-1.5 text-sm leading-relaxed text-(--bible-card-text)/60">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-(--bible-gold)/30 px-4 py-2.5 text-sm font-semibold text-(--bible-card-text) transition hover:bg-(--bible-gold)/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
