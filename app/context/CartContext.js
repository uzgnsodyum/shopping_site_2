"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [reviews, setReviews] = useState({}); // Track reviews for items in cart

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await api.getCart();
        setCart(Array.isArray(cartData) ? cartData : []);
      } catch (error) {
        setCart([]);
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cart]);

  // Update quantity of a specific cart item
  const updateCartItem = async (itemId, quantity, specialNote) => {
    try {
      await api.updateCartItem(itemId, { quantity, specialNote });
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity, specialNote } : item
        )
      );
    } catch (error) {
      console.error("Error updating item in cart:", error);
    }
  };

  // Add a new product to the cart
  const addToCart = async (product, quantity, specialNote) => {
    try {
      await api.addToCart({ ...product, quantity, specialNote });
      const cartData = await api.getCart();
      setCart(Array.isArray(cartData) ? cartData : []);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (id) => {
    try {
      await api.removeFromCart(id);
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Empty the entire cart
  const emptyCart = async () => {
    try {
      await api.emptyCart();
      setCart([]);
    } catch (error) {
      console.error("Error emptying cart:", error);
    }
  };

  // Update the review for a specific item
  const updateReview = (itemId, reviewData) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [itemId]: reviewData,
    }));
  };

  // Optionally, submit the review data to the backend
  const submitReview = async (itemId, reviewData) => {
    try {
      await api.submitReview(itemId, reviewData);
      console.log(`Review submitted for item ${itemId}`);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalAmount,
        reviews, // Provide reviews state
        addToCart,
        removeFromCart,
        emptyCart,
        updateCartItem,
        updateReview, // Provide review update function
        submitReview, // Provide submit review function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
