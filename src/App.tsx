import Home from "./pages/Home";
import { BibleProvider } from "./context/BibleContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BibleProvider>
        <Home />
      </BibleProvider>
    </ThemeProvider>
  );
}

export default App;
