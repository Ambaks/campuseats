"use client";

import { useState } from "react";
import { TextField, Button, Avatar, MenuItem, Typography, Box, IconButton } from "@mui/material";
import { CloudUpload, Logout, Save, Edit } from "@mui/icons-material";
import { checkUsername } from "../services/api";
import { auth } from "../../../utils/firebase";
import { getIdToken } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProfileForm({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const { logout } = useAuth();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "username" && value.trim() !== "") {
      const available = await checkUsername(value);
      setUsernameAvailable(available);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (usernameAvailable === false) {
      setError("Username is already taken.");
      setLoading(false);
      return;
    }

    const userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender,
      age: user.age,
      username: user.username,
    };

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to update your profile");
      }

      const token = await getIdToken(currentUser);

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout");
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
            My Profile
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95 }}>
            Manage your account settings
          </Typography>
        </Box>
        <IconButton
          onClick={handleLogout}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          <Logout />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
          mt: -5,
        }}
      >
        <Box
          sx={{
            position: "relative",
            mb: 2,
          }}
        >
          <Avatar
            src={user.profilePicture}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#FF7F51",
              borderRadius: "50%",
              p: 1,
              border: "3px solid white",
            }}
          >
            <Edit sx={{ color: "white", fontSize: 18 }} />
          </Box>
        </Box>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{
            backgroundColor: "#FF7F51",
            color: "white",
            borderRadius: "20px",
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(255, 127, 81, 0.3)",
            "&:hover": {
              backgroundColor: "#ff6a3d",
              boxShadow: "0 6px 16px rgba(255, 127, 81, 0.4)",
            },
          }}
        >
          Upload Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
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

      <form onSubmit={handleSubmit}>
        <Box sx={{ px: 1 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2.5}}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={user.first_name || ""}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
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
              name="last_name"
              value={user.last_name || ""}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
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
            value={user.email || ""}
            onChange={handleChange}
            disabled
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
              },
            }}
          />

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={user.username || ""}
            onChange={handleChange}
            helperText={
              usernameAvailable === null
                ? "Choose a unique username"
                : usernameAvailable
                ? "✅ Username is available"
                : "❌ Username is already taken"
            }
            error={usernameAvailable === false}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#FF7F51",
                },
                "&.Mui-focused fieldset": {
                  borderColor: usernameAvailable === false ? "#ff4444" : "#FF7F51",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: usernameAvailable === false ? "#ff4444" : "#FF7F51",
              },
              "& .MuiFormHelperText-root": {
                fontWeight: 500,
              },
            }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone_number"
            value={user.phone_number || ""}
            onChange={handleChange}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
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

          <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={user.gender || ""}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
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
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={user.age || ""}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
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

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<Save />}
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
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
