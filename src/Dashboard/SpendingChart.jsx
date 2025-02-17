// components/SpendingChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Dummy data representing spending over time
const spendingData = [
  { date: '2025-01-01', spending: 200 },
  { date: '2025-01-08', spending: 300 },
  { date: '2025-01-15', spending: 250 },
  { date: '2025-01-22', spending: 400 },
  { date: '2025-01-29', spending: 350 },
  { date: '2025-02-05', spending: 500 },
  { date: '2025-02-12', spending: 450 },
];

function SpendingChart() {
  return (
    <motion.div
      className="spending-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={spendingData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#2d3436' }}
            label={{ value: 'Date', position: 'insideBottomRight', offset: 0, fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#2d3436' }}
            label={{ value: 'Spending ($)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="spending" 
            stroke="#00b894" 
            strokeWidth={2} 
            dot={{ r: 3 }} 
            activeDot={{ r: 5 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default SpendingChart;
