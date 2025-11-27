"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { meals } from "../meals";
import { categories, promoCards } from "../data";
import theme from "../theme";
import MealCard from "../components/MealCard";

export default function HomePage() {
  const [flippedCards, setFlippedCards] = useState({});

  const handleFlip = (mealId) => {
    setFlippedCards((prev) => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="container mx-auto px-4">
        <h1>Welcome to CampusEats</h1>
        
        {/* Render Categories */}
        <div className="flex gap-4">
          {categories.map((category) => (
            <div key={category.label}>{category.icon} {category.label}</div>
          ))}
        </div>

        {/* Render Promo Cards */}
        <div className="grid grid-cols-3 gap-4">
          {promoCards.map((promo) => (
            <div key={promo.id} className="promo-card">
              {promo.icon}
              <p>{promo.title}</p>
            </div>
          ))}
        </div>

        {/* Render Meal Cards */}
        <div className="grid grid-cols-3 gap-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} isFlipped={flippedCards[meal.id]} onFlip={handleFlip} />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}


