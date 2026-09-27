import { BrowserRouter, Routes, Route } from "react-router-dom";

import { BibleProvider } from "./context/BibleContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Test from "./pages/Test";
import Decks from "./pages/Decks";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Deck from "./pages/Deck";

function App() {
  return (
    <AuthProvider>
      <BibleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />

            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            />

            <Route
              path="/decks"
              element={
                <ProtectedRoute>
                  <Decks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/decks/:deckId"
              element={
                <ProtectedRoute>
                  <Deck />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </BibleProvider>
    </AuthProvider>
  );
}

export default App;
