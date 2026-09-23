import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BookOpen } from "lucide-react";

import { loadBible, type BibleVerse } from "../data/bible";

type BibleData = {
  englishVerses: BibleVerse[];
  malayalamVerses: BibleVerse[];
  englishMap: Map<string, BibleVerse>;
  malayalamMap: Map<string, BibleVerse>;
};

const BibleContext = createContext<BibleData | null>(null);

type BibleProviderProps = {
  children: ReactNode;
};

export function BibleProvider({ children }: BibleProviderProps) {
  const [bible, setBible] = useState<BibleData | null>(null);

  useEffect(() => {
    const initializeBible = async () => {
      const data = await loadBible();
      setBible(data);
    };

    initializeBible();
  }, []);

  if (!bible) {
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

  return (
    <BibleContext.Provider value={bible}>{children}</BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);

  if (!context) {
    throw new Error("useBible must be used inside BibleProvider");
  }

  return context;
}
