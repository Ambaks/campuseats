// lib/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RQalzQwjXEGfz0j733YmmaleAV0PbLbAuGvu1kmJaZe5Wi71zLPQ4iB6C2yO5snIK0HRTsCc61vCnJljYJsKCkz00UANoJW7L");

/**
 * Redirects the user to Stripe Checkout.
 * @param {string} sessionId - The Checkout Session ID from your backend.
 */
export const redirectToStripeCheckout = async (sessionId) => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error("Stripe failed to load.");
  }
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    throw error;
  }
};
