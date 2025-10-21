// src/AuthContext.tsx
import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name?: string; // Made optional as per backend response
  email: string;
  [key: string]: unknown;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean; // Added isLoading
}

const AuthContext = createContext<AuthContextType | null>(null);

import type { PropsWithChildren } from "react";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize as true

  const navigate = useNavigate();

  const login = (newToken: string) => {
    console.log("AuthContext: login function called with token:", newToken);
    setToken(newToken);
    try {
      localStorage.setItem("adminToken", newToken);
      console.log(
        "AuthContext: Token saved to localStorage. Value:",
        localStorage.getItem("adminToken")
      );
    } catch (e) {
      console.error("AuthContext: Error saving token to localStorage:", e);
    }
    // fetchUser will be called by useEffect when token state updates
  };

  const logout = () => {
    console.log("AuthContext: logout function called.");
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("adminToken");
      console.log("AuthContext: Token removed from localStorage.");
    } catch (e) {
      console.error("AuthContext: Error removing token from localStorage:", e);
    }
    navigate("/login");
  };

  interface FetchUserResponse {
    id: string;
    name?: string;
    email: string;
    [key: string]: unknown;
  }

  const fetchUser = async (authToken: string | null): Promise<void> => {
    console.log("AuthContext: fetchUser called with authToken:", authToken);
    setIsLoading(true); // Start loading before fetching user
    if (!authToken) {
      setUser(null);
      console.log("AuthContext: No authToken, user set to null.");
      setIsLoading(false); // Done loading if no token
      return;
    }
    try {
      const response: Response = await fetch(
        "https://itekconstruction.onrender.com/api/auth/me",
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      if (response.ok) {
        const data: FetchUserResponse = await response.json();
        setUser(data);
        console.log("AuthContext: User data fetched successfully:", data);
      } else {
        console.error(
          "AuthContext: Failed to fetch user data. Response status:",
          response.status
        );
        logout(); // Token might be invalid or expired, so log out
      }
    } catch (error) {
      console.error("AuthContext: Error fetching user data:", error);
      logout(); // Network error, assume token is bad or unverified
    } finally {
      setIsLoading(false); // Always set loading to false when done
    }
  };

  useEffect(() => {
    console.log(
      "AuthContext: useEffect triggered. Current token state:",
      token
    );
    fetchUser(token);
  }, [token]);

  // Initial fetch when component mounts (only once) - This ensures initial token check
  useEffect(() => {
    if (!token) {
      // If no token initially, we're done loading immediately
      setIsLoading(false);
    }
    // fetchUser(token) is handled by the [token] dependency useEffect
  }, []); // Empty dependency array means it runs once on mount

  const contextValue: AuthContextType = {
    token,
    user,
    login,
    logout,
    isLoading, // Provide isLoading in the context value
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// IMPORTANT: This hook now explicitly checks for null context and throws an error.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    // This error means AuthProvider is not wrapping the component that calls useAuth
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
