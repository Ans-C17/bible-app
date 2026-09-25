import { useEffect, useState } from "react";
import { createDeck, getMyDecks } from "@/services/decks";

export default function Decks() {
  const [decks, setDecks] = useState<any[]>([]);

  useEffect(() => {
    getMyDecks().then(setDecks);
  }, []);

  return (
    <div>
      <button
        onClick={async () => {
          const deck = await createDeck("Deckesh kumar");
          setDecks((current) => [...current, deck]);
        }}
      >
        Create Deck
      </button>

      {decks.map((deck) => (
        <div key={deck.id}>{deck.name}</div>
      ))}
    </div>
  );
}
