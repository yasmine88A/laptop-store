import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NewProducts from './pages/NewProducts';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseService } from './services/firebaseService';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',       // Deep Blue
      light: '#5E92F3',
      dark: '#003c8f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00B0FF',       // Vivid Sky Blue accent
      light: '#69E2FF',
      dark: '#0081CB',
      contrastText: '#000000',
    },
    background: {
      default: '#F0F4FF',   // Subtle blue-tinted background
      paper: '#ffffff',
    },
    text: {
      primary: '#0D1B3E',
      secondary: '#4A5568',
    },
    success: { main: '#00C853' },
    error:   { main: '#D50000' },
    warning: { main: '#FF6D00' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 20px rgba(21, 101, 192, 0.25)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(21, 101, 192, 0.08)',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(21, 101, 192, 0.18)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0D47A1 0%, #1565C0 60%, #1976D2 100%)',
          boxShadow: '0 2px 20px rgba(13, 71, 161, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
// Wrapper component to handle routing logic inside Router
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data and cart from Realtime DB
        const userData = await firebaseService.getUser(currentUser.uid);
        if (userData && userData.cart) {
          setCart(userData.cart);
        } else {
          setCart([]);
        }
        if (userData && userData.role) {
          setUserRole(userData.role);
        } else {
          setUserRole('user');
        }
      } else {
        setCart([]);
        setUserRole('user');
      }
    });
    return () => unsubscribe();
  }, []);

  const saveCartToDB = async (newCart, uid) => {
    if (!uid) return;
    try {
      await firebaseService.updateCart(uid, newCart);
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      alert("You must be logged in to add items to the cart.");
      navigate('/auth');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      saveCartToDB(newCart, user.uid);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      saveCartToDB([], user.uid);
    }
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Navbar user={user} cartCount={cartItemsCount} userRole={userRole} />
        <main style={{ minHeight: '80vh', padding: '20px 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route path="/auth" element={<Auth user={user} />} />
            <Route path="/cart" element={<Cart cart={cart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/new" element={<NewProducts />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
