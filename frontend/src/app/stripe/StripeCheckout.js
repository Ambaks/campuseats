// lib/stripeCheckout.js
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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
