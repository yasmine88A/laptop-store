import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseService } from '../services/firebaseService';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';

const Auth = ({ user }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Initialize user document in Realtime Database on signup
        await firebaseService.createUserProfile(userCredential.user.uid, {
          cart: [],
          profile: {
            fullName: '',
            phoneNumber: '',
            address: '',
            city: '',
            postalCode: ''
          }
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? 'Sign in to access your account' : 'Sign up for a new account'}
            </Typography>
          </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Email Address" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField 
                label="Password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, py: 1.5 }}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </Box>
          </form>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button 
                variant="text" 
                onClick={() => setIsLogin(!isLogin)}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Auth;
