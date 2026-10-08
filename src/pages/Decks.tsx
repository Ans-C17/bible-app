import { useState } from "react";
import CreateDeckPopup from "@/components/CreateDeckPopup";
import ConfirmPopup from "@/components/ConfirmPopup";
import LoadingState from "@/components/LoadingState";

import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Pencil,
  PlayingCardsFan,
  Plus,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import {
  createDeck,
  deleteDeck,
  getMyDecks,
  renameDeck,
} from "@/services/decks";

type Deck = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

export default function Decks() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);
  const [deckToRename, setDeckToRename] = useState<Deck | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [actionError, setActionError] = useState("");

  const decksQueryKey = ["decks", user?.id] as const;
  const decksQuery = useQuery({
    queryKey: decksQueryKey,
    queryFn: async () => (await getMyDecks()) as Deck[],
    enabled: Boolean(user),
  });

  const refreshDecks = () =>
    queryClient.invalidateQueries({ queryKey: decksQueryKey });

  const createDeckMutation = useMutation({
    mutationFn: createDeck,
    onSuccess: () => {
      setShowCreateDeck(false);
      refreshDecks();
    },
    onError: (error) => {
      console.error("Failed to create deck:", error);
      setActionError("Failed to create deck. Please try again.");
    },
  });

  const renameDeckMutation = useMutation({
    mutationFn: ({ deckId, name }: { deckId: string; name: string }) =>
      renameDeck(deckId, name),
    onSuccess: () => {
      setDeckToRename(null);
      setRenameValue("");
      refreshDecks();
    },
    onError: (error) => {
      console.error("Failed to rename deck:", error);
      setActionError("Failed to rename deck. Please try again.");
    },
  });

  const deleteDeckMutation = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      setDeckToDelete(null);
      refreshDecks();
    },
    onError: (error) => {
      console.error("Failed to delete deck:", error);
      setActionError("Failed to delete deck. Please try again.");
    },
  });

  const decks = decksQuery.data ?? [];
  const mainDeck = decks.find((deck) => deck.is_default);
  const otherDecks = decks.filter((deck) => !deck.is_default);

  const handleCreateDeck = (name: string) => {
    setActionError("");
    createDeckMutation.mutate(name);
  };

  const handleRenameDeck = () => {
    if (!deckToRename) return;

    const trimmedName = renameValue.trim();

    if (!trimmedName) return;

    setActionError("");
    renameDeckMutation.mutate({
      deckId: deckToRename.id,
      name: trimmedName,
    });
  };

  const handleDeleteDeck = () => {
    if (!deckToDelete) return;

    setActionError("");
    deleteDeckMutation.mutate(deckToDelete.id);
  };

  return (
    <main className="bible-page min-h-dvh">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="bible-header">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-(--bible-gold)/40 bg-white/5 px-3 py-2 text-sm font-medium text-(--bible-header-text) shadow-sm transition hover:bg-(--bible-header-control-hover)"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </button>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                My Decks
              </h1>

              <p className="mt-2 text-base text-(--bible-page-text)">
                Organize your verses
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateDeck(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--bible-gold) px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create Deck
            </button>
          </div>
        </div>

        {decksQuery.isPending && <LoadingState message="Loading your decks" />}

        {(decksQuery.isError || actionError) && (
          <p className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {actionError || "We could not load your decks right now."}
          </p>
        )}

        {!decksQuery.isPending && !decksQuery.isError && (
          <>
            {/* Main Deck */}
            {mainDeck && (
              <section className="mt-10">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-(--bible-page-text)/45">
                  Main Deck
                </h2>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    navigate(`/decks/${mainDeck.id}`);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/decks/${mainDeck.id}`);
                    }
                  }}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-(--bible-gold)/45 bg-(--bible-card-bg) transition hover:border-(--bible-gold)/70 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-(--bible-gold)/40 bg-(--bible-gold)/10 text-(--bible-card-meta)">
                        <PlayingCardsFan className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-(--bible-card-text)">
                          {mainDeck.name}
                        </h3>

                        <p className="mt-0.5 text-sm text-(--bible-card-text)/55">
                          Add verses here for spaced repetition
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/decks/${mainDeck.id}`);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--bible-gold)/60 bg-(--bible-gold)/10 px-4 py-2.5 text-sm font-semibold text-(--bible-card-text) shadow-sm transition hover:bg-(--bible-gold)/20 sm:w-auto"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Other Decks */}
            <section className="mt-10">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-(--bible-page-text)/45">
                    Other Decks
                  </h2>
                </div>

                {otherDecks.length > 0 && (
                  <span className="text-sm text-(--bible-page-text)/40">
                    {otherDecks.length}
                  </span>
                )}
              </div>

              {otherDecks.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-(--bible-gold)/25 bg-white/5">
                  {otherDecks.map((deck, index) => (
                    <div
                      key={deck.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        navigate(`/decks/${deck.id}`);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigate(`/decks/${deck.id}`);
                        }
                      }}
                      className={`cursor-pointer flex items-center gap-4 px-4 py-4 transition hover:bg-(--bible-gold)/5 sm:px-5 ${
                        index !== otherDecks.length - 1
                          ? "border-b border-(--bible-gold)/15"
                          : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-(--bible-gold)/25 text-(--bible-gold)">
                        <Layers className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-(--bible-page-text)">
                          {deck.name}
                        </h3>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeckToRename(deck);
                            setRenameValue(deck.name);
                          }}
                          aria-label={`Rename ${deck.name}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--bible-gold)/40 bg-(--bible-gold)/10 text-(--bible-page-text) transition hover:bg-(--bible-gold)/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeckToDelete(deck);
                          }}
                          aria-label={`Delete ${deck.name}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/decks/${deck.id}`);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-(--bible-gold)/50 bg-(--bible-gold)/10 px-3.5 py-2 text-sm font-semibold text-(--bible-page-text) shadow-sm transition hover:bg-(--bible-gold)/20"
                        >
                          Open
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-(--bible-gold)/25 bg-white/5 px-6 py-10 text-center">
                  <Layers className="mx-auto h-6 w-6 text-(--bible-gold)/60" />

                  <p className="mt-4 text-sm text-(--bible-page-text)/55">
                    No other decks yet.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        <p
          className="mt-10 text-center text-xs"
          style={{
            color: "var(--bible-page-text)",
            opacity: 0.5,
          }}
        >
          Your word is a lamp to my feet and a light to my path.
        </p>
      </div>

      {deckToRename && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]"
          onClick={() => {
            setDeckToRename(null);
            setRenameValue("");
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-(--bible-gold)/30 bg-(--bible-card-bg) p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-(--bible-card-text)">
              Rename deck
            </h2>

            <p className="mt-1.5 text-sm text-(--bible-card-text)/60">
              Choose a new name for this deck.
            </p>

            <input
              type="text"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setDeckToRename(null);
                  setRenameValue("");
                }

                if (event.key === "Enter") {
                  handleRenameDeck();
                }
              }}
              className="mt-5 w-full rounded-xl border border-(--bible-gold)/30 bg-transparent px-4 py-3 text-sm text-(--bible-card-text) outline-none transition focus:border-(--bible-gold)"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeckToRename(null);
                  setRenameValue("");
                }}
                className="rounded-xl border border-(--bible-gold)/30 px-4 py-2.5 text-sm font-semibold text-(--bible-card-text) transition hover:bg-(--bible-gold)/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRenameDeck}
                disabled={!renameValue.trim()}
                className="rounded-xl bg-(--bible-gold) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateDeck && (
        <CreateDeckPopup
          onClose={() => setShowCreateDeck(false)}
          onCreate={handleCreateDeck}
        />
      )}

      {deckToDelete && (
        <ConfirmPopup
          title="Delete this deck?"
          message={`"${deckToDelete.name}" and all verses inside it will be deleted.`}
          confirmText="Delete"
          onClose={() => setDeckToDelete(null)}
          onConfirm={handleDeleteDeck}
        />
      )}
    </main>
  );
}
