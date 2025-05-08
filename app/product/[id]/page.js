"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import { Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';


export default function ProductDetail() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await api.getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (quantity < 1) return;
    const success = await addToCart({ ...product, productId: product.id }, quantity, specialNote);
    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleReviewAdded = (newReview) => {
    // Update the product's reviews and rating
    setProduct(prevProduct => ({
      ...prevProduct,
      reviews: [...(prevProduct.reviews || []), newReview],
      // The API already updated the rating for us
    }));
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        Error loading product: {error.message}
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert variant="warning" className="my-4">
        Product not found.
      </Alert>
    );
  }

  return (
    <>
      <Head>
        <title>{product.title} - E-Commerce Shop</title>
      </Head>

      <div className="mb-5">
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Img
                variant="top"
                src={product.thumbnail || product.image || product.imageUrl}
                alt={product.title}
                className="img-fluid"
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </Card>
          </Col>

          <Col lg={6}>
            <h1 className="mb-3">{product.title}</h1>

            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < Math.round(product.rating) ? 'me-1' : 'me-1 text-muted'}
                  />
                ))}
              </div>
              <span className="text-muted">({product.rating} rating)</span>
            </div>

            <h2 className="text-primary mb-4">${product.price.toFixed(2)}</h2>

            <p className="mb-4">{product.description}</p>

            {addedToCart && (
              <Alert variant="success" className="mb-4">
                Product added to cart successfully!
              </Alert>
            )}

            <Form className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{ width: '100px' }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Special Instructions (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any special instructions (e.g., gift wrapping)"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={quantity < 1}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Add to Cart
                </Button>

                <Link href="/cart" passHref>
                  <Button variant="outline-primary" size="lg">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                    Go to Cart
                  </Button>
                </Link>
              </div>
              {product.reviews && product.reviews.length > 0 && (
                <div className="mt-5">
                  <h4>Reviews</h4>
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="mb-3 p-3 border rounded bg-light">
                      <strong>{review.author || "Anonymous"}</strong>
                      <div className="text-warning mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={i < Math.round(review.rating) ? 'me-1' : 'me-1 text-muted'}
                          />
                        ))}
                      </div>
                      <div>{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}
            </Form>
          </Col>
        </Row>


      </div>
    </>
  );
}