"use client";
import { useEffect, useState, useMemo } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import Image from "next/image";
import { fetchMeals } from "../services/api"; 
import MealDetailsModal from "./MealDetailsModal";

const RecommendedMeals = ({ userLat, userLon, count = 2 }) => {
  const [meals, setMeals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);


  const handleViewDetails = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };
  
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const fetchedMeals = await fetchMeals(userLat, userLon);
        setMeals(fetchedMeals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
    
    if (userLat && userLon) {
      loadMeals();
    }
  }, [userLat, userLon]);

  // Select random meals
  const recommendedItems = useMemo(() => {
    if (!meals.length) return [];
    return [...meals].sort(() => 0.5 - Math.random()).slice(0, count);
  }, [meals, count]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Consider These Items As Well
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {recommendedItems.map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2, 
              p: 2, 
              border: "1px solid #ddd", 
              borderRadius: 2 
            }}
          >
            {/* Image Box (Forcing Square Aspect Ratio) */}
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                position: "relative", 
                borderRadius: 1, 
                overflow: "hidden", 
                flexShrink: 0
              }}
            >
              <Image 
                src={item.image_url} 
                alt={item.name} 
                layout="fill" 
                objectFit="cover" 
              />
            </Box>

            {/* Text Content */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                ${item.price.toFixed(2)}
              </Typography>

              {/* View Details Button */}
              <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={() => handleViewDetails(item)}
              >
                View Details
              </Button>

            </Box>
          </Box>
        ))}
        {/* Shared Modal */}
        <MealDetailsModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          meal={selectedMeal}
        />
      </Box>
    </Box>
  );
};

export default RecommendedMeals;
