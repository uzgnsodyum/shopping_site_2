import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = {
  // Products
  getProducts: async (sortBy = '', order = '', query = '') => {
    let url = `${API_URL}/products?`;
    
    if (sortBy && order) {
      url += `_sort=${sortBy}&_order=${order}&`;
    }
    
    if (query) {
      url += `q=${query}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },
  
  // Campaigns
  getCampaigns: async () => {
    const response = await axios.get(`${API_URL}/campaigns`);
    return response.data;
  },
  
  addCampaign: async (campaign) => {
    const response = await axios.post(`${API_URL}/campaigns`, campaign);
    return response.data;
  },

  getCampaignProducts: async () => {
    const campaigns = await api.getCampaigns();
    const productIds = campaigns.flatMap(campaign => campaign.products);
    const uniqueProductIds = [...new Set(productIds)];
    
    const productsPromises = uniqueProductIds.map(id => api.getProduct(id));
    return Promise.all(productsPromises);
  },
  
  // Shopping Cart
  getCart: async () => {
    const response = await axios.get(`${API_URL}/cart`);
    return response.data;
  },
  
  addToCart: async (product) => {
    const cart = await api.getCart();
    const existingItem = cart.find(item => item.productId === product.productId);
    
    if (existingItem) {
      existingItem.quantity += product.quantity;
      await axios.put(`${API_URL}/cart/${existingItem.id}`, existingItem);
      return existingItem;
    } else {
      const response = await axios.post(`${API_URL}/cart`, product);
      return response.data;
    }
  },
  
  updateCartItem: async (id, quantity, specialNote) => {
    const item = await axios.get(`${API_URL}/cart/${id}`);
    const updatedItem = {
      ...item.data,
      quantity,
      specialNote: specialNote || item.data.specialNote
    };
    
    const response = await axios.put(`${API_URL}/cart/${id}`, updatedItem);
    return response.data;
  },
  
  removeFromCart: async (id) => {
    await axios.delete(`${API_URL}/cart/${id}`);
    return id;
  },
  
  emptyCart: async () => {
    const cart = await api.getCart();
    const deletePromises = cart.map(item => axios.delete(`${API_URL}/cart/${item.id}`));
    await Promise.all(deletePromises);
    return [];
  },
  
  // Reviews
  addReview: async (productId, review) => {
    const product = await api.getProduct(productId);
    
    if (!product.reviews) {
      product.reviews = [];
    }
    
    const newReview = {
      id: product.reviews.length + 1,
      ...review
    };
    
    product.reviews.push(newReview);
    
    // Update the average rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
    
    await axios.put(`${API_URL}/products/${productId}`, product);
    return newReview;
  }
};

export default api;