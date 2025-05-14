import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import api from '../services/api';  // Make sure this is the correct path for your API service

const CampaignCarousel = () => {
  const [campaigns, setCampaigns] = useState([]);  // State to store campaigns data
  const [loading, setLoading] = useState(true);  // State to handle loading

  // Fetching campaigns data when the component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');  // API request to fetch campaign data
        console.log(response.data);  // Log the response data to check if it's correct
        setCampaigns(response.data);  // Set the fetched campaigns data
        setLoading(false);  // Update loading state to false after data is fetched
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);  // Ensure loading state is false even on error
      }
    };

    fetchCampaigns();  // Call the fetchCampaigns function
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  // Loading message while waiting for campaign data to load
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
            src={campaign.imageUrl || "https://placehold.co/1200x400?text=Default+Image"} // Default image if no campaign image URL
            alt={campaign.title}
            style={{ height: '400px', objectFit: 'cover' }}  // Ensures images fit within carousel without distortion
          />
          <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
            <h3>{campaign.title}</h3>  {/* Display campaign title */}
            <p>{campaign.description}</p>  {/* Display campaign description */}
            <p className="h4 text-warning">
              {campaign.discountPercentage}% OFF  {/* Display discount percentage */}
            </p>
            <p className="text-white-50">
              Valid from {new Date(campaign.startDate).toLocaleDateString()} to {new Date(campaign.endDate).toLocaleDateString()}  {/* Display campaign start and end dates */}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CampaignCarousel;
