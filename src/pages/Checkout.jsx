import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';
import { auth } from '../firebase/firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Box, Typography, Button, Container, Paper, TextField,
  Grid, Divider, Alert, Chip
} from '@mui/material';

const generateInvoicePDF = (cart, totalHT, tva, totalTTC, formValues, invoiceId) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TechStore', 14, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('123 Tech Avenue, Silicon Valley, CA 94025', 14, 28);
  doc.text('contact@techstore.com', 14, 34);
  doc.setTextColor(0);

  // Invoice info
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 160, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${invoiceId}`, 160, 28);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 34);
  doc.text(`Status: En attente`, 160, 40);

  // Client info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(formValues.fullName || 'N/A', 14, 62);
  doc.text(formValues.address || 'N/A', 14, 68);
  doc.text(`${formValues.city || ''} ${formValues.postalCode || ''}`, 14, 74);
  doc.text(formValues.email || '', 14, 80);

  // Articles table
  autoTable(doc, {
    startY: 90,
    head: [['#', 'Product', 'Brand', 'Qty', 'Unit Price (HT)', 'Total (HT)']],
    body: cart.map((item, index) => [
      index + 1,
      item.name,
      item.brand,
      item.quantity,
      `$${item.price.toLocaleString()}`,
      `$${(item.price * item.quantity).toLocaleString()}`
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Totals
  doc.setFontSize(10);
  doc.text(`Subtotal HT:`, 130, finalY);
  doc.text(`$${totalHT.toLocaleString()}`, 180, finalY, { align: 'right' });
  doc.text(`TVA (20%):`, 130, finalY + 6);
  doc.text(`$${tva.toFixed(2)}`, 180, finalY + 6, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TOTAL TTC:`, 130, finalY + 16);
  doc.text(`$${totalTTC.toFixed(2)}`, 180, finalY + 16, { align: 'right' });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Thank you for your purchase! — TechStore', 105, 285, { align: 'center' });

  doc.save(`invoice_${invoiceId}.pdf`);
};

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [formValues, setFormValues] = useState({
    fullName: '', address: '', city: '', postalCode: '',
    cardNumber: '', expiry: '', cvc: ''
  });

  const totalHT = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tva = totalHT * 0.20;
  const totalTTC = totalHT + tva;

  const handleChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    // Save invoice to Firebase Realtime DB
    const invoiceData = {
      client_id: user ? user.uid : 'guest',
      client_email: user ? user.email : formValues.email,
      articles: cart,
      total_ht: totalHT,
      tva: tva,
      total_ttc: totalTTC,
      statut: 'En attente',
      date_creation: new Date().toISOString(),
      shipping: formValues
    };

    let newId = `INV-${Date.now()}`;
    try {
      newId = await firebaseService.createInvoice(invoiceData) || newId;
    } catch (err) {
      console.error("Error saving invoice:", err);
    }

    setInvoiceId(newId);

    // Generate PDF
    generateInvoicePDF(cart, totalHT, tva, totalTTC, { ...formValues, email: user?.email }, newId);

    clearCart();
    setIsSuccess(true);
    setTimeout(() => navigate('/'), 6000);
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm" className="animate-fade-in" sx={{ py: 10, textAlign: 'center' }}>
        <CheckCircle size={90} color="#4caf50" style={{ margin: '0 auto 24px' }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>Order Placed Successfully!</Typography>
        <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
          Your invoice PDF has been downloaded automatically. Invoice ID: <strong>{invoiceId}</strong>
        </Alert>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your purchase. Redirecting to home page…
        </Typography>
        <Button component={Link} to="/" variant="contained">Back to Home</Button>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>Continue Shopping</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="animate-fade-in" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" align="center" gutterBottom sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Left: Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Shipping Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Full Name" name="fullName" value={formValues.fullName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Street Address" name="address" value={formValues.address} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="City" name="city" value={formValues.city} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Postal Code" name="postalCode" value={formValues.postalCode} onChange={handleChange} fullWidth required />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>Payment Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Card Number" name="cardNumber" value={formValues.cardNumber} onChange={handleChange} fullWidth required placeholder="0000 0000 0000 0000" inputProps={{ maxLength: 16 }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Expiry (MM/YY)" name="expiry" value={formValues.expiry} onChange={handleChange} fullWidth required placeholder="MM/YY" />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="CVC" name="cvc" value={formValues.cvc} onChange={handleChange} fullWidth required placeholder="123" inputProps={{ maxLength: 4 }} />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 4, py: 1.75, borderRadius: 2, fontSize: '1.1rem' }}
              >
                Pay ${totalTTC.toFixed(2)} & Download Invoice
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Right: Summary */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, position: 'sticky', top: '90px' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            {cart.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.quantity}x {item.name}
                </Typography>
                <Typography variant="body2">${(item.price * item.quantity).toLocaleString()}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Subtotal HT</Typography>
              <Typography>${totalHT.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">TVA 20%</Typography>
              <Typography>${tva.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Chip label="Free" color="success" size="small" />
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6" fontWeight="bold">Total TTC</Typography>
              <Typography variant="h6" fontWeight="bold">${totalTTC.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
