"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

export type UserRole = "consumer" | "seller" | null;
export type BusinessType = "restaurant" | "butcher" | "bakery";
export type AppScreen =
  | "splash"
  | "onboarding"
  | "role-select"
  | "signup-consumer"
  | "signup-seller"
  | "signin"
  | "consumer-home"
  | "seller-dashboard"
  | "settings";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  businessName?: string;
  businessType?: BusinessType;
  avatar?: string;
}

interface AppStateContextType {
  currentScreen: AppScreen;
  setCurrentScreen: Dispatch<SetStateAction<AppScreen>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isAuthenticated: boolean;
  accessibilityMode: boolean;
  setAccessibilityMode: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  speak: (text: string) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [user, setUser] = useState<User | null>(null);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated = user !== null;

  // Text-to-Speech function for accessibility
  const speak = (text: string) => {
    if (accessibilityMode && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      // Try to use a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("victoria") ||
          voice.name.toLowerCase().includes("karen") ||
          voice.name.includes("Google UK English Female")
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        setUser,
        isAuthenticated,
        accessibilityMode,
        setAccessibilityMode,
        sidebarOpen,
        setSidebarOpen,
        speak,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
