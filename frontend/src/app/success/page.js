"use client";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function SuccessPage() {
    const { user: contextUser } = useAuth(); 

    useEffect(() => {
        async function clearCart() {
            let effectiveUser = contextUser;

            // Fallback to localStorage only if context is empty
            if (!effectiveUser) {
                try {
                    effectiveUser = JSON.parse(localStorage.getItem("user"));
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }

            if (effectiveUser && effectiveUser.token) {
                // User is logged in → Clear cart on backend
                try {
                    await fetch("http://localhost:8000/api/clear-cart", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${effectiveUser.token}`,
                        },
                    });
                    console.log("Cart cleared on backend.");
                } catch (error) {
                    console.error("Failed to clear cart on backend:", error);
                }
            } else {
                // Not logged in → Clear cart from localStorage
                localStorage.removeItem("cart");
                console.log("Cart cleared from localStorage.");
            }
        }

        clearCart();
    }, [contextUser]); // Run again if user loads later

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Success!</h1>
            <p style={styles.message}>Thank you for your order.</p>
            <p style={styles.instruction}>
                To view your orders, go to the <strong>Profile</strong> section of your app.
            </p>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
    },
    heading: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    message: {
        fontSize: "1.2rem",
        marginBottom: "5px",
    },
    instruction: {
        fontSize: "1rem",
        color: "#555",
    },
};
