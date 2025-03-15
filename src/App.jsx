import React from 'react';
import ReactDOM from 'react-dom';
import { ExpensesProvider } from './contexts/ExpensesContext';
import Dashboard from './Dashboard/Dashboard'; 
import ChatButton from './components/ChatButton';
import './ChatButton.css';


ReactDOM.render(
  <ExpensesProvider>
    <Dashboard />
  </ExpensesProvider>,
  document.getElementById('root')
);
