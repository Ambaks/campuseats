"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext"; // Adjust the path to your AuthContext
import { auth } from "../../../utils/firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState(null);
  const { user } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User logged in successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        // Register user with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        console.log("User registered:", user.uid);

        // Prepare user data for database
        const userData = {
            id: user.uid,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: user.email,
        };

        // Register user in your database
        const response = await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Failed to register user in the database.");
        }

        console.log("User successfully added to database");

    } catch (err) {
        console.error("Registration Error:", err.message);
        setError(err.message);
    }
};


  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      {isLogin ? (
        <>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email" name="email" type="email" required sx={{ mb: 2 }} onChange={handleChange} />
            <TextField fullWidth label="Password" name="password" type="password" required sx={{ mb: 2 }} onChange={handleChange} />
            <Button type="submit" fullWidth variant="contained" color="primary">Login</Button>
          </form>
          <Button fullWidth variant="text" color="secondary" onClick={() => setIsLogin(false)} sx={{ mt: 2 }}>
            Don&apos;t have an account? Register Now!
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField fullWidth label="First Name" name="firstName" required sx={{ mb: 2 }} onChange={handleChange} />
            <TextField fullWidth label="Last Name" name="lastName" required sx={{ mb: 2 }} onChange={handleChange} />
            <TextField fullWidth label="Email" name="email" type="email" required sx={{ mb: 2 }} onChange={handleChange} />
            <TextField fullWidth label="Password" name="password" type="password" required sx={{ mb: 2 }} onChange={handleChange} />
            <Button type="submit" fullWidth variant="contained" color="primary">Register</Button>
          </form>
          <Button fullWidth variant="text" color="secondary" onClick={() => setIsLogin(true)} sx={{ mt: 2 }}>
            Already have an account? Login
          </Button>
        </>
      )}
    </Box>
  );
}
