"use client";


import { useState, useEffect } from "react";
import axios from "axios";
import { Carousel, Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "./context/CartContext";
import { memo } from 'react';
import ProductCard from './components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const { addToCart } = useCart();
  const MemoProductCard = memo(ProductCard);

  // Fetch products and campaigns from the JSON server
  useEffect(() => {
    const fetchData = async () => {
      const productsResponse = await axios.get("http://localhost:3001/products");
      const campaignsResponse = await axios.get("http://localhost:3001/campaigns");
      setProducts(productsResponse.data);
      setCampaigns(campaignsResponse.data);
    };
    fetchData();
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle sort
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "title-asc") return a.title.localeCompare(b.title);
      if (sortOption === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div>
      <Container>
        {/* Campaign Carousel */}
        <Carousel className="mb-4">
          {campaigns.map((campaign) => (
            <Carousel.Item key={campaign.id}>
              <img
                className="d-block w-100"
                src={campaign.imageUrl}
                alt={campaign.title}
                style={{ height: "400px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Search and Sort Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-50"
          />
          <Form.Select
            value={sortOption}
            onChange={handleSort}
            className="w-25"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
            <option value="title-desc">Title: Z to A</option>
          </Form.Select>
        </div>

        {/* Product List */}
        <Row className="g-4">
          {filteredProducts.map((product) => (
            <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
              <MemoProductCard product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}