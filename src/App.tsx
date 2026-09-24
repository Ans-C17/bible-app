import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BibleProvider } from "./context/BibleContext";
import { ThemeProvider } from "./context/ThemeContext";

import Home from "./pages/Home";
import Search from "./pages/Search";

function App() {
  return (
    <ThemeProvider>
      <BibleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </BrowserRouter>
      </BibleProvider>
    </ThemeProvider>
  );
}

export default App;
