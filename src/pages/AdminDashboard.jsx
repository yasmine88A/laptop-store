import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';
import { jsonService } from '../services/jsonService';
import { auth } from '../firebase/firebase';
import {
  Box, Typography, Container, Grid, Paper, Divider, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Card, CardContent, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert
} from '@mui/material';
import { ShoppingBag, Users, FileText, TrendingUp, PlusCircle, Trash2, Edit } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
      <Box sx={{ p: 2, bgcolor: `${color}.50`, borderRadius: 3, color: `${color}.main`, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const statusColor = (statut) => {
  if (statut === 'Payée') return 'success';
  if (statut === 'Rejetée') return 'error';
  return 'warning';
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dialog state for adding article
  const [openDialog, setOpenDialog] = useState(false);
  const [newArticle, setNewArticle] = useState({ name: '', brand: '', specs: '', price: '', description: '', image: '', featured: false, category_id: 1 });
  const [dialogMsg, setDialogMsg] = useState('');

  // Dialog state for editing article
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [editDialogMsg, setEditDialogMsg] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) { navigate('/auth'); return; }

      const userData = await firebaseService.getUser(user.uid);
      if (!userData || userData.role !== 'admin') {
        navigate('/');
        return;
      }

      setAuthorized(true);

      // Load data
      const [inv, art] = await Promise.all([
        firebaseService.getAllInvoices(),
        jsonService.getArticles()
      ]);
      setInvoices(inv);
      setArticles(art);
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const totalInvoices = invoices.length;
  const totalEncaisse = invoices.filter(i => i.statut === 'Payée').reduce((s, i) => s + (i.total_ttc || 0), 0);
  const enAttente = invoices.filter(i => i.statut === 'En attente').length;
  const rejected = invoices.filter(i => i.statut === 'Rejetée').length;

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    await firebaseService.updateInvoiceStatus(invoiceId, { statut: newStatus });
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, statut: newStatus } : inv));
  };

  const handleAddArticle = async () => {
    try {
      const res = await fetch('http://localhost:3001/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newArticle, price: parseFloat(newArticle.price) })
      });
      const created = await res.json();
      setArticles(prev => [...prev, created]);
      setDialogMsg('Article added successfully!');
      setNewArticle({ name: '', brand: '', specs: '', price: '', description: '', image: '', featured: false, category_id: 1 });
      setTimeout(() => { setDialogMsg(''); setOpenDialog(false); }, 1500);
    } catch (err) {
      setDialogMsg('Error adding article. Is JSON Server running?');
    }
  };

  const handleDeleteArticle = async (id) => {
    await fetch(`http://localhost:3001/articles/${id}`, { method: 'DELETE' });
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleOpenEdit = (article) => {
    setEditArticle({ ...article });
    setEditDialogMsg('');
    setOpenEditDialog(true);
  };

  const handleEditArticle = async () => {
    try {
      const res = await fetch(`http://localhost:3001/articles/${editArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editArticle, price: parseFloat(editArticle.price) })
      });
      const updated = await res.json();
      setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
      setEditDialogMsg('Product updated successfully!');
      setTimeout(() => { setEditDialogMsg(''); setOpenEditDialog(false); }, 1500);
    } catch (err) {
      setEditDialogMsg('Error updating product. Is JSON Server running?');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authorized) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }} className="animate-fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold">Admin Dashboard</Typography>
          <Typography color="text.secondary">Manage your store</Typography>
        </Box>
        <Chip label="ADMIN" color="error" sx={{ fontWeight: 'bold', fontSize: '0.9rem', px: 1 }} />
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'invoices', label: 'Invoices / Orders' },
          { key: 'articles', label: 'Products (JSON Server)' }
        ].map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(tab.key)}
            sx={{ borderRadius: 8, textTransform: 'none' }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Invoices" value={totalInvoices} icon={<FileText size={28} />} color="primary" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Encaissé" value={`$${totalEncaisse.toFixed(0)}`} icon={<TrendingUp size={28} />} color="success" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="En Attente" value={enAttente} icon={<ShoppingBag size={28} />} color="warning" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Rejetées" value={rejected} icon={<Users size={28} />} color="error" />
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Orders</Typography>
            <Divider sx={{ mb: 2 }} />
            {invoices.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No orders yet.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Invoice ID</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Total TTC</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.slice(0, 5).map((inv) => (
                      <TableRow key={inv.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{inv.id}</TableCell>
                        <TableCell>{new Date(inv.date_creation).toLocaleDateString()}</TableCell>
                        <TableCell><strong>${(inv.total_ttc || 0).toFixed(2)}</strong></TableCell>
                        <TableCell>
                          <Chip label={inv.statut} color={statusColor(inv.statut)} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </>
      )}

      {/* ── INVOICES TAB ── */}
      {activeTab === 'invoices' && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>All Invoices & Orders</Typography>
          <Divider sx={{ mb: 2 }} />
          {invoices.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No invoices found.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Invoice ID</strong></TableCell>
                    <TableCell><strong>Client</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>HT</strong></TableCell>
                    <TableCell><strong>TVA</strong></TableCell>
                    <TableCell><strong>TTC</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{inv.id?.slice(0, 15)}…</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem' }}>{inv.client_email || inv.client_id}</TableCell>
                      <TableCell>{new Date(inv.date_creation).toLocaleDateString()}</TableCell>
                      <TableCell>${(inv.total_ht || 0).toFixed(2)}</TableCell>
                      <TableCell>${(inv.tva || 0).toFixed(2)}</TableCell>
                      <TableCell><strong>${(inv.total_ttc || 0).toFixed(2)}</strong></TableCell>
                      <TableCell>
                        <Chip label={inv.statut} color={statusColor(inv.statut)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          <Button size="small" color="success" variant="outlined" onClick={() => handleStatusUpdate(inv.id, 'Payée')}>Payée</Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleStatusUpdate(inv.id, 'Rejetée')}>Rejetée</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* ── ARTICLES TAB ── */}
      {activeTab === 'articles' && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Products — via JSON Server</Typography>
            <Button variant="contained" startIcon={<PlusCircle size={18} />} onClick={() => setOpenDialog(true)}>
              Add Product
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Brand</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Featured</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles.map((art) => (
                  <TableRow key={art.id} hover>
                    <TableCell>{art.id}</TableCell>
                    <TableCell>{art.name}</TableCell>
                    <TableCell>{art.brand}</TableCell>
                    <TableCell><strong>${art.price}</strong></TableCell>
                    <TableCell>
                      <Chip label={art.featured ? 'Yes' : 'No'} color={art.featured ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button size="small" color="primary" variant="outlined" startIcon={<Edit size={14} />} onClick={() => handleOpenEdit(art)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" variant="outlined" startIcon={<Trash2 size={14} />} onClick={() => handleDeleteArticle(art.id)}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ── Add Article Dialog ── */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {dialogMsg && <Alert severity={dialogMsg.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{dialogMsg}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}><TextField label="Product Name" fullWidth value={newArticle.name} onChange={e => setNewArticle({ ...newArticle, name: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Brand" fullWidth value={newArticle.brand} onChange={e => setNewArticle({ ...newArticle, brand: e.target.value })} /></Grid>
            <Grid item xs={6}><TextField label="Price ($)" type="number" fullWidth value={newArticle.price} onChange={e => setNewArticle({ ...newArticle, price: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField label="Specs" fullWidth value={newArticle.specs} onChange={e => setNewArticle({ ...newArticle, specs: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField label="Description" fullWidth multiline rows={2} value={newArticle.description} onChange={e => setNewArticle({ ...newArticle, description: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField label="Image URL" fullWidth value={newArticle.image} onChange={e => setNewArticle({ ...newArticle, image: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddArticle}>Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Article Dialog ── */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editDialogMsg && <Alert severity={editDialogMsg.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{editDialogMsg}</Alert>}
          {editArticle && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField label="Product Name" fullWidth value={editArticle.name}
                  onChange={e => setEditArticle({ ...editArticle, name: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Brand" fullWidth value={editArticle.brand}
                  onChange={e => setEditArticle({ ...editArticle, brand: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Price ($)" type="number" fullWidth value={editArticle.price}
                  onChange={e => setEditArticle({ ...editArticle, price: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Specs" fullWidth value={editArticle.specs || ''}
                  onChange={e => setEditArticle({ ...editArticle, specs: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Description" fullWidth multiline rows={2} value={editArticle.description || ''}
                  onChange={e => setEditArticle({ ...editArticle, description: e.target.value })} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Image URL" fullWidth value={editArticle.image || ''}
                  onChange={e => setEditArticle({ ...editArticle, image: e.target.value })} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditArticle}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
