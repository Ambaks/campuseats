import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  Typography,
  Divider,
  TextField,
  MenuItem,
} from '@mui/material';

const MealDetailsModal = ({ open, handleClose, meal }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTimeslot, setSelectedTimeslot] = useState('');
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (meal) {
      setSubtotal(meal.price * quantity);
    }
  }, [meal, quantity]);

  const handleQuantityChange = (e) => {
    const qty = Math.max(1, parseInt(e.target.value));
    setQuantity(qty);
  };

  const handleTimeslotChange = (e) => {
    setSelectedTimeslot(e.target.value);
  };

  const formattedDistance = meal && meal.distance !== undefined && meal.distance !== null
  ? (meal.distance < 1000
      ? `${meal.distance} m`
      : `${(meal.distance / 1000).toFixed(1)} km`)
  : '';

const numericDistance = formattedDistance
  ? (formattedDistance.includes("km")
      ? parseFloat(formattedDistance) * 1000
      : parseFloat(formattedDistance))
  : 0;

const getDistanceColor = (distance) => {
  if (distance <= 500) return "#4CAF50"; // green
  if (distance <= 1000) return "#FFD700"; // yellow
  return "#FF6A1D"; // orange (default)
};

const distanceColor = getDistanceColor(numericDistance);


  return (
    <Modal open={open} onClose={handleClose} sx={{zIndex: 1000}}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          zIndex: 1000,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {meal ? (
          <>
            {/* Title and Distance Badge */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">{meal.name}</Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#fff',
                  backgroundColor: distanceColor,
                  boxShadow: `0px 0px 6px ${distanceColor}`,
                }}
              >
                {formattedDistance}
              </Box>
            </Box>

            {/* Meal Image */}
            {meal.image_url && (
              <Box
                component="img"
                src={meal.image_url}
                alt={meal.name}
                sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, mb: 2 }}
              />
            )}

            <Typography variant="body1" sx={{ mb: 1 }}>
              {meal.description}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Price: ${meal.price.toFixed(2)}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Ingredients:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {Array.isArray(meal.ingredients)
                ? meal.ingredients.join(', ')
                : meal.ingredients}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Order Options */}
            <Typography variant="h6">Order This Meal</Typography>

            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 1 }}
            />

            <TextField
              select
              label="Timeslot"
              value={selectedTimeslot}
              onChange={handleTimeslotChange}
              fullWidth
              sx={{ mt: 2 }}
            >
              {meal.timeslots?.length ? (
                meal.timeslots.map((slot, index) => {
                  const displayText = typeof slot === 'object' && slot.start && slot.end
                    ? `${slot.start} - ${slot.end}`
                    : slot;
                  const value = typeof slot === 'object'
                    ? JSON.stringify(slot)
                    : slot;
                  return (
                    <MenuItem key={index} value={value}>
                      {displayText}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>No timeslots available</MenuItem>
              )}
            </TextField>

            <Typography sx={{ mt: 2 }}>
              Subtotal: ${(meal.price * quantity).toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => alert('Meal added to cart (implement logic)')}
            >
              Add to Cart
            </Button>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}

        <Button onClick={handleClose} sx={{ mt: 2 }} fullWidth>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default MealDetailsModal;
