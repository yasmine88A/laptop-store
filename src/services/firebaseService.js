import { db } from '../firebase/firebase';
import { ref, get, set, update, push } from 'firebase/database';

export const firebaseService = {
  // --- USERS ---
  getUser: async (uid) => {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  },
  createUserProfile: async (uid, userData) => {
    const userRef = ref(db, `users/${uid}`);
    await set(userRef, {
      ...userData,
      role: 'user', // Default role
      createdAt: new Date().toISOString()
    });
  },
  // --- CART ---
  getCart: async (uid) => {
    const cartRef = ref(db, `users/${uid}/cart`);
    const snapshot = await get(cartRef);
    return snapshot.exists() ? snapshot.val() : [];
  },
  updateCart: async (uid, cart) => {
    const cartRef = ref(db, `users/${uid}/cart`);
    await set(cartRef, cart);
  },
  // --- INVOICES (FACTURES) ---
  createInvoice: async (invoiceData) => {
    const invoicesRef = ref(db, 'factures');
    const newInvoiceRef = push(invoicesRef);
    await set(newInvoiceRef, {
      ...invoiceData,
      id: newInvoiceRef.key,
      date_creation: new Date().toISOString(),
      statut: 'En attente'
    });
    return newInvoiceRef.key;
  },
  getInvoicesByUser: async (uid) => {
     // Note: In a real app, you'd use query() and orderByChild(). 
     // For simplicity in Realtime DB, we fetch all and filter, or maintain a user-invoice list.
     const invoicesRef = ref(db, 'factures');
     const snapshot = await get(invoicesRef);
     if (!snapshot.exists()) return [];
     
     const allInvoices = snapshot.val();
     return Object.values(allInvoices).filter(inv => inv.client_id === uid);
  },
  getAllInvoices: async () => {
    const invoicesRef = ref(db, 'factures');
    const snapshot = await get(invoicesRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  },
  updateInvoiceStatus: async (invoiceId, statusData) => {
    const invoiceRef = ref(db, `factures/${invoiceId}`);
    await update(invoiceRef, statusData);
  }
};
