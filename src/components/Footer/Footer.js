import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleFaucet = () => {
    navigate('/Faucet');
  };

  return (
    <div className="footer">
      <p>© 2024 RollFlip</p>
      <button className="faucet" onClick={handleFaucet}>Faucet</button>
    </div>
  );
};

export default Footer;
