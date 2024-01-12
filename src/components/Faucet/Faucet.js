import React, { useContext } from 'react';
import EthereumContext from '../../EthereumContext';
import './Faucet.css';

function Faucet() {
    const { signer } = useContext(EthereumContext);

    const handleFaucet = async () => {
        if (!signer) {
            console.error('No signer available');
            return;
        }

        try {
            // Get the signer's address
            const address = await signer.getAddress();
            // Send a POST request to the server
            const response = await fetch('http://158.220.112.255:3000/requestFunds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error requesting faucet:', error);
        }
    };

    return (
        <div className="faucet-container">
            <button className="faucet-button" onClick={handleFaucet}>Request Funds</button>
        </div>
    );
}

export default Faucet;