// components/CategoryBreakdownChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Dummy data for category breakdown
const categoryData = [
  { category: "Food & Dining", value: 400 },
  { category: "Debts & Loans", value: 300 },
  { category: "Savings & Investments", value: 300 },
  { category: "Travel & Leisure", value: 200 },
  { category: "Other", value: 100 },
];

// Define an array of colors for the slices
const COLORS = ['#00b894', '#2d3436', '#e74c3c', '#f39c12', '#3498db'];

function CategoryBreakdownChart() {
  return (
    <motion.div
      className="category-breakdown-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
            fill="#8884d8"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default CategoryBreakdownChart;
