"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext"; // Assuming you use Firebase Auth

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // Load cart from backend if logged in
  useEffect(() => {

    if (user && user.id) {
      fetch(`http://localhost:8000/api/cart/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCart(data.cart_items || []);
          console.log("Cart successfully loaded:", JSON.stringify(data.cart_items, null, 2));
        })
        .catch((error) => console.error("Error fetching cart:", error));
    } else {
      const localCart = localStorage.getItem("cart");
      setCart(localCart ? JSON.parse(localCart) : []);
    }
  }, [user]);

  // Add or update an item in the cart
  const addToCart = async (meal) => {
    let updatedCart = [...cart];

    const normalizedMeal = {
      meal_id: meal.mealId || meal.meal_id, // Ensure meal_id is set
      name: meal.name,
      price: meal.price,
      quantity: meal.quantity || 1, // Default quantity to 1 if not provided
    };
  // Check if the meal already exists in the cart and update the quantity
  const existingItemIndex = updatedCart.findIndex((item) => item.meal_id === normalizedMeal.meal_id);
  if (existingItemIndex !== -1) {
    updatedCart[existingItemIndex] = {
      ...updatedCart[existingItemIndex],
      quantity: updatedCart[existingItemIndex].quantity + normalizedMeal.quantity,
    };
  } else {
    updatedCart.push(normalizedMeal);
  }

  // Update cart in backend or local storage
  if (user && user.id) {
    try {
      const response = await fetch(`http://localhost:8000/api/cart/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      });
      if (!response.ok) throw new Error("Failed to update cart on backend");
    } catch (error) {
      console.error("Error updating cart:", error);
      return;
    }
  } else {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  // Update the cart in state
  setCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = async (mealId) => {
    const updatedCart = cart.filter((item) => item.meal_id !== mealId);
    

    if (user && user.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/cart/${user.id}/${mealId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to remove item from backend cart");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        return;
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Cart successfully updated in localStorage: ", updatedCart)
    }
    setCart(updatedCart);
  };

  // Update quantity of an item
  const updateQuantity = async (mealId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(mealId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.meal_id === mealId ? { ...item, quantity: newQuantity } : item
    );

    if (user && user.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/cart/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify( updatedCart ),
        });

        if (!response.ok) throw new Error("Failed to update cart quantity on backend");
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        return;
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
