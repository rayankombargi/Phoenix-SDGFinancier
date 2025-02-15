import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './profileThemes.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [salary, setSalary] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseCost, setExpenseCost] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('Debts & Loans');
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const handleAddExpense = () => {
    setExpenses([...expenses, { name: expenseName, cost: expenseCost, day: day, month: month, year: year, category: category }]);
    setExpenseName('');
    setExpenseCost('');
    setMonth('');
    setDay('');
    setYear('');
  };

  const handleViewExpenses = () => {
    navigate('/Budget', {state: {expenses}});
  };

  const handleSaveProfile = () => {
    const profileData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      salary
    };
    console.log(profileData);
    // You can also save this data to local storage or send it to a server
  };

  return (
    <div>
      <NavBar />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
      <div className='PrimaryInfo'>
        <h1>Profile</h1>
        <form>
          <div className='primaryLabels'>
            <label>First Name:</label>
            <label>Last Name:</label>
            <label>Email:</label>
            <label>Phone Number:</label>
            <label>Salary ($):</label>
          </div>
          <div className='primaryInputs'>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />      
            <input
              type="text"
              value={lastName}
              onChange={(e) => setFirstName(e.target.value)}
            />        
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />  
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setLastName(e.target.value)}
            /> 
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            /> 
          </div>
        </form>
        <button className='SaveButton' type="button" onClick={handleSaveProfile}>
            Save Profile
        </button>
      </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className='SecondaryInfo'>
          <h1>Expenses</h1>
          <form>
            <div className="expensesNameCost">
              <div>
                <input className='SecondaryInput'
                  type="text"
                  name="name"
                  placeholder="Item"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                />
              </div>
              <div>
                <input className='SecondaryInput'
                  type="number"
                  name="Cost"
                  placeholder="Cost"
                  value={expenseCost}
                  onChange={(e) => setExpenseCost(e.target.value)}
                />
              </div>
            </div>
            <div className="expensesDate">
              <input className='DateInput'
                type="number" 
                name="month"
                placeholder="mm"
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
              />
              <input className='DateInput'
                type="number" 
                name="day"
                placeholder="dd"
                value={day} 
                onChange={(e) => setDay(e.target.value)}
              />
              <input className='DateInput'
                type="number" 
                name="year"
                placeholder="yyyy"
                value={year} 
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className='expensesCategory'>
              <div className="categoryFilter">
                  <label htmlFor="category">Category:</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Debts & Loans">Debts & Loans</option>
                      <option value="Savings & Investments">Savings & Investments</option>
                      <option value="Shopping & Lifestyle">Shopping & Lifestyle</option>
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Health & Wellness">Health & Wellness</option>
                      <option value="Travel & Leisure">Travel & Leisure</option>
                      <option value="Education & Self-Development">Education & Self-Development</option>
                      <option value="Giving & Charity">Giving & Charity</option>
                      <option value="Other">Other</option>
                  </select>
              </div>
            </div>
          </form>
          <button className='AddButton' type="button" onClick={handleAddExpense}>
              Add
            </button>
          <button className='ViewButton' type="button" onClick={handleViewExpenses}>
            View Expenses
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
