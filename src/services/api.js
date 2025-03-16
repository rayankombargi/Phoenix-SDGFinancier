import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (userData) => api.post('/auth/signup', userData);
export const getProfile = () => api.get('/profile');
export const getExpenses = () => api.get('/expenses');
export const addExpense = (expenseData) => api.post('/expenses', expenseData);
export const updateExpense = (id, expenseData) => api.put(`/expenses/${id}`, expenseData);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getBudgets = (month, year) => api.get(`/budget?month=${month}&year=${year}`);
export const updateBudgets = (budgetData) => api.put('/budget', budgetData);
export const getRewards = () => api.get('/rewards');
export const getTotalRewards = () => api.get('/rewards/total');
export const addReward = (rewardData) => api.post('/rewards', rewardData);
export const getSustainabilityMetrics = () => api.get('/sustainability');
export const updateSustainabilityMetrics = (metricsData) => api.put('/sustainability', metricsData);
export const computeSustainabilityMetrics = () => api.post('/sustainability/compute');