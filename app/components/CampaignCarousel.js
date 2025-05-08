import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import api from '../services/api';

const CampaignCarousel = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.getCampaigns();
        setCampaigns(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="text-center my-5">No campaigns available</div>;
  }

  return (
    <Carousel className="mb-4">
      {campaigns.map(campaign => (
        <Carousel.Item key={campaign.id}>
          <img
            className="d-block w-100"
            src={campaign.imageUrl}
            alt={campaign.title}
            style={{ height: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p className="h4 text-warning">
              {campaign.discountPercentage}% OFF
            </p>
            <p className="text-white-50">
              Valid until {new Date(campaign.endDate).toLocaleDateString()}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CampaignCarousel;