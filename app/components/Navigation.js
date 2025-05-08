import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  const { cart, totalAmount } = useCart();
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    // Calculate the total number of items in cart
    const count = Array.isArray(cart)
      ? cart.reduce((acc, item) => acc + (item.quantity || 0), 0)
      : 0;
    setCartCount(count);
  }, [cart]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 w-100">
      <div className="container-fluid">
        <Navbar.Brand as={Link} href="/">Shopping Site</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <Nav.Link as={Link} href="/cart">Cart</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;