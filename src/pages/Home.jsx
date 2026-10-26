import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { jsonService } from '../services/jsonService';
import { ArrowRight, Zap, Tag, Star, TrendingUp } from 'lucide-react';
import {
  Box, Typography, Button, Container, Grid, CircularProgress,
  Chip, Paper, IconButton
} from '@mui/material';

/* ─── Animated promo banner ─── */
const banners = [
  {
    bg: 'linear-gradient(120deg, #0D47A1 0%, #1565C0 60%, #00B0FF 100%)',
    badge: '🔥 HOT DEAL',
    title: 'Up to 20% OFF Gaming Laptops',
    sub: 'Limited time offer — don\'t miss out on RTX 4080 & 4090 models',
    cta: 'Shop Gaming',
    link: '/products',
    badgeColor: '#FF6D00',
  },
  {
    bg: 'linear-gradient(120deg, #1B5E20 0%, #2E7D32 60%, #00C853 100%)',
    badge: '🆕 JUST ARRIVED',
    title: 'New 2026 Models Are Here',
    sub: 'MacBook Pro M3, Samsung Galaxy Book4, Dell XPS 13 Plus & more',
    cta: 'See New Arrivals',
    link: '/new',
    badgeColor: '#FFD740',
  },
  {
    bg: 'linear-gradient(120deg, #4A148C 0%, #6A1B9A 60%, #AB47BC 100%)',
    badge: '⚡ FLASH SALE',
    title: 'Dell XPS 15 — 10% OFF Today Only',
    sub: 'Intel i9, 32GB RAM, RTX 4070 — Professional powerhouse at a discount',
    cta: 'Grab the Deal',
    link: '/products',
    badgeColor: '#69E2FF',
  },
];

const PromoBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const b = banners[current];

  return (
    <Box sx={{
      background: b.bg,
      color: 'white',
      py: { xs: 3, md: 3.5 },
      px: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
      transition: 'background 0.8s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background shine */}
      <Box sx={{
        position: 'absolute', top: '-50%', right: '-5%',
        width: '40%', height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          label={b.badge}
          size="small"
          sx={{ bgcolor: b.badgeColor, color: '#0D1B3E', fontWeight: 800, fontSize: '0.75rem' }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{b.title}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>{b.sub}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to={b.link}
          variant="contained"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1.5px solid rgba(255,255,255,0.5)',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' },
            whiteSpace: 'nowrap',
          }}
          endIcon={<ArrowRight size={16} />}
        >
          {b.cta}
        </Button>
        {/* Dots */}
        <Box sx={{ display: 'flex', gap: 0.7 }}>
          {banners.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrent(i)}
              sx={{
                width: i === current ? 20 : 8, height: 8,
                borderRadius: 4,
                bgcolor: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ─── Feature strip ─── */
const features = [
  { icon: <Zap size={20} />, label: 'Fast Delivery', sub: '2–5 business days' },
  { icon: <Tag size={20} />, label: 'Best Price', sub: 'Price match guarantee' },
  { icon: <Star size={20} />, label: '5-Star Support', sub: '24/7 expert help' },
  { icon: <TrendingUp size={20} />, label: 'Trade-In', sub: 'Up to $500 credit' },
];

/* ─── Main Home Page ─── */
const Home = () => {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jsonService.getArticles()
      .then(data => setLaptops(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featuredLaptops = laptops.filter(l => l.featured).slice(0, 6);
  const brands = [...new Set(laptops.map(l => l.brand))];
  const onSale = laptops.filter(l => l.discount > 0).slice(0, 3);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in">

      {/* ── Promo strip ── */}
      <PromoBanner />

      {/* ── Hero ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)',
        color: 'white',
        py: { xs: 10, md: 15 },
        textAlign: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute', top: '-30%', left: '-10%',
          width: '60%', height: '160%',
          background: 'radial-gradient(circle, rgba(0,176,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute', bottom: '-30%', right: '-5%',
          width: '50%', height: '140%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip label="✨ 2026 Collection Now Available" sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.3)' }} />
          <Typography variant="h2" component="h1" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.03em', textShadow: '0 2px 24px rgba(0,0,0,0.2)' }}>
            The Future of Computing
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.88, fontWeight: 400, maxWidth: 550, mx: 'auto' }}>
            Discover our curated selection of premium laptops — from ultra-thin ultrabooks to powerhouse gaming rigs.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link} to="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} />}
              sx={{ px: 5, py: 1.75, fontSize: '1.05rem', borderRadius: 3, bgcolor: 'white', color: '#0D47A1', fontWeight: 700, '&:hover': { bgcolor: '#e3f2fd' } }}
            >
              Shop All Laptops
            </Button>
            <Button
              component={Link} to="/new"
              variant="outlined"
              size="large"
              sx={{ px: 5, py: 1.75, fontSize: '1.05rem', borderRadius: 3, color: 'white', borderColor: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.12)' } }}
            >
              🆕 New Arrivals
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Feature Strip ── */}
      <Box sx={{ bgcolor: '#0D47A1', py: 2.5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {features.map((f, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'white', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Box sx={{ color: '#00B0FF' }}>{f.icon}</Box>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{f.label}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>{f.sub}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Deals Section ── */}
      {onSale.length > 0 && (
        <Box sx={{ bgcolor: '#FFF8E1', py: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Tag size={26} color="#FF6D00" />
                <Typography variant="h5" fontWeight="bold" color="#E65100">Special Offers 🔥</Typography>
              </Box>
              <Button component={Link} to="/products" variant="text" color="warning" endIcon={<ArrowRight size={16} />} sx={{ fontWeight: 700 }}>
                View All Deals
              </Button>
            </Box>
            <Grid container spacing={3}>
              {onSale.map(laptop => (
                <Grid item key={laptop.id} xs={12} sm={6} md={4}>
                  <Box sx={{ position: 'relative' }}>
                    <Chip
                      label={`-${laptop.discount}% OFF`}
                      size="small"
                      sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, bgcolor: '#FF6D00', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}
                    />
                    <ProductCard product={laptop} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* ── Shop by Brand ── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
          Shop by Brand
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
          Find your perfect laptop from the world's leading manufacturers
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          {brands.map(brand => (
            <Button
              key={brand}
              onClick={() => navigate('/products')}
              variant="outlined"
              sx={{
                px: 3, py: 1.2, fontSize: '1rem', fontWeight: 600,
                borderRadius: 10,
                borderColor: 'primary.light',
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 14px rgba(21,101,192,0.25)' },
                transition: 'all 0.2s ease'
              }}
            >
              {brand}
            </Button>
          ))}
        </Box>
      </Container>

      {/* ── Featured Laptops ── */}
      <Box sx={{ bgcolor: '#F0F4FF', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold"> Recommended Laptops</Typography>
              <Typography color="text.secondary">Hand-picked by our experts for best performance & value</Typography>
            </Box>
            <Button component={Link} to="/products" variant="outlined" color="primary" endIcon={<ArrowRight size={16} />} sx={{ fontWeight: 700, borderRadius: 3 }}>
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {featuredLaptops.map(laptop => (
              <Grid item key={laptop.id} xs={12} sm={6} md={4}>
                <ProductCard product={laptop} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Newsletter banner ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)',
        py: 7, textAlign: 'center', px: 2, color: 'white'
      }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Stay in the Loop 📬</Typography>
        <Typography sx={{ opacity: 0.88, mb: 4 }}>
          Get notified about new arrivals, exclusive deals, and tech news.
        </Typography>
        <Button
          component={Link} to="/auth"
          variant="contained"
          size="large"
          sx={{ bgcolor: 'white', color: '#0D47A1', fontWeight: 700, px: 5, py: 1.75, borderRadius: 3, '&:hover': { bgcolor: '#e3f2fd' } }}
        >
          Create Free Account
        </Button>
      </Box>

    </Box>
  );
};

export default Home;
