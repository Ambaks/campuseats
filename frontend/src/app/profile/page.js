"use client";

import { useState } from "react";
import { Paper, Box } from "@mui/material";
import ProfileForm from "../components/ProfileForm";
import AuthSection from "../components/AuthSection";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E5F9F7 0%, #ffffff 50%, #fff5f0 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 550,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          mb: 14,
        }}
      >
        {user ? (
          <ProfileForm user={user} setUser={setUser} />
        ) : (
          <AuthSection />
        )}
      </Paper>
    </Box>
  );
}
