import { useState } from 'react';
import { Card, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';

const ProductReviews = ({ productId, reviews = [], onReviewAdded }) => {
  const [newReview, setNewReview] = useState({
    username: '',
    title: '',
    text: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const addedReview = await api.addReview(productId, newReview);
      
      // Reset form
      setNewReview({
        username: '',
        title: '',
        text: '',
        rating: 5
      });
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded(addedReview);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={fasStar}
        className={i < rating ? 'text-warning' : 'text-muted'}
      />
    ));
  };

  return (
    <div className="my-4">
      <h3 className="mb-4">Customer Reviews</h3>
      
      {reviews.length > 0 ? (
        <ListGroup variant="flush" className="mb-4">
          {reviews.map((review, index) => (
            <ListGroup.Item key={review.id || index} className="border-bottom py-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="mb-0">{review.title}</h5>
                <div>{renderStars(review.rating)}</div>
              </div>
              <p className="text-muted mb-2">By {review.username}</p>
              <p className="mb-0">{review.text}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted mb-4">No reviews yet. Be the first to review this product!</p>
      )}
      
      <Card className="shadow-sm">
        <Card.Header as="h5">Write a Review</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newReview.username}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
              />
            </Form.Group>
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Review Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newReview.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Give your review a title"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating"
                    value={newReview.rating}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Good</option>
                    <option value="3">3 Stars - Average</option>
                    <option value="2">2 Stars - Poor</option>
                    <option value="1">1 Star - Very Poor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                name="text"
                value={newReview.text}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Write your review here..."
              />
            </Form.Group>
            
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductReviews;