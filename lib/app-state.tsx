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
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = user !== null;

  return (
    <AppStateContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        setUser,
        isAuthenticated,
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
