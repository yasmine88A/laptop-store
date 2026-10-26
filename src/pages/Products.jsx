import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { jsonService } from '../services/jsonService';
import { Box, Typography, Button, Grid, Container, CircularProgress } from '@mui/material';

const Products = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const data = await jsonService.getArticles();
        setLaptops(data);
      } catch (error) {
        console.error("Error fetching laptops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaptops();
  }, []);
  
  // Extract unique brands
  const brands = ['All', ...new Set(laptops.map(laptop => laptop.brand))];
  
  // Filter by search query AND brand
  const filteredLaptops = laptops.filter(laptop => {
    const matchesBrand = selectedBrand === 'All' || laptop.brand === selectedBrand;
    const matchesSearch = !searchQuery || 
      laptop.name.toLowerCase().includes(searchQuery) || 
      laptop.brand.toLowerCase().includes(searchQuery) ||
      laptop.specs.toLowerCase().includes(searchQuery);
      
    return matchesBrand && matchesSearch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="animate-fade-in">
      <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Laptops'}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 4 }}>
        {brands.map(brand => (
          <Button 
            key={brand}
            variant={selectedBrand === brand ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setSelectedBrand(brand)}
            sx={{ borderRadius: 8, textTransform: 'none', px: 3 }}
          >
            {brand}
          </Button>
        ))}
      </Box>

      <Grid container spacing={4}>
        {filteredLaptops.map(laptop => (
          <Grid item key={laptop.id} xs={12} sm={6} md={4}>
            <ProductCard product={laptop} />
          </Grid>
        ))}
      </Grid>
      
      {filteredLaptops.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No laptops match your search criteria.' : 'No laptops found for this brand.'}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Products;
