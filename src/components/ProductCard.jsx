import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';

const ProductCard = ({ product }) => {
  return (
    <Card 
      component={Link} 
      to={`/product/${product.id}`} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%', 
        textDecoration: 'none', 
        color: 'inherit',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          {product.brand}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.specs}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
            ${product.price}
          </Typography>
          <Button variant="outlined" size="small" color="primary">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
