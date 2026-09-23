import {
  BookOpen,
  Compass,
  Languages,
  Search,
  TestTube2,
  User,
} from "lucide-react";

import { HomeAction } from "./HomeAction";

const actions = [
  {
    label: "Search",
    icon: Search,
    glow: "#7dd3fc",
  },
  {
    label: "Test",
    icon: TestTube2,
    glow: "#e6bd55",
  },
  {
    label: "My Decks",
    icon: BookOpen,
    glow: "#93c5fd",
  },
  {
    label: "Explore",
    icon: Compass,
    glow: "#60a5fa",
  },
  {
    label: "Language",
    icon: Languages,
    glow: "#bfdbfe",
  },
  {
    label: "Profile",
    icon: User,
    glow: "#f5df9b",
  },
];

export function HomeActions() {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
      {actions.map((action) => (
        <HomeAction
          key={action.label}
          label={action.label}
          icon={action.icon}
          glow={action.glow}
        />
      ))}
    </div>
  );
}
