import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  Divider,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import MealDetailsModal from "./MealDetailsModal";

const timeSlots = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"];

const ActionButtons = ({ meal }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleViewDetails = (meal) => {
    setInfoOpen(true);
  };

  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);

  const handleOrderOpen = () => setOrderOpen(true);
  const handleOrderClose = () => setOrderOpen(false);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle form submission.
  // e.nativeEvent.submitter.value tells us which button triggered the submit: "cart" or "buy"
  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;

    // Check if a time slot is selected
    if (!selectedTime) {
      alert("Please select a pickup time before placing your order.");
      return; // Stop execution if no time is selected
    }

    // Gather form data into an object
    const orderData = {
      mealId: meal.id,
      name: meal.name,
      image_url: meal.image_url,
      price: meal.price,
      quantity: quantity,
      pickupTime: selectedTime,
    };

    if (action === "cart") {
      // Submit to your backend or use your addToCart function.
      await addToCart(orderData);
      handleOrderClose();
    } else if (action === "buy") {
      // For a Buy Now action, you might submit the order data to a different endpoint.
      await addToCart(orderData);
      handleOrderClose();
      window.location.href = "/checkout";
    }
};


  return (
    <>
      {/* More Info Button */}
      <Button
        variant="outlined"
        size="small"
        sx={{
          borderRadius: "20px",
          borderColor: "primary.main",
          color: "primary.main",
        }}
        onClick={() => handleViewDetails(meal)}
      >
        More Info
      </Button>

      {/* Order Now Button */}
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ borderRadius: "20px", ml: 1 }}
        onClick={handleOrderOpen}
      >
        Order Now
      </Button>

      {/* Shared Modal */}
      <MealDetailsModal
          open={infoOpen}
          handleClose={() => setInfoOpen(false)}
          meal={meal}
        />

      {/* Order Modal as a Form */}
      <Modal
        open={orderOpen}
        onClose={handleOrderClose}
        aria-labelledby="order-modal"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* The form will stop propagation so clicks don't close the modal */}
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              width: 400,
              bgcolor: "white",
              boxShadow: 24,
              p: 3,
              borderRadius: "10px",
            }}
          >
            <Typography id="order-modal" variant="h6">
              Place Your Order
            </Typography>

            {/* Quantity Selection */}
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 1 }}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            {/* Pickup Time Slots */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Select a Pickup Time
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {timeSlots.map((time) => (
                <Grid item xs={4} key={time}>
                  <Card
                    sx={{
                      p: 1,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: selectedTime === time ? "primary.main" : "grey.300",
                      color: selectedTime === time ? "white" : "black",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Card>
                </Grid>
              ))}
            </Grid>

              <Divider sx={{mt: 2}}/>

            {/* Total Price Calculation */}
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "semi-bold" }}>
              Total: ${meal.price * quantity}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              {/* Button to add to cart; value "cart" is used in submit handler */}
              <Button
                variant="outlined"
                sx={{ flex: 1, mr: 1 }}
                type="submit"
                value="cart"
              >
                Add to Cart
              </Button>
              {/* Button to buy now; value "buy" is used in submit handler */}
              <Button
                variant="contained"
                color="secondary"
                sx={{ flex: 1 }}
                type="submit"
                value="buy"
              >
                Buy Now
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default ActionButtons;
