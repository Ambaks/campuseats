"use client";
import { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, MenuItem, Grid, Card, CardContent, Box, Modal, Checkbox, FormControlLabel, Divider } from "@mui/material";
import FileUploadButton from "./FileUploadButton";
import PickupTimes from "./PickupTimes";
import useGeolocation from "../services/useGeolocation";
import { getAuth } from "firebase/auth";



export default function Menu({ meals, setMeals, user }) {
  const [mealData, setMealData] = useState({
    name: "",
    description: "",
    ingredients: "",
    price: 0.0,
    image: null,
    quantity: 0,
    unlimited: false,

  });
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [timeslots, setTimeslots] = useState([]);

  const location = useGeolocation();

  useEffect(() => {
    if (editMode && selectedMeal) {
      setTimeslots(selectedMeal.timeslots || []);

    } else {
      setTimeslots([]);
    }
  }, [editMode, selectedMeal]);

  const handleMealClick = (meal, index) => {
    setSelectedMeal({ ...meal, index });
    setOpenModal(true);
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editMode && selectedMeal) {
      setSelectedMeal({ ...selectedMeal, [name]: value });
    } else {
      setMealData({ ...mealData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    if (editMode && selectedMeal) {
      setSelectedMeal({ ...selectedMeal, image: e.target.files[0] });
    } else {
      setMealData({ ...mealData, image: e.target.files[0] });
    }
  };

  const handleCheckboxChange = (e) => {
    if (editMode && selectedMeal) {
      setSelectedMeal({ ...selectedMeal, unlimited: e.target.checked, quantity: e.target.checked ? "Unlimited" : "" });
    } else {
      setMealData({ ...mealData, unlimited: e.target.checked, quantity: e.target.checked ? "Unlimited" : "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const dataToSubmit = editMode ? selectedMeal : mealData;
  
    Object.entries(dataToSubmit).forEach(([key, value]) => {
      if (key !== "index" && key !== "created_at") {
        formData.set(key, value);
      }
    });
  
  
    if (user?.id) {
      formData.set("seller_id", user.uid);
    } else {
      console.error("Seller ID is missing");
      return;
    }
  
    // Add latitude and longitude from geolocation
    if(location) {
      formData.set("latitude", location.lat);
      formData.set("longitude", location.lon);
    }
  
    if (timeslots && timeslots.length > 0) {
      formData.set("timeslots", JSON.stringify(timeslots));
    } else {
      console.warn("No timeslots found!");
    }
    
    formData.delete("id");
    // Log formData to verify
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = await user.getIdToken();


      const response = await fetch(editMode ? `http://localhost:8000/api/meals/${selectedMeal.id}` : "http://localhost:8000/api/meals", {
        method: editMode ? "PUT" : "POST",
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
        body: formData,
      });
  
      if (response.ok) {
        if (editMode) {
          const updatedMeals = meals.map((meal, idx) => idx === selectedMeal.index ? selectedMeal : meal);
          setMeals(updatedMeals);
        } else {
          setMeals([...meals, mealData]);
        }
        setOpenModal(false);
        setEditMode(false);
      } else {
        console.error("Failed to process meal");
      }
    } catch (error) {
      console.error("Error processing meal:", error);
    }
  };
  

  const handleRemoveMeal = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const mealId = meals[selectedMeal.index]?.id;
  
    if (!user || !mealId) return;
  
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete meal");
      }
  
      // Remove meal from UI
      setMeals(meals.filter((_, idx) => idx !== selectedMeal.index));
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting meal:", error);
      // Optionally show error feedback to the user
    }
  };

  return (
    <Container maxWidth="md">

      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", my: 3 }} />

      <Typography variant="h3" align="center" gutterBottom>
        FOOD MENU
      </Typography>
      
      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", my: 3 }} />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {meals.length > 0 ? (
            meals.map((meal, index) => (
                <Grid item xs={6} sm={6} key={index}>
                <Card
                  sx={{
                    bgcolor: "white",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    height: { xs: 140, sm: 140 }, // Adjust height dynamically
                    flexWrap: "wrap", // Ensures elements wrap properly on smaller screens
                  }}
                  onClick={() => handleMealClick(meal, index)}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      minWidth: 0, // Prevents text from overflowing the card
                      maxWidth: "100%", // Ensures text doesn't overflow
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 1,
                        fontSize: { xs: "0.9rem", sm: "1rem" }, // Adjust font size responsively
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      display="block"
                    >
                      {meal.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                      display="block"
                    >
                      {meal.price} USD
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mb: 1, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
                      display="block"
                    >
                      {meal.unlimited ? "Unlimited" : `Quantity: ${meal.quantity}`}
                    </Typography>
                  </CardContent>
              
                  <Box
                    sx={{
                      width: { xs: 60, sm: 80 }, // Adjust image size dynamically
                      height: { xs: 60, sm: 80 },
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #ccc",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={meal.image_url}
                      alt={meal.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
              
            ))
        ) : (
            <Box sx={{ display: "flex", mx: "auto", mr: 1.5, justifyContent: "center", alignItems: "center", width: "90%", textAlign: "center", bgcolor: "#e0e0e0", p: 2, borderRadius: 2 }}>
            <Typography variant="body1">Add meals to see them appear on your menu</Typography>
            </Box>
        )}
        </Grid>


      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", mb: 3, mt: 5 }} />

      <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#00A19D", "&:hover": { backgroundColor: "#006666" } }} onClick={() => { setOpenModal(true); setEditMode(false); }}>
        Add Meal
      </Button>

      {/* Add/Edit Meal Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box 
            sx={{ 
            position: "absolute", 
            top: "2%",  // Reduced top margin
            left: "50%",
            transform: "translate(-50%, 0%)", 
            width: "90%",
            maxWidth: 400,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            maxHeight: "90vh", // Ensures modal is not too tall
            overflowY: "auto", // Enables scrolling inside modal
            }}
        >
            <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", mb: 1}} />
            <Typography variant="h6" align="center">{editMode ? "EDIT MEAL" : "ADD A MEAL"}</Typography>
            <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", mb: 1, mt: 1 }} />
            <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Meal Name" name="name" value={editMode ? selectedMeal.name : mealData.name} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Description" name="description" value={editMode ? selectedMeal.description : mealData.description} onChange={handleChange} margin="normal" multiline rows={3} required />
            <TextField fullWidth label="Ingredients" name="ingredients" value={editMode ? selectedMeal.ingredients : mealData.ingredients} onChange={handleChange} margin="normal" multiline rows={3} required />
            <TextField fullWidth label="Price ($)" name="price" type="number" value={editMode ? selectedMeal.price : mealData.price} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Quantity" name="quantity" type="number" value={editMode ? selectedMeal.quantity : mealData.quantity} onChange={handleChange} margin="normal" disabled={editMode ? selectedMeal.unlimited : mealData.unlimited} required={!mealData.unlimited} />
            <FormControlLabel control={<Checkbox checked={editMode ? selectedMeal.unlimited : mealData.unlimited} onChange={handleCheckboxChange} />} label="Unlimited Quantity" />
            <Box sx={{ mt: 2 }}>
                <FileUploadButton onChange={handleImageChange} />
            </Box>

            <PickupTimes timeslots={timeslots} setTimeslots={setTimeslots} />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: "#00A19D", "&:hover": { backgroundColor: "#006666" } }}>
                {editMode ? "Update Meal" : "Post Meal"}
            </Button>
            {editMode && (
                <Button fullWidth sx={{ color: "white", mt: 2, backgroundColor: "#ff4d4d", "&:hover": { backgroundColor: "#cc0000" } }} onClick={handleRemoveMeal}>
                Remove Meal
                </Button>
            )}
            </form>
        </Box>
      </Modal>


    </Container>
  );
}
