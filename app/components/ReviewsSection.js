// ReviewsSection.js
import { Card, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewsSection = ({ cart, reviews, onReviewChange, onReviewSubmit }) => (
  <div>
    <h3>Write Reviews for Your Purchased Items</h3>
    {cart.map((item) => (
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
                  color: star <= reviews[item.id]?.rating ? "gold" : "gray",
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
              value={reviews[item.id]?.title || ""}
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
              value={reviews[item.id]?.review || ""}
              onChange={(e) =>
                onReviewChange(item.id, "review", e.target.value)
              }
            />
          </Form.Group>
          <Button onClick={() => onReviewSubmit(item.id)} className="mt-2">
            Submit Review
          </Button>
        </Card.Body>
      </Card>
    ))}
  </div>
);

export default ReviewsSection;
