import { useEffect } from "react";
import { loadBible } from "./data/bible";
import {
  createEnglishHaystack,
  createMalayalamHaystack,
  searchEnglish,
  searchMalayalam,
} from "./data/search";

function App() {
  useEffect(() => {
    const test = async () => {
      const { englishVerses, malayalamVerses } = await loadBible();

      const englishHaystack = createEnglishHaystack(englishVerses);
      const malayalamHaystack = createMalayalamHaystack(malayalamVerses);

      const englishResults = searchEnglish(
        englishVerses,
        englishHaystack,
        "beginning",
      );

      const malayalamResults = searchMalayalam(
        malayalamVerses,
        malayalamHaystack,
        "ദൈവം",
      );

      console.log("English:", englishResults);
      console.log("Malayalam:", malayalamResults);
    };

    test();
  }, []);

  return <div>Testing...</div>;
}

export default App;
