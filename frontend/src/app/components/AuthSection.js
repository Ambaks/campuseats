"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box, Divider } from "@mui/material";
import { Login as LoginIcon, PersonAdd as RegisterIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
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
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        console.log("User registered:", user.uid);

        const userData = {
            id: user.uid,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: user.email,
        };

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
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF7F51 0%, #ff9a73 100%)",
          color: "white",
          p: 3,
          borderRadius: "12px 12px 0 0",
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
          {isLogin ? "Welcome Back!" : "Join CampusEats"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95 }}>
          {isLogin ? "Sign in to your account" : "Create your account to get started"}
        </Typography>
      </Box>

      {error && (
        <Box
          sx={{
            backgroundColor: "#ffe6e6",
            border: "1px solid #ff4444",
            borderRadius: "8px",
            p: 2,
            mb: 3,
          }}
        >
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      {isLogin ? (
        <Box sx={{ px: 1, pb: 2 }}>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#FF7F51",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF7F51",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF7F51",
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#FF7F51",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF7F51",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF7F51",
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                backgroundColor: "#FF7F51",
                color: "white",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255, 127, 81, 0.3)",
                "&:hover": {
                  backgroundColor: "#ff6a3d",
                  boxShadow: "0 6px 16px rgba(255, 127, 81, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Login
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setIsLogin(false)}
            sx={{
              color: "#FF7F51",
              borderColor: "#FF7F51",
              py: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#ff6a3d",
                backgroundColor: "rgba(255, 127, 81, 0.04)",
              },
            }}
          >
            Don&apos;t have an account? Register Now!
          </Button>
        </Box>
      ) : (
        <Box sx={{ px: 1, pb: 2 }}>
          <form onSubmit={handleRegister}>
            <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#FF7F51",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF7F51",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FF7F51",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#FF7F51",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF7F51",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FF7F51",
                  },
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#FF7F51",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF7F51",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF7F51",
                },
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#FF7F51",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF7F51",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF7F51",
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<RegisterIcon />}
              sx={{
                backgroundColor: "#FF7F51",
                color: "white",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255, 127, 81, 0.3)",
                "&:hover": {
                  backgroundColor: "#ff6a3d",
                  boxShadow: "0 6px 16px rgba(255, 127, 81, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Create Account
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setIsLogin(true)}
            sx={{
              color: "#FF7F51",
              borderColor: "#FF7F51",
              py: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#ff6a3d",
                backgroundColor: "rgba(255, 127, 81, 0.04)",
              },
            }}
          >
            Already have an account? Login
          </Button>
        </Box>
      )}
    </Box>
  );
}
