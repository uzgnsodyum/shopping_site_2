import { Row, Col, Alert } from 'react-bootstrap';
import ProductCard from './ProductCard';


const ProductList = ({ products }) => (
  <Row className="g-4">
    {products.map(product => (
      <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
        <ProductCard product={product} />
      </Col>
    ))}
  </Row>
);

export default ProductList;