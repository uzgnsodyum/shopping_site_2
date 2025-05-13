"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

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
      // Call the API to update the cart item
      await api.updateCartItem(itemId, { quantity, specialNote });

      // Update the cart state locally
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity, specialNote } : item
        )
      );
    } catch (error) {
      console.error("Error updating item in cart:", error);
    }
  };

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

  const removeFromCart = async (id) => {
    try {
      await api.removeFromCart(id);
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const emptyCart = async () => {
    try {
      await api.emptyCart();
      setCart([]);
    } catch (error) {
      console.error("Error emptying cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalAmount,
        addToCart,
        removeFromCart,
        emptyCart,
        updateCartItem, // Provide the updateCartItem function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
