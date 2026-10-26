import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Laptop, Search } from 'lucide-react';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, InputBase, Badge, Container } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 4,
  backgroundColor: 'rgba(255,255,255,0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    flexGrow: 1,
    maxWidth: '400px'
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255,255,255,0.7)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    '&::placeholder': { color: 'rgba(255,255,255,0.7)', opacity: 1 },
  },
}));

const Navbar = ({ user, cartCount, userRole }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }} component={Link} to="/">
            <Laptop size={28} style={{ marginRight: '8px' }} />
            <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: '.05rem', color: 'white', textDecoration: 'none' }}>
              TechStore
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Button component={Link} to="/" sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>Home</Button>
            <Button component={Link} to="/products" sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>Laptops</Button>
            <Button
              component={Link}
              to="/new"
              sx={{
                color: '#FFD740',
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                border: '1.5px solid rgba(255,215,64,0.5)',
                borderRadius: 6,
                px: 2,
                ml: 0.5,
              }}
            >
              🆕 New
            </Button>
            {userRole === 'admin' && (
              <Button component={Link} to="/admin" sx={{ color: '#FFD740', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>Admin ⚡</Button>
            )}
          </Box>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              position: 'relative',
              borderRadius: 8,
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              mx: 2,
              flexGrow: 1,
              maxWidth: '380px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box sx={{ px: 1.5, display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>
              <Search size={18} />
            </Box>
            <InputBase
              placeholder="Search laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              sx={{
                color: 'white',
                flexGrow: 1,
                py: 0.75,
                pr: 1.5,
                '& input::placeholder': { color: 'rgba(255,255,255,0.65)', opacity: 1 }
              }}
            />
            <button type="submit" style={{ display: 'none' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Button component={Link} to="/profile" startIcon={<User size={18} />} sx={{ color: 'white', mr: 1, display: { xs: 'none', sm: 'flex' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>
                  Profile
                </Button>
                <Button variant="outlined" onClick={handleLogout} sx={{ mr: 2, display: { xs: 'none', sm: 'flex' }, color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.12)' } }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button component={Link} to="/auth" startIcon={<User size={18} />} sx={{ color: 'white', mr: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>
                Sign In
              </Button>
            )}
            <IconButton component={Link} to="/cart" aria-label="cart" sx={{ color: 'white' }}>
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart size={24} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
