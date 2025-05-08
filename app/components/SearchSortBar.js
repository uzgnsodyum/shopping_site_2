import { useState } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort } from '@fortawesome/free-solid-svg-icons';

const SearchSortBar = ({ onSearch, onSort }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
    
    if (value === 'price-asc') {
      onSort('price', 'asc');
    } else if (value === 'price-desc') {
      onSort('price', 'desc');
    } else if (value === 'title-asc') {
      onSort('title', 'asc');
    } else if (value === 'title-desc') {
      onSort('title', 'desc');
    } else if (value === 'rating-desc') {
      onSort('rating', 'desc');
    } else {
      // Default or reset
      onSort('', '');
    }
  };

  return (
    <Row className="mb-4">
      <Col md={8}>
        <Form onSubmit={handleSearch}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faSearch} /> Search
            </Button>
          </InputGroup>
        </Form>
      </Col>
      
      <Col md={4}>
        <InputGroup>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSort} />
          </InputGroup.Text>
          <Form.Select 
            value={sortOption}
            onChange={handleSortChange}
            aria-label="Sort products"
          >
            <option value="">Sort by...</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Name: A to Z</option>
            <option value="title-desc">Name: Z to A</option>
            <option value="rating-desc">Rating: Highest First</option>
          </Form.Select>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default SearchSortBar;