"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Container, Table, Button, Alert } from "react-bootstrap";

const CartPage = () => {
  const { cart, totalAmount, removeFromCart, emptyCart, updateCartItem } = useCart();

  // Calculate delivery fee
  const deliveryFee = totalAmount < 1000 ? 50 : 0;
  const totalWithDelivery = totalAmount + deliveryFee;

  const [paymentComplete, setPaymentComplete] = useState(false);

  // Handle quantity change
  const handleQuantityChange = (itemId, quantity) => {
    updateCartItem(itemId, parseInt(quantity));
  };

  // Handle the payment process
  const handlePayment = async () => {
    await emptyCart(); // Empty the cart after payment
    setPaymentComplete(true); // Show success message after payment
  };

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>

      {paymentComplete ? (
        <div className="text-center my-5">
          <Alert variant="success" className="mb-4">
            <h4>Payment Successful!</h4>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
          </Alert>
          <Button variant="primary" onClick={() => setPaymentComplete(false)}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          style={{ width: "70px" }}
                        />
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Display Total Price, Delivery Fee, and Total Amount */}
              <div className="d-flex justify-content-between mb-4">
                <h3>Total Price: ${totalAmount.toFixed(2)}</h3>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <h3>Delivery Fee: ${deliveryFee.toFixed(2)}</h3>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <h3>Total Amount: ${totalWithDelivery.toFixed(2)}</h3>
              </div>

              {/* Proceed to Checkout Button */}
              <Button variant="success" onClick={handlePayment}>
                Proceed to Checkout
              </Button>

              {/* Empty Cart Button */}
              <Button variant="warning" onClick={emptyCart} className="mt-2">
                Empty Cart
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default CartPage;
