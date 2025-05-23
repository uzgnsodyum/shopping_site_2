import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Row, Col, Card, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useCart } from './context/CartContext';

export default function Cart({ campaigns }) {  // Pass campaigns as a prop
  const { cart, totalAmount, updateCartItem, removeFromCart, emptyCart } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [specialNotes, setSpecialNotes] = useState({});
  const [reviews, setReviews] = useState({});  // Track review data
  const [showPaymentMessage, setShowPaymentMessage] = useState(false);  // Track payment success message visibility

  // Calculate delivery fee and total
  const deliveryFee = totalAmount < 1000 ? 50 : 0;
  const totalWithDelivery = totalAmount + deliveryFee;

  // Apply discounts to products in cart
  const applyDiscounts = () => {
    return cart.map(item => {
      // Check if the item is part of any active campaign
      let itemDiscount = item.price;  // Start with the original price

      campaigns.forEach(campaign => {
        if (campaign.products.includes(item.id)) {
          // Apply the discount percentage from the campaign
          itemDiscount = item.price - (item.price * campaign.discountPercentage / 100);
        }
      });

      return {
        ...item,
        discountedPrice: itemDiscount.toFixed(2), // Store the discounted price
      };
    });
  };

  const handleQuantityChange = async (itemId, quantity) => {
    await updateCartItem(itemId, parseInt(quantity), specialNotes[itemId]);
  };

  const handleNoteChange = async (itemId, note) => {
    setSpecialNotes(prev => ({
      ...prev,
      [itemId]: note
    }));
    await updateCartItem(itemId, cart.find(item => item.id === itemId).quantity, note);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleEmptyCart = async () => {
    await emptyCart();
  };

  const handleProceedCheckout = () => {
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    await emptyCart(); // Empty the cart after payment
    setPaymentComplete(true); // Mark payment as complete
    console.log("Payment Complete:", paymentComplete);
    setShowCheckout(false); // Hide the checkout modal
    setSpecialNotes({}); // Clear any special notes
    setShowPaymentMessage(true); // Show the success message
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handleBackToShopping = () => {
    setPaymentComplete(false);
    setShowPaymentMessage(false); // Hide the success message when returning to shopping
  };

  const handleReviewChange = (itemId, field, value) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [itemId]: {
        ...prevReviews[itemId],
        [field]: value,
      }
    }));
  };

  const handleReviewSubmit = (itemId) => {
    const reviewData = reviews[itemId];
    console.log("Review Submitted for Item:", itemId, reviewData);
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - E-Commerce Shop</title>
      </Head>

      <h1 className="mb-4">Shopping Cart</h1>

      {paymentComplete ? (
        <div className="text-center my-5">
          <Alert variant="success" className="mb-4">
            <h4>Payment Successful!</h4>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
          </Alert>
          <Button variant="primary" onClick={handleBackToShopping}>
            Continue Shopping
          </Button>

          {/* Review Section after Proceeding to Checkout */}
          <div className="review-section mt-5">
            <h3>Write Reviews for Your Purchased Items</h3>
            {applyDiscounts().map((item) => (
              <Card key={item.id} className="mb-3">
                <Card.Body>
                  <h5>{item.title}</h5>
                  {/* Rating */}
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon="star"
                        className={star <= reviews[item.id]?.rating ? "star selected" : "star"}
                        onClick={() => handleReviewChange(item.id, "rating", star)}
                      />
                    ))}
                  </div>
                  <Form.Group>
                    <Form.Label>Review Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      value={reviews[item.id]?.title || ""}
                      onChange={(e) =>
                        handleReviewChange(item.id, "title", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write your review"
                      value={reviews[item.id]?.review || ""}
                      onChange={(e) =>
                        handleReviewChange(item.id, "review", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Button
                    onClick={() => handleReviewSubmit(item.id)}
                    className="submit-button mt-2"
                  >
                    Submit Review
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {cart.length === 0 ? (
            <div className="text-center my-5">
              <Alert variant="info" className="mb-4">
                Your shopping cart is empty.
              </Alert>
              <Link href="/" passHref>
                <Button variant="primary">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <Row>
              <Col lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Cart Items ({cart.length})</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive className="align-middle">
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
                        {applyDiscounts().map(item => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                  className="me-3"
                                />
                                <div>
                                  <Link href={`/product/${item.productId}`} passHref>
                                    <span className="fw-bold" style={{ cursor: 'pointer' }}>
                                      {item.title}
                                    </span>
                                  </Link>
                                  <Form.Group className="mt-2">
                                    <Form.Control
                                      as="textarea"
                                      rows={2}
                                      placeholder="Add special note (optional)"
                                      value={item.specialNote || ''}
                                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                      style={{ fontSize: '0.85rem' }}
                                    />
                                  </Form.Group>
                                </div>
                              </div>
                            </td>
                            <td>${item.discountedPrice}</td> {/* Display discounted price */}
                            <td>
                              <Form.Control
                                type="number"
                                min="1"
                                max="99"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                style={{ width: '70px' }}
                              />
                            </td>
                            <td>${(item.discountedPrice * item.quantity).toFixed(2)}</td>
                            <td>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex justify-content-between mt-4">
                      <Button 
                        variant="outline-secondary"
                        onClick={handleEmptyCart}
                      >
                        Empty Cart
                      </Button>
                      <Link href="/" passHref>
                        <Button variant="outline-primary">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-white py-3">
                    <h5 className="mb-0">Order Summary</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Price</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold">Total Amount</span>
                      <span className="fw-bold">${totalWithDelivery.toFixed(2)}</span>
                    </div>
                    <Button 
                      variant="success" 
                      className="w-100"
                      onClick={handleProceedCheckout}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Proceed to Checkout
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
}
