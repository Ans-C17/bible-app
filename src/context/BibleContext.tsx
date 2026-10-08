import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import LoadingScreen from "../components/LoadingScreen";
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
    return <LoadingScreen message="Loading the Bible" />;
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
