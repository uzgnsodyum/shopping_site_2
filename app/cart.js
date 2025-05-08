import { useState } from 'react';
import Head from 'next/head';
import { Row, Col, Card, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useCart } from './context/CartContext';

export default function Cart() {
  const { cart, totalAmount, updateCartItem, removeFromCart, emptyCart } = useCart();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [specialNotes, setSpecialNotes] = useState({});

  // Calculate delivery fee and total
  const deliveryFee = totalAmount < 1000 ? 50 : 0;
  const totalWithDelivery = totalAmount + deliveryFee;

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
    await emptyCart();
    setPaymentComplete(true);
    setShowCheckout(false);
    setSpecialNotes({});
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handleBackToShopping = () => {
    setPaymentComplete(false);
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
                        {cart.map(item => (
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
                                  <Link href={`/product/${item.productId}`}>
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
                            <td>${item.price.toFixed(2)}</td>
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
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
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
                      <span>Subtotal</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <small className="text-muted mb-3 d-block">
                        Free delivery for orders over $1,000
                      </small>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold">Total</span>
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
          
          {/* Checkout Modal */}
          <Modal show={showCheckout} onHide={handleCloseCheckout} centered>
            <Modal.Header closeButton>
              <Modal.Title>Checkout Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-4">Please review your order details:</p>
              
              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td className="text-end">${totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Delivery Fee:</td>
                    <td className="text-end">${deliveryFee.toFixed(2)}</td>
                  </tr>
                  <tr className="fw-bold">
                    <td>Total Amount:</td>
                    <td className="text-end">${totalWithDelivery.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
              
              <Alert variant="info" className="mt-3">
                This is a simulation. No actual payment will be processed.
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseCheckout}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePayment}>
                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                Complete Payment
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}