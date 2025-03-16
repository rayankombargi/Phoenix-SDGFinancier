import React from 'react';
import ReactDOM from 'react-dom';
import { ExpensesProvider } from './contexts/ExpensesContext';
import Dashboard from './Dashboard/Dashboard'; // or your main component

ReactDOM.render(
  <ExpensesProvider>
    <Dashboard />
  </ExpensesProvider>,
  document.getElementById('root')
);
