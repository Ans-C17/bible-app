import { useState } from "react";

type CreateDeckPopupProps = {
  onClose: () => void;
  onCreate: (name: string) => void;
};

export default function CreateDeckPopup({
  onClose,
  onCreate,
}: CreateDeckPopupProps) {
  const [name, setName] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-(--bible-gold) bg-(--bible-card-bg) p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-(--bible-card-text)">
              Create Deck
            </h2>
            <p className="mt-1 text-sm text-(--bible-card-text)/70">
              Give your deck a name
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-(--bible-card-text)/60 transition hover:bg-(--bible-gold)/10 hover:text-(--bible-card-text)"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <label
            htmlFor="deck-name"
            className="mb-2 block text-sm font-medium text-(--bible-card-text)"
          >
            Deck name
          </label>

          <input
            id="deck-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Romans"
            autoFocus
            className="w-full rounded-xl border border-(--bible-gold)/40 bg-black/5 px-4 py-3 text-(--bible-card-text) outline-none placeholder:text-(--bible-card-text)/40 focus:border-(--bible-gold) focus:ring-2 focus:ring-(--bible-gold)/20 dark:bg-white/5"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-(--bible-card-text)/70 transition hover:bg-(--bible-gold)/10 hover:text-(--bible-card-text)"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onCreate(name.trim())}
            disabled={!name.trim()}
            className="rounded-lg bg-(--bible-gold) px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
