import { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    await addToCart({ ...product, productId: product.id }, quantity);
    setQuantity(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Check if product is on sale (part of a campaign)
  const isOnSale = false; // You can implement logic to check if product is part of a campaign

  return (
    <Card className="h-100 shadow-sm">
      <Link href={`/product/${product.id}`} passHref>
        <Card.Img
          variant="top"
          src={product.thumbnail || product.image || product.imageUrl}
          alt={product.title}
          style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="text-warning">
            <FontAwesomeIcon icon={faStar} /> {product.rating}
          </div>
          {isOnSale && (
            <span className="badge bg-danger">Sale</span>
          )}
        </div>

        <Link href={`/product/${product.id}`} passHref>
          <Card.Title
            style={{ cursor: 'pointer', minHeight: '50px' }}
            className="fs-5"
          >
            {product.title}
          </Card.Title>
        </Link>

        <Card.Text className="text-muted mb-2">
          {product.category}
        </Card.Text>

        <Card.Text className="mb-4 text-truncate">
          {product.description}
        </Card.Text>

        <div className="mt-auto">
          <Row className="align-items-center">
            <Col>
              <span className="h5 mb-0">${product.price.toFixed(2)}</span>
            </Col>
            <Col xs="auto">
              <Form.Control
                as="select"
                size="sm"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="mb-2"
                style={{ width: '60px' }}
              >
                {[...Array(10).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>

          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          {added && (
            <Alert variant="success" className="mt-2 py-1 px-2">
              Added to cart!
            </Alert>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;