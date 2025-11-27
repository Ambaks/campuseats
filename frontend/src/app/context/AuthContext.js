"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../../utils/firebase";
import { 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken
} from "firebase/auth";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from backend
  const fetchUserData = async (firebaseUser) => {
    try {
      const token = await getIdToken(firebaseUser);
      const response = await fetch(`${API_URL}/api/users/${firebaseUser.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // User not found in database - might be newly created
        console.log("User not found in database, might need to complete profile");
        return { ...firebaseUser, needsProfileSetup: true };
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const userData = await response.json();
      return { ...firebaseUser, ...userData };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out. Please try again.");
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        const userData = await fetchUserData(auth.currentUser);
        setUser(userData);
        setError(null);
      } catch (error) {
        console.error("Error refreshing user:", error);
        setError("Failed to refresh user data");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError(null);

      if (currentUser) {
        try {
          const userData = await fetchUserData(currentUser);
          setUser(userData);
        } catch (error) {
          console.error("Error in auth state change:", error);
          setError("Failed to load user data");
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    setUser,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
