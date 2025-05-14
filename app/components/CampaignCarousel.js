import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import api from '../services/api'; // Ensure this is the correct path for your API service

const CampaignCarousel = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.get('/campaigns');  // Fetch campaigns data from the server
        console.log(data); // Log the response to verify the data
        setCampaigns(data);  // Store the campaigns data
        setLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);  // Set loading to false even in case of an error
      }
    };

    fetchCampaigns();
  }, []);

  // Show loading message while data is being fetched
  if (loading) {
    return <div className="text-center my-5">Loading campaigns...</div>;
  }

  // If no campaigns are available
  if (campaigns.length === 0) {
    return <div className="text-center my-5">No campaigns available</div>;
  }

  return (
    <Carousel className="mb-4">
      {campaigns.map((campaign) => (
        <Carousel.Item key={campaign.id}>
          <img
            className="d-block w-100"
            src={campaign.imageUrl || "https://placehold.co/1200x400?text=Default+Image"} // Fallback image if imageUrl is not provided
            alt={campaign.title}
            style={{ height: '400px', objectFit: 'cover' }} // Ensures the image fits within the carousel
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
            <h3>{campaign.title}</h3>  {/* Display Campaign Title */}
            <p>{campaign.description}</p>  {/* Display Campaign Description */}
            <p className="h4 text-warning">
              {campaign.discountPercentage}% OFF  {/* Display Discount Percentage */}
            </p>
            <p className="text-white-50">
              Valid from {new Date(campaign.startDate).toLocaleDateString()} to {new Date(campaign.endDate).toLocaleDateString()}  {/* Display valid date range */}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CampaignCarousel;
