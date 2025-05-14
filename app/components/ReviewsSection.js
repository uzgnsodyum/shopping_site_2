// ReviewsSection.js
import { useState } from 'react';  // Make sure to import useState
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewsSection = ({ cart, reviews, onReviewChange, onReviewSubmit }) => {
  const [reviewedItems, setReviewedItems] = useState([]); // Track reviewed items
  const [thankYouMessage, setThankYouMessage] = useState(null); // Track "Thank you" message

  // Handle review submission
  const handleReviewSubmit = (itemId) => {
    onReviewSubmit(itemId); // Call the passed submit function to handle backend operations
    setReviewedItems((prevReviewedItems) => [...prevReviewedItems, itemId]); // Add itemId to reviewed items list
    
    // Show thank you message
    setThankYouMessage(`Thank you for your review of "${reviews[itemId]?.title}"!`);
    
    // Fade out the thank you message after 3 seconds
    setTimeout(() => {
      setThankYouMessage(null);
    }, 3000); // Message will disappear after 3 seconds
  };

  return (
    <div>
      <h3>Write Reviews for Your Purchased Items</h3>

      {/* Display Thank You message if it's set */}
      {thankYouMessage && (
        <Alert variant="success" className="mb-4" fade={true}>
          <p>{thankYouMessage}</p>
        </Alert>
      )}

      {cart
        .filter((item) => !reviewedItems.includes(item.id)) // Only show items that haven't been reviewed
        .map((item) => {
          const reviewData = reviews[item.id] || {};
          const isReviewComplete =
            reviewData.rating && reviewData.title && reviewData.review; // Check if all fields are filled

          return (
            <Card key={item.id} className="mb-3">
              <Card.Body>
                <h5>{item.title}</h5>
                {/* Rating */}
                <div>
                  <span>Rate this product:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      style={{
                        color: star <= reviewData.rating ? "gold" : "gray",
                      }}
                      onClick={() => onReviewChange(item.id, "rating", star)}
                    />
                  ))}
                </div>
                <Form.Group>
                  <Form.Label>Review Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={reviewData.title || ""}
                    onChange={(e) =>
                      onReviewChange(item.id, "title", e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your review"
                    value={reviewData.review || ""}
                    onChange={(e) =>
                      onReviewChange(item.id, "review", e.target.value)
                    }
                  />
                </Form.Group>
                {/* Only enable the button when all fields are filled */}
                <Button
                  onClick={() => handleReviewSubmit(item.id)} // Submit the review and hide the item
                  className="mt-2"
                  disabled={!isReviewComplete} // Button disabled if the review is incomplete
                >
                  Submit Review
                </Button>
              </Card.Body>
            </Card>
          );
        })}
    </div>
  );
};

export default ReviewsSection;
