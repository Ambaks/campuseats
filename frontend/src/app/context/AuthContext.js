"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../../utils/firebase"; // Your Firebase config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:8000/api/users/${currentUser.uid}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const userData = await response.json();
          setUser({ ...currentUser, ...userData });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
