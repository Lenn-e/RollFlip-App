import React, { useContext, useState } from 'react';
import EthereumContext from '../../EthereumContext';
import './Faucet.css';

function Faucet() {
    const [status, setStatus] = useState("");
    const { signer } = useContext(EthereumContext);

    const handleFaucet = async () => {
        if (!signer) {
            console.error('No signer available');
            return;
        }

        try {
            setStatus("Requesting faucet...");
            // Get the signer's address
            const address = await signer.getAddress();
            // Send a request to the server
            const response = await fetch('http://158.220.112.255:3000/requestFunds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            if (!response.ok) {
                if(response.status == 429) {
                    setStatus("Request limit reached. Please try again later.");
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } else {
                setStatus("Success!");
            }

            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error requesting faucet:', error);
            setStatus("Error requesting faucet");
        }
    };

    return (
        <div className="faucet-container">
            <button className="faucet-button" onClick={handleFaucet}>Request Funds</button>
            {status && <div className="status-message">{status}</div>}
        </div>
    );
}

export default Faucet;
