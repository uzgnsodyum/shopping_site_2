import { useState } from 'react';
import Head from 'next/head';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import api from '../services/api';

export default function AddCampaign() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    discountPercentage: 0,
    products: []
  });
  
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch products when component mounts
  useState(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await api.getProducts();
        setAvailableProducts(products);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProductSelection = (e) => {
    const productId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setFormData({
        ...formData,
        products: [...formData.products, productId]
      });
    } else {
      setFormData({
        ...formData,
        products: formData.products.filter(id => id !== productId)
      });
    }
  };

  const handleDiscountChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100);
    setFormData({
      ...formData,
      discountPercentage: value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.imageUrl.trim()) return 'Image URL is required';
    if (!formData.startDate) return 'Start date is required';
    if (!formData.endDate) return 'End date is required';
    if (new Date(formData.startDate) > new Date(formData.endDate)) return 'End date must be after start date';
    if (formData.discountPercentage <= 0) return 'Discount must be greater than 0%';
    if (formData.products.length === 0) return 'You must select at least one product';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSubmitting(true);
    
    try {
      await api.addCampaign(formData);
      setSuccess(true);
      setError(null);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
        discountPercentage: 0,
        products: []
      });
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (err) {
      setError('Failed to create campaign. Please try again.');
      console.error('Error creating campaign:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Campaign - E-Commerce Shop</title>
      </Head>
      
      <div className="mb-5">
        <h1 className="mb-4">Create New Campaign</h1>
        
        {success && (
          <Alert variant="success" className="mb-4">
            Campaign created successfully! Redirecting to homepage...
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Card className="shadow-sm">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Campaign Title*</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Summer Sale, Flash Deal, etc."
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Percentage*</Form.Label>
                    <Form.Control
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleDiscountChange}
                      min="1"
                      max="100"
                      required
                    />
                    <Form.Text className="text-muted">
                      Enter a value between 1-100%
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description*</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the campaign"
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Banner Image URL*</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <Form.Text className="text-muted">
                  Recommended size: 1200x400 pixels
                </Form.Text>
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date*</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date*</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-4">
                <Form.Label>Select Products for Campaign*</Form.Label>
                {loading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {availableProducts.map(product => (
                      <Form.Check
                        key={product.id}
                        type="checkbox"
                        id={`product-${product.id}`}
                        label={`${product.title} - $${product.price.toFixed(2)}`}
                        value={product.id}
                        checked={formData.products.includes(product.id)}
                        onChange={handleProductSelection}
                        className="mb-2"
                      />
                    ))}
                  </div>
                )}
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  className="me-2"
                  onClick={() => router.push('/')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}