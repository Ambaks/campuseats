import {
    Typography,
    Card,
    CardContent,
    Avatar,
    Box,
    Button,
  } from "@mui/material";
  import Image from "next/image";
import ActionButtons from "./ActionButtons";
import { useEffect, useState } from "react";
import { getChefReviewSummary } from "../services/api";
  
  export function MealCard({ meal, isFlipped, onFlip }) {

    const [ratingSummary, setRatingSummary] = useState({
      average_rating: 0,
      review_count: 0,
    });

    useEffect(() => {
      async function fetchSummary() {
        console.log("Fetching rating summary for chef ID:", meal.seller.id);
        const summary = await getChefReviewSummary(meal.seller.id);
        setRatingSummary(summary);
        console.log("Rating summary:", summary);
      }
      fetchSummary();
    }, [meal.seller.id]);


    // Convert distance: Show in meters if below 1000, otherwise convert to km
    const formattedDistance =
      meal.distance < 1000
        ? `${meal.distance} m`
        : `${(meal.distance / 1000).toFixed(1)} km`;
    
    const numericDistance = (() => {
      if (formattedDistance.includes("km")) {
        return parseFloat(formattedDistance) * 1000;
      }
      return parseFloat(formattedDistance);
    })();
    
    const getDistanceColor = (distance) => {
      if (distance <= 500) return "#4CAF50"; // green
      if (distance <= 1000) return "#FFD700"; // yellow
      return "#FF6A1D"; // orange (default)
    };
    
    const distanceColor = getDistanceColor(numericDistance);

  
    return (
      <Box
        className="perspective cursor-pointer"
        onClick={() => onFlip(meal.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onFlip(meal.id);
        }}
        sx={{ outline: "none" }}
      >
        <Box
          className={`relative w-full h-72 transition-transform transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          sx={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <Card
            className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-md"
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Box className="h-[60%] w-full relative">
              <Image
                src={meal.image_url}
                alt={meal.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <CardContent
              className="h-[40%] flex items-center gap-2 p-2"
              sx={{ padding: "8px" }}
            >
              <div className="flex flex-col w-full">
                <Typography className="flex pt-1 justify-center">
                  {meal.name}
                </Typography>
                <div className="flex pt-4 ml-4 gap-2.5 items-center">
                  <Avatar
                    src={meal.seller.profile_picture}
                    alt={meal.seller.username}
                    sx={{ width: 44, height: 44 }}
                  />
                  <Box className="flex flex-col">
                    <Typography variant="subtitle1">{meal.seller.username}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      ⭐ {ratingSummary.average_rating} ({ratingSummary.review_count})
                    </Typography>
                  </Box>
                  {/* Distance Display */}
                  <Box
                    className="ml-auto mr-4 flex items-center justify-center"
                    sx={{
                      width: "40px",
                      height: "40px",
                      color: distanceColor,
                      fontWeight: "bold",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0px 0px 6px ${distanceColor}`,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                      {formattedDistance}
                    </Typography>
                  </Box>


                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Back Side */}
          <Card
            className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-md p-4 flex flex-col justify-between"
            sx={{
              borderRadius: "20px",
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            <Box>
              <Typography className="pb-2" variant="h6" sx={{ fontWeight: 700 }}>
                {meal.name}
              </Typography>
              <Typography variant="body2">
                {meal.description.length > 104 ? `${meal.description.slice(0, 104)}...` : meal.description}
              </Typography>
              <div className="pb-1 pt-4">
                <Typography variant="h7" sx={{ fontWeight: 700 }}>
                  Ingredients: <br />
                </Typography>
              </div>
              <Typography variant="caption" color="textSecondary">
                {meal.ingredients.length > 68
                  ? `${meal.ingredients.slice(0, 68)}...`
                  : meal.ingredients}
              </Typography>
            </Box>
            <Box className="flex justify-between mt-4">
              
              <ActionButtons meal={meal}/>

            </Box>
          </Card>
        </Box>
      </Box>
    );
  }
  