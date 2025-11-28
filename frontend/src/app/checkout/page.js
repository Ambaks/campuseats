"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Image from "next/image";
import { useCart } from "../context/CartContext"; 
import { useOrder } from "../context/OrderContext";
import StripePaymentButton from "../components/StripePaymentButton";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function OrdersPage() {
  const { cart } = useCart();
  const { order, updateOrder } = useOrder();

  // Example shipping cost / calculation
  const shippingCost = 0; // Could be dynamic

  // Example subtotal calculation
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Example total
  const total = subtotal + shippingCost;

  // Email & phone local states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Checkbox for newsletter
  const [newsletter, setNewsletter] = useState(true);
  // Discount code
  const [discountCode, setDiscountCode] = useState("");

  // Payment form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");

  // Billing address local states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateAddress, setStateAddress] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // When a field changes, update both local state and OrderContext.
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    updateOrder({ email: value });
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    updateOrder({ cardNumber: value });
  };

  const handleCardExpiryChange = (e) => {
    const value = e.target.value;
    setCardExpiry(value);
    updateOrder({ cardExpiry: value });
  };

  const handleCardCVCChange = (e) => {
    const value = e.target.value;
    setCardCVC(value);
    updateOrder({ cardCVC: value });
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    updateOrder({ address: value });
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    updateOrder({ city: value });
  };

  const handleStateAddressChange = (e) => {
    const value = e.target.value;
    setStateAddress(value);
    updateOrder({ stateAddress: value });
  };

  const handleZipChange = (e) => {
    const value = e.target.value;
    setZip(value);
    updateOrder({ zip: value });
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setCountry(value);
    updateOrder({ country: value });
  };

  const handleApplyDiscount = () => {
    alert(`Applying discount code: ${discountCode}`);
  };

  const convertToSubcurrency = (amount, factor = 100) => {
    return Math.round(amount * factor)
  }

  // Note: You no longer need the local handlePayNow since StripePaymentButton will use OrderContext.
  // You can remove or repurpose handlePayNow if needed.

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
        mb: 8,
        mt: {lg: 4},
        borderRadius: 2, // Corner radius
        border: "1px solid #ccc", // Light gray border
        boxShadow: 4, // Material UI shadow level
      }}
    >
      <Grid container spacing={4}>
        {/* LEFT COLUMN (Contact, Payment, etc.) */}
        <Grid item xs={12} md={6}>

          {/* Contact */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: "black" }} variant="h6" gutterBottom>
              Contact
            </Typography>
            <TextField
              label="Email"
              fullWidth
              required
              sx={{ mb: 2 }}
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <FormControlLabel
              sx={{ color: "black" }}
              control={
                <Checkbox
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
              }
              label="Email me with news and offers"
            />
          </Box>

          {/* Phone Field */}
          <TextField
            label="Phone"
            fullWidth
            sx={{ mb: 2, mt: 2 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Divider sx={{ my: 2 }} />

          {/* Payment Section */}
          
          
        </Grid>

        {/* RIGHT COLUMN (Order Summary) */}
        <Grid item xs={12} md={6}>
          <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
            <Typography sx={{ color: "black" }} variant="h6" gutterBottom>
              Order summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Cart Items */}
            {cart.length === 0 ? (
              <Typography sx={{ color: "black" }} variant="body2">
                Your cart is empty.
              </Typography>
            ) : (
              cart.map((item, index) => (
                <Box key={index} sx={{ display: "flex", mb: 2 }}>
                  {item.image_url && (
                    <Box sx={{ mr: 2 }}>
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                  </Box>

                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: "black" }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: "black" }}>
                      ${(item.price || 0) * (item.quantity || 1)}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}

            {/* Discount code / Gift card */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <TextField
                placeholder="Discount code or gift card"
                fullWidth
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button variant="outlined" onClick={handleApplyDiscount}>
                Apply
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Subtotal & Shipping */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{ color: "black" }}>Subtotal</Typography>
              <Typography sx={{ color: "black" }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Total */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{ color: "black" }} variant="subtitle1">
                Total
              </Typography>
              <Typography sx={{ color: "black" }} variant="subtitle1">
                ${(subtotal).toFixed(2)}
              </Typography>
            </Box>

            {/* Payment Button */}
            <StripePaymentButton />

            {/* Payment security info, etc. */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Secure and encrypted
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
