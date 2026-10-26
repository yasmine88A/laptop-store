import React, { useState, useEffect } from 'react';
import { jsonService } from '../services/jsonService';
import ProductCard from '../components/ProductCard';
import { Box, Typography, Container, Grid, CircularProgress, Chip } from '@mui/material';
import { Sparkles } from 'lucide-react';

const NewProducts = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jsonService.getArticles()
      .then(data => setLaptops(data.filter(l => l.isNew)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in">
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 60%, #00B0FF 100%)',
        color: 'white', py: { xs: 7, md: 10 }, textAlign: 'center', px: 2,
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: '-30%', right: '-10%', width: '50%', height: '180%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip label="✨ Fresh From the Factory" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, border: '1px solid rgba(255,255,255,0.4)' }} />
          <Typography variant="h3" component="h1" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
            🆕 New Arrivals 2026
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.88, fontWeight: 400, maxWidth: 500, mx: 'auto' }}>
            The latest models from Apple, Samsung, Dell, Razer & more — just landed in our store.
          </Typography>
        </Container>
      </Box>

      {/* Grid */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Sparkles size={24} color="#1565C0" />
          <Typography variant="h5" fontWeight="bold">
            {laptops.length} New Models Available
          </Typography>
        </Box>

        {laptops.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="text.secondary">
              No new products at the moment. Check back soon!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {laptops.map(laptop => (
              <Grid item key={laptop.id} xs={12} sm={6} md={4}>
                <Box sx={{ position: 'relative' }}>
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      position: 'absolute', top: 12, left: 12, zIndex: 2,
                      bgcolor: '#00C853', color: 'white', fontWeight: 800,
                      fontSize: '0.75rem', letterSpacing: 1,
                    }}
                  />
                  <ProductCard product={laptop} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default NewProducts;
