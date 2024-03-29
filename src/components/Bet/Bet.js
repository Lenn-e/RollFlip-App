import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract } from 'ethers';
import { parseEther } from 'ethers/utils';
import abiData from '../../abi.json';
import EthereumContext from '../../EthereumContext';
import './Bet.css';

function Bet() {
  const { contractAddress } = useContext(EthereumContext);
  const [betAmount, setBetAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const { signer } = useContext(EthereumContext);
  const navigate = useNavigate();
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    if (signer) {
      const newContractInstance = new Contract(contractAddress, abiData.abi, signer);
      setContractInstance(newContractInstance);
    }
  }, [signer, contractAddress]);
  
  const handleDeposit = async () => {
    try {
      setTransactionStatus('pending');

      const amount = parseEther(betAmount);
      const tx = await contractInstance.startGame(amount, { value: amount });
      const receipt = await tx.wait();

      
      if (receipt.logs && receipt.logs.length > 0) {
        const parsedLog = contractInstance.interface.parseLog(receipt.logs[0]);
        const gameId = parsedLog.args[0];
        navigate('/room/' + gameId);
      } else {
        console.error("Failed to retrieve gameId from the transaction receipt.");
      }
      
    } catch (error) {
        console.error("Error depositing:", error);
        setTransactionStatus('error');
    }
  };
  
  return (
    <div className="bet-container">
          <div className="heading-section">
            <h2>Create a new room and share it</h2>
            <div className="info-icon">
              ⓘ
              <div className="tooltip">Enter the desired bet size in the field below and click on deposit. After you've deposited your RLFP, a link will be generated which you can share with your counterparty.</div>
            </div>
          </div>
          <div className="bet-input-section">
            <p>Enter amount of RLFP you want to bet on a coinflip:</p>
            <div className="bet-input-field">
              <button className="bet-button" onClick={handleDeposit}>Deposit</button>
              <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Bet amount" 
              />
            </div>
          </div>
          {transactionStatus === 'pending' && <p className="awaiting-status">Awaiting transaction confirmation...</p>}
    </div>
  );
}

export default Bet;
