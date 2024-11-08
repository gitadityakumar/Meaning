import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

function IndexPopup() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for stored userId in both chrome.storage and localStorage
    chrome.storage.local.get("userId", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error accessing storage:", chrome.runtime.lastError);
        setError("Cannot access storage. Please check extension permissions.");
        return;
      }
      
      const storedUserId = data.userId || localStorage.getItem('storedUserId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setError("User ID not found. Please enter it below.");
      }
    });
  }, []);

  const handleSaveUserId = () => {
    if (userId.trim()) {
      // Update chrome.storage and localStorage
      chrome.storage.local.set({ userId }, () => {
        localStorage.setItem('storedUserId', userId);
        
        chrome.runtime.sendMessage(
          { action: "authenticate", userId },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
              alert("Failed to save User ID due to runtime error.");
              return;
            }
    
            if (response?.status === "success") {
              // console.log("User ID saved successfully.");
              window.close(); // Close popup after saving
            } else {
              console.error(response.message || "Failed to save User ID.");
              alert("Failed to save User ID. Please try again.");
            }
          }
        );
      });
    } else {
      alert("Please enter a valid User ID.");
    }
  };

  return (
    <div style={{ padding: '20px', width: '300px', textAlign: 'center' }}>
      <h3>Enter Your User ID</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
        style={{
          width: '100%',
          marginBottom: '10px',
          padding: '8px',
          fontSize: '16px'
        }}
      />
      <button
        onClick={handleSaveUserId}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Save User ID
      </button>
    </div>
  );
}

export default IndexPopup;
