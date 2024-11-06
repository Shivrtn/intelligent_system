import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStock = ({ userId, onAddItem }) => {
  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (text) => {
    try {
      const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/suggestion', { searchText: text });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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
