"use client";
import React, { useState } from "react";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { redirectToStripeCheckout } from "../stripe/StripeCheckout";

export default function StripePaymentButton() {
  const [loading, setLoading] = useState(false);
  const { order } = useOrder();
  const {cart} = useCart();
  const [hover, setHover] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    if (!order.email) {
        alert("Please provide your email.");
        setLoading(false);
        return;
    }

    try {
        const res = await fetch("http://localhost:8000/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });


        // Check for errors in response
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`API Error: ${errorData.detail || "Unknown error"}`);
        }

        const data = await res.json();
        console.log("Checkout Session Response:", data); // Debugging log

        if (!data.sessionId) {
            throw new Error("Invalid session ID received from backend.");
        }

        await redirectToStripeCheckout(data.sessionId);
      } catch (error) {
          console.error("Checkout error:", error.message);
          alert(`Error: ${error.message}`);
      }

      setLoading(false);
  };


  const buttonStyle = {
    backgroundColor: loading ? "#aaa" : "#00A19D", // Teal when not loading
    color: "#fff",
    width: "100%",
    padding: "10px 20px",
    borderRadius: "10px", // Increased corner radius
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.3s",
    opacity: hover ? 0.8 : 1, // Change opacity on hover
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {loading ? "Processing..." : "Checkout Using Stripe"}
    </button>
  );
}
