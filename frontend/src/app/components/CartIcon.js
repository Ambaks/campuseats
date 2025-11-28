"use client";
import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import RecommendedMeals from "./RecommendedMeals";
import useGeolocation from "../services/useGeolocation";


const CartIcon = () => {
  const location = useGeolocation();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      {/* Cart Icon Button */}
      <IconButton sx={{ color: "black" }} onClick={handleDrawerOpen}>
        <Badge
          badgeContent={cart.length}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#00A19D",
              color: "white",
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      {/* Right-Side Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: { sm: 420, xs: "100%"},
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header Section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #ddd" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Your Cart ({cart.length})
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cart Items List */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <Typography variant="body1">Your cart is empty.</Typography>
            ) : (
              cart.map((item) => (
                <Box key={item.meal_id} sx={{ display: "flex", mb: 2, borderBottom: "1px solid #eee", pb: 2 }}>
                  {/* Item Image */}
                  <Box sx={{ width: 100, height: 100, position: "relative", mr: 2 }}>
                    <Image src={item.image_url} alt={item.name} layout="fill" objectFit="cover" className="rounded-lg" />
                  </Box>

                  {/* Item Details */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>

                    {/* Quantity Controls & Remove Button in One Row */}
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1, justifyContent: "space-between" }}>
                      {/* Quantity Controls */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button size="small" onClick={() => updateQuantity(item.meal_id, item.quantity - 1)}>-</Button>
                        <Typography variant="body2" sx={{ mx: 1 }}>
                          {item.quantity}
                        </Typography>
                        <Button size="small" onClick={() => updateQuantity(item.meal_id, item.quantity + 1)}>+</Button>
                      </Box>

                      {/* Remove Button (Aligned to the Right) */}
                      <Button sx={{ color: "red" }} onClick={() => removeFromCart(item.meal_id)}>
                        REMOVE
                      </Button>
                    </Box>
                  </Box>

                </Box>
              ))
            )}
          </Box>

          {location ? (
        <RecommendedMeals userLat={location.lat} userLon={location.lon} />
          ) : (
            <p>Fetching location...</p>
          )}

          {/* Subtotal and Checkout */}
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                SUBTOTAL
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              TAXES CALCULATED AT CHECKOUT
            </Typography>
            <Link href="/checkout" passHref>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                CHECKOUT
              </Button>
            </Link>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CartIcon;
