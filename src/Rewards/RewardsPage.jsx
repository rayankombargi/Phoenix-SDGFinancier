// src/Rewards/RewardsPage.jsx
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import { ExpensesContext } from '../contexts/ExpensesContext';
import './RewardsPage.css';

function RewardsPage() {
  const { rewardsPoints, setRewardsPoints } = useContext(ExpensesContext);

  // Add proper image URLs for each reward
  const rewards = [
    { 
      id: 1, 
      name: 'Amazon Gift Card', 
      points: 500, 
      description: 'Redeem for a $5 Amazon gift card.', 
      image: 'data:image/jpeg;base64,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'
    },
    { 
      id: 2, 
      name: 'Starbucks Voucher', 
      points: 300, 
      description: 'Enjoy a free drink at Starbucks.', 
      image: 'https://store.starbucks.co.nz/cdn/shop/files/1200x1200_-_core_card_BRA_HOUSESIREN21BAR_NZ50ER_3155677e-8a7c-4985-8ecf-458ed21a79a8.jpg?v=1715311261' 
    },
    { 
      id: 3, 
      name: 'Discount Coupon', 
      points: 200, 
      description: 'Get a discount on your next purchase.', 
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISDxISEhIVEBESFRUVFhUVGBUXFRIVFRYYFhUVFRUYHSgiGBolHRUYITEhJSkrMC4uGB8zODMtNyguLisBCgoKDg0OGhAQGislHyIuLS4rLy8tLTA2LS0wLS0tKy0tLS4tLi0tLS4rLS0tLS0tLystLSsvLS0tLS0tLS4tLf/AABEIANMA7wMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABAEDBQYHAv/EAEEQAAEDAgQBCgMECQMFAQAAAAEAAgMEEQUSITEGEyJBUWFxgZGhsRQyUgdCksEjQ1NicoKy0eEkM/A0VKPC4hX/xAAaAQEBAAMBAQAAAAAAAAAAAAAAAQMEBQYC/8QAMREBAAIBAgQCCQQCAwAAAAAAAAECAwQRBRIhMUFREzJCYXGBscHwFCKR0aHhFVLx/9oADAMBAAIRAxEAPwDpiOqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIKuaRuCO9EiYnsoiiAgICAgICAgICAgICAgICAgICAgICAgICAgIKxusQbXsb27kS0bxs2CF4e0G2h60c21ZrOzw+kjO7R4aeyPqMt48Ud+GNOxI9UZI1FvFYfhbuhwPfojJGpjxhFnpnM+YWujNTJW3ZaR9iAgICAgICAgICAgICAgICAgICAgICAgkUNNyhIJsAOhGLLk5IZqKMNAA2CNC0zM7y9oggIIOLRksuPum/gjPp7bW282IRvKINequIXNlcGta9gNgdQTbc3/wjpY9BFqRNpmJXoeJWH5mOb3WI/JHzbh949WYTYcYgd+sA/iu330Rr20mavspkcjXatIcOwg+yME1mO8PaIICAgICAgICAgICAgICAgICC9RucHty739Om6MeWKzWd3rit9OImmerfRhrszXRycm4m1rW1zjXaxRzmrUNZij3gUUk1RD+1r4Yoo7fulmWR34UGc45xSsghh+DYJJnP54s112BhvZhIJ5xbtqg1GP7UqqE2q6HL2/pIj4NeDfzQbvwhxVFiMcj445I+TIa7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' 
    },
  ];

  const [showRedeemBox, setShowRedeemBox] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState('');
  const [redeemedReward, setRedeemedReward] = useState(null);

  const handleRedeemReward = (reward) => {
    if (rewardsPoints < reward.points) {
      alert('Not enough points to redeem this reward!');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRewardsPoints(rewardsPoints - reward.points);
    setRedeemedCode(code);
    setRedeemedReward(reward);
    setShowRedeemBox(true);
  };

  const handleDone = () => {
    setShowRedeemBox(false);
  };

  return (
    <div className="rewards-page">
      <NavBar />

      <motion.div
        className="rewards-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="rewards-header">
          <h1>Redeem Your Rewards</h1>
          <p>Use your hard-earned points to redeem exciting rewards!</p>
          <h2 className="points-available">
            You have {rewardsPoints} points available!
          </h2>
        </header>

        <section className="rewards-list">
          {rewards.map((reward) => (
            <div key={reward.id} className="reward-card">
              <img className="reward-image" src={reward.image} alt={reward.name} />
              <h2 className="reward-title">{reward.name}</h2>
              <p className="reward-description">{reward.description}</p>
              <p className="reward-points">{reward.points} pts</p>
              <button
                className="redeem-btn"
                onClick={() => handleRedeemReward(reward)}
              >
                Redeem
              </button>
            </div>
          ))}
        </section>
      </motion.div>

      {showRedeemBox && (
        <div className="redeem-modal">
          <div className="redeem-content">
            <h3>Congratulations!</h3>
            <p>
              You redeemed <strong>{redeemedReward?.name}</strong>!
            </p>

            {/* Barcode container */}
            <div className="barcode-container">
              <img
                className="barcode-image"
                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${redeemedCode}&scale=2&height=7`}
                alt="Scannable Barcode"
              />
              <p className="barcode-code">Your code is: <strong>{redeemedCode}</strong></p>
            </div>

            <button className="done-btn" onClick={handleDone}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RewardsPage;
