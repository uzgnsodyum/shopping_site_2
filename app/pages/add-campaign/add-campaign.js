import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useRouter } from 'next/router';

const AddCampaignPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !discount) {
      setMessage('Please fill all the fields.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('discountPercentage', discount);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await api.post('/campaigns', formData); // Add campaign
      if (response.status === 201) {
        setMessage('Campaign added successfully!');
        router.push('/campaigns'); // Redirect after adding the campaign
      }
    } catch (error) {
      setMessage('Error creating campaign.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>Add New Campaign</h1>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCampaignTitle">
          <Form.Label>Campaign Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter campaign title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCampaignDescription">
          <Form.Label>Campaign Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter campaign description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCampaignDiscount">
          <Form.Label>Discount Percentage</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter discount percentage"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCampaignImage">
          <Form.Label>Campaign Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Campaign'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddCampaignPage;
