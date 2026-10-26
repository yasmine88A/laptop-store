import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import {
  Box, Typography, Button, Container, Grid, Paper, Divider,
  List, ListItem, ListItemAvatar, Avatar, ListItemText
} from '@mui/material';

const Cart = ({ cart }) => {
  const totalHT = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tva = totalHT * 0.20;
  const totalTTC = totalHT + tva;

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" className="animate-fade-in" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingBag size={80} style={{ color: '#9e9e9e', margin: '0 auto 24px' }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">Your cart is empty</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button component={Link} to="/products" variant="contained" size="large">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="animate-fade-in" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <List disablePadding>
              {cart.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ py: 2.5, px: 3 }}>
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 90, height: 70, objectFit: 'contain', bgcolor: '#f5f5f5', border: '1px solid', borderColor: 'divider' }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                            {item.brand}
                          </Typography>
                          <br />
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                        </>
                      }
                    />
                    <Typography variant="h6" fontWeight="bold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </ListItem>
                  {index < cart.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, position: 'sticky', top: '90px' }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2.5 }}>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Subtotal HT</Typography>
              <Typography>${totalHT.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">TVA (20%)</Typography>
              <Typography>${tva.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Total TTC</Typography>
              <Typography variant="h6" fontWeight="bold">${totalTTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>

            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              endIcon={<ArrowRight size={20} />}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
