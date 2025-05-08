// filepath: /Users/ulasbaran/courses/cs391/shopping_site_2/app/pages/cart/page.js
"use client";

import { useCart } from "../context/CartContext";
import { Container, Table, Button } from "react-bootstrap";

const CartPage = () => {
  const { cart, totalAmount, removeFromCart, emptyCart } = useCart();

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>
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
                  <td>{item.quantity}</td>
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
          <h3>Total: ${totalAmount.toFixed(2)}</h3>
          <Button variant="warning" onClick={emptyCart}>
            Empty Cart
          </Button>
        </>
      )}
    </Container>
  );
};

export default CartPage;