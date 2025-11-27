"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import "@fontsource/poppins"; 

import SearchBar from "./components/SearchBar";
import theme from "./theme";
import { promoCards, categories } from "./data/data";
import NotificationCart from "./components/NotificationCart";
import MealList from "./components/MealList";

export default function HomePage() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [location, setLocation] = useState({ lat: null, lon: null });
  



  // Automatically rotate the promo cards every 3 seconds
  useEffect(() => {

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => console.error("Geolocation error:", error)
        );
    }

    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* Entire page scrolls naturally */}
      <Box sx={{ backgroundColor: "background.default" }}>
        {/* TOP BAR */}
        <Box className="p-1 shadow-md" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FF7F51" }}>
        <img src="/homekooks.png" alt="Logo" style={{ height: 40 }} />
        <NotificationCart />
       
        </Box>

        <SearchBar/>

        {/* HORIZONTAL ICON CAROUSEL (categories) */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            px: 2,
            pb: 2,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {categories.map((cat) => (
            <Box
              key={cat.label}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 60,
              }}
            >
              {cat.icon}
              <Typography variant="caption" color="black" sx={{ mt: 0.5 }}>
                {cat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* PROMO CAROUSEL (3 cards, auto-rotate) */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 120,
            overflow: "hidden",
            mb: 2,

          }}
        >
          {promoCards.map((promo, idx) => (
            <Box
              key={promo.id}
              sx={{
                position: "absolute",
                left: idx === promoIndex ? 4 : "100%",
                width: "98%",
                height: "96%",
                top: 3,
                transition: "left 0.5s ease-in-out",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                boxShadow: 1,
                borderRadius: 4,
                overflow: "auto",
                p: 1,
              }}
            >
              <Box sx={{ mr: 2 }}>{promo.icon}</Box>
              <Box>
                <Typography variant="body2" color="black" sx={{ fontWeight: "bold" }}>
                  {promo.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* FLIPPING MEAL CARDS */}
        <Box
        className="mb-14"
          sx={{
            p: 1,
            
          }}
        >
          {location.lat && location.lon ? (
                <MealList userLat={location.lat} userLon={location.lon} />
            ) : (
                <p>Fetching location...</p>
            )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}