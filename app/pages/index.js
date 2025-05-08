import { useState, useEffect } from 'react';
import Head from 'next/head';
import CampaignCarousel from '../components/CampaignCarousel';
import SearchSortBar from '../components/SearchSortBar';
import ProductList from '../components/ProductList';
import api from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts(sortField, sortOrder, searchQuery);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortField, sortOrder, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <>
      <Head>
        <title>E-Commerce Shop - Home</title>
      </Head>

      <CampaignCarousel />
      
      <SearchSortBar 
        onSearch={handleSearch} 
        onSort={handleSort} 
      />
      
      <ProductList 
        products={products} 
        loading={loading} 
        error={error} 
      />
    </>
  );
}