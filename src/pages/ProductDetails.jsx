import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jsonService } from '../services/jsonService';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import { Box, Typography, Button, Container, Grid, CircularProgress, IconButton, Paper, Divider } from '@mui/material';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await jsonService.getArticleById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!product || Object.keys(product).length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Product not found</Typography>
        <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>Back to Products</Button>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <Container maxWidth="lg" className="animate-fade-in" sx={{ py: 4 }}>
      <Button 
        onClick={() => navigate(-1)} 
        startIcon={<ArrowLeft size={20} />}
        variant="text"
        sx={{ mb: 4, color: 'text.secondary' }}
      >
        Back
      </Button>

      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', maxWidth: '500px', objectFit: 'contain' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>
            {product.brand}
          </Typography>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
            {product.name}
          </Typography>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            ${product.price}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Specifications</Typography>
            <Typography variant="body1" color="text.secondary">
              {product.specs}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Description</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {product.description}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}>
              <IconButton onClick={decreaseQuantity} color="primary">
                <Typography variant="h6" sx={{ px: 1 }}>-</Typography>
              </IconButton>
              <Typography variant="h6" sx={{ px: 2, minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton onClick={increaseQuantity} color="primary">
                <Typography variant="h6" sx={{ px: 1 }}>+</Typography>
              </IconButton>
            </Box>

            <Button 
              onClick={handleAddToCart} 
              variant={added ? "outlined" : "contained"}
              color={added ? "success" : "primary"}
              size="large"
              disabled={added}
              startIcon={added ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
              sx={{ flexGrow: 1, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
            >
              {added ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
