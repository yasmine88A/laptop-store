const API_URL = 'http://localhost:3001';

export const jsonService = {
  // Articles (Laptops)
  getArticles: async () => {
    const response = await fetch(`${API_URL}/articles`);
    return response.json();
  },
  getArticleById: async (id) => {
    const response = await fetch(`${API_URL}/articles/${id}`);
    return response.json();
  },
  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },
  // Settings
  getSettings: async () => {
    const response = await fetch(`${API_URL}/settings`);
    return response.json();
  }
};
