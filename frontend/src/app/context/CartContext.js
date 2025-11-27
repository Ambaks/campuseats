"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { auth } from "../../../utils/firebase";
import { getIdToken } from "firebase/auth";

const CartContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load cart from backend or localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/api/cart/${user.id}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch cart");
          }
          
          const data = await response.json();
          setCart(data.cart_items || []);
          setError(null);
        } catch (error) {
          console.error("Error fetching cart:", error);
          setError("Failed to load cart");
          
          // Fallback to localStorage
          const localCart = localStorage.getItem("cart");
          if (localCart) {
            setCart(JSON.parse(localCart));
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Load from localStorage for non-authenticated users
        try {
          const localCart = localStorage.getItem("cart");
          setCart(localCart ? JSON.parse(localCart) : []);
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          setCart([]);
        }
      }
    };

    loadCart();
  }, [user]);

  // Add or update item in cart
  const addToCart = async (meal) => {
    try {
      setError(null);
      let updatedCart = [...cart];

      const normalizedMeal = {
        meal_id: meal.mealId || meal.meal_id || meal.id,
        name: meal.name,
        price: meal.price,
        quantity: meal.quantity || 1,
        image_url: meal.image_url || meal.imageUrl,
      };

      // Check if meal already exists and update quantity
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.meal_id === normalizedMeal.meal_id
      );

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + normalizedMeal.quantity,
        };
      } else {
        updatedCart.push(normalizedMeal);
      }

      // Update backend or localStorage
      if (user && user.id) {
        const response = await fetch(`${API_URL}/api/cart/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCart),
        });

        if (!response.ok) {
          throw new Error("Failed to update cart on backend");
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      setCart(updatedCart);
      return { success: true };
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart");
      return { success: false, error: error.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (mealId) => {
    try {
      setError(null);
      const updatedCart = cart.filter((item) => item.meal_id !== mealId);

      if (user && user.id) {
        const response = await fetch(`${API_URL}/api/cart/${user.id}/${mealId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove item from cart");
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      setCart(updatedCart);
      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Failed to remove item from cart");
      return { success: false, error: error.message };
    }
  };

  // Update item quantity
  const updateQuantity = async (mealId, quantity) => {
    try {
      setError(null);
      if (quantity <= 0) {
        return await removeFromCart(mealId);
      }

      const updatedCart = cart.map((item) =>
        item.meal_id === mealId ? { ...item, quantity } : item
      );

      if (user && user.id) {
        const response = await fetch(`${API_URL}/api/cart/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCart),
        });

        if (!response.ok) {
          throw new Error("Failed to update quantity");
        }
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      setCart(updatedCart);
      return { success: true };
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity");
      return { success: false, error: error.message };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setError(null);
      if (user && user.id) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await getIdToken(currentUser);
          const response = await fetch(`${API_URL}/api/clear-cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to clear cart");
          }
        }
      } else {
        localStorage.removeItem("cart");
      }

      setCart([]);
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart");
      return { success: false, error: error.message };
    }
  };

  // Calculate totals
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
