import {
  BookOpen,
  Brain,
  Compass,
  Languages,
  Search,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { HomeAction } from "./HomeAction";

const actions = [
  {
    label: "Search",
    icon: Search,
    color: "#f5df9b",
    path: "/search",
  },
  {
    label: "Test",
    icon: Brain,
    color: "#f5df9b",
    path: "/test",
  },
  {
    label: "My Decks",
    icon: BookOpen,
    color: "#f5df9b",
    path: "/decks",
  },
  {
    label: "Explore",
    icon: Compass,
    color: "#f5df9b",
    path: "/explore",
  },
  {
    label: "Profile",
    icon: User,
    color: "#f5df9b",
    path: "/profile",
  },
];

type HomeActionsProps = {
  language: "english" | "malayalam";
  onLanguageChange: (language: "english" | "malayalam") => void;
};

export function HomeActions({ language, onLanguageChange }: HomeActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
      {actions.map((action) => (
        <HomeAction
          key={action.label}
          label={action.label}
          icon={action.icon}
          color={action.color}
          onClick={() => navigate(action.path)}
        />
      ))}

      <HomeAction
        label={language === "english" ? "Malayalam" : "English"}
        icon={Languages}
        color="#f5df9b"
        onClick={() =>
          onLanguageChange(language === "english" ? "malayalam" : "english")
        }
      />
    </div>
  );
}
