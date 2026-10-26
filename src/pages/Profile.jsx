import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { firebaseService } from '../services/firebaseService';
import { User, Save } from 'lucide-react';
import {
  Box, Typography, Button, Container, Paper, TextField, Grid,
  Divider, Alert, CircularProgress
} from '@mui/material';

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userData = await firebaseService.getUser(user.uid);
        if (userData && userData.profile) {
          setFormData(userData.profile);
        }
        if (userData && userData.role) {
          setUserRole(userData.role);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    try {
      const { ref, update } = await import('firebase/database');
      const { db } = await import('../firebase/firebase');
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { profile: formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className="animate-fade-in" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <User size={32} />
        <Typography variant="h3" component="h1" fontWeight="bold">My Account</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Account Info Card */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Account Information</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <Typography color="text.secondary">Email: <strong>{user?.email}</strong></Typography>
              <Box sx={{
                px: 1.5, py: 0.5, borderRadius: 10,
                bgcolor: userRole === 'admin' ? 'error.light' : 'success.light',
                color: userRole === 'admin' ? 'error.dark' : 'success.dark',
                fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
              }}>
                {userRole}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {success && <Alert severity="success" sx={{ mb: 3 }}>Profile saved successfully!</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    fullWidth
                    placeholder="John Doe"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    placeholder="+1 234 567 890"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Shipping Address</Typography>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    placeholder="123 Tech Lane"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    placeholder="San Francisco"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    fullWidth
                    placeholder="94105"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                    sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
