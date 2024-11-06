import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStock = ({ userId, onAddItem }) => {
  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (text) => {
    try {
        // First attempt to fetch from http://13.51.194.144/suggestion
        let response = await axios.post('http://13.51.194.144/suggestion', { searchText: text });
        setSuggestions(response.data); // Set suggestions if the first request is successful
        return; // Exit function if the first request succeeds
    } catch (error) {
        console.error("First server failed, trying second server...");
        // If the first attempt fails, try fetching from the second server
        try {
            const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/suggestion', { searchText: text });
            setSuggestions(response.data); // Set suggestions if the second request is successful
        } catch (error) {
            console.error('Error fetching suggestions from both servers:', error); // Log error if both requests fail
        }
    }
};


  const handleAddItem = (symbolId) => {
    onAddItem(symbolId);
    setNewItem('');
    setSuggestions([]);
  };

  useEffect(() => {
    if (newItem) {
      fetchSuggestions(newItem);
    } else {
      setSuggestions([]);
    }
  }, [newItem]);

  return (
    <div className="add-item1">
      <input
        className='input1'
        type="text"
        placeholder="Add new stocks"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="suggestions-box1">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion._id}
              className="suggestion-item1"
              onClick={() => handleAddItem(suggestion._id)}
            >
              {suggestion.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddStock;
