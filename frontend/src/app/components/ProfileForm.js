"use client";

import { useState } from "react";
import { TextField, Button, Avatar, MenuItem, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { checkUsername } from "../services/api";

export default function ProfileForm({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);


  // Handle input change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // If username is being updated, check for uniqueness
    if (name === "username" && value.trim() !== "") {
      const available = await checkUsername(value);
      setUsernameAvailable(available);
    }
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: imageUrl });
    }
  };

  // Handle form submission
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
      id: user.id, // Ensure the user ID is included
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender,
      age: user.age,
      username: user.username,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log(JSON.stringify(userData))
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update state with new user data
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Edit Profile
      </Typography>

      {/* Profile Picture */}
      <div className="flex flex-col items-center my-4">
        <Avatar
          src={user.profilePicture}
          sx={{ width: 100, height: 100, marginBottom: 2 }}
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          className="mt-2"
        >
          Upload Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </div>

      {/* Profile Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          name="first_name"
          value={user.first_name || ""}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="last_name"
          value={user.last_name || ""}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={user.email || ""}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
          disabled // Email shouldn't be changed
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone_number"
          value={user.phone_number || ""}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          fullWidth
          select
          label="Gender"
          name="gender"
          value={user.gender || ""}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
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
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={user.username || ""}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
          helperText={
            usernameAvailable === null
              ? ""
              : usernameAvailable
              ? "✅ Username is available"
              : "❌ Username is already taken"
          }
          error={usernameAvailable === false}
        />

        {error && <Typography color="error">{error}</Typography>}

        {/* Save Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </>
  );
}
