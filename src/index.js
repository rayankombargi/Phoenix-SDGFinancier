import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import { ExpensesProvider } from './contexts/ExpensesContext';
import './theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ExpensesProvider>
      <AppRouter />
    </ExpensesProvider>
  </React.StrictMode>
);
