import React, { useState } from 'react';
import axios from 'axios';
import './Portfolio.css';
import './Home/BalanceSheet.css'
const Portfolio = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [message, setMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/portfolio_login', {
        id: userId,
        pass: password,
      });
      if (response.data) {
        setIsLoggedIn(true);
        fetchPortfolio(userId);
        setMessage('');
      } else {
        setMessage('Incorrect username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Login failed. Please try again.');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/create_account', {
        id: userId,
        pass: password,
      });
      if (response.status === 200) {
        setMessage('Account created successfully. Please log in.');
        setIsSigningUp(false);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage('Sign-up failed. This username may be unavailable.');
    }
  };

  const fetchPortfolio = async (id) => {
    try {
      const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/portfolio', { id });
      setPortfolio(response.data);
      setIsLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setMessage('Error fetching portfolio data.');
    }
  };

  const fetchSuggestions = async (text) => {
    try {
      setIsLoading(true); // Start loading
      const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/suggestion', { searchText: text });
      setSuggestions(response.data);
      setIsLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setIsLoading(false); // Stop loading in case of an error
    }
  };

  const handleAddItem = async (symbolId) => {
    try {
      await axios.put('https://intelligent-sysetem-backend.onrender.com/portfolio_put', { id: userId, name: symbolId });
      fetchPortfolio(userId);
      setNewItem('');
      setSuggestions([]);
      setMessage('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      setMessage('Failed to add item.');
    }
  };

  const handleRemoveItem = async (symbol, id) => {
    if (window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      try {
        await axios.post('https://intelligent-sysetem-backend.onrender.com/portfolio_delete', { id: userId, name: id });
        fetchPortfolio(userId);
        setMessage('Item removed successfully');
      } catch (error) {
        console.error('Error removing item:', error);
        setMessage('Failed to remove item.');
      }
    }
  };

  return (
    <div className="portfolio-container1" >
      <header className="header1">
        {isLoggedIn ? (
          <div className="row">
            <span className='col fs-5' >User_id:<span className="user-id1">{userId}</span> </span>
            <button className="logout-btn1 button1 col" onClick={() => setIsLoggedIn(false)}>
              Log Out
            </button>
          </div>
        ) : (
          <div className="header-content1">
            <span className="login-title1">{isSigningUp ? 'Sign Up for a New Account' : 'Login to Your Portfolio'}</span>
          </div>
        )}
      </header>

      <div className="content-container1" style={{"overflow":"scroll"}}>
        {!isLoggedIn ? (
          <div className="login-box1">
            <input
              className='input1'
              type="text"
              placeholder="Username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              className='input1'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSigningUp ? (
              <button className="signup-btn1 button1" onClick={handleSignup}>
                Sign Up
              </button>
            ) : (
              <button className="login-btn1 button1" onClick={handleLogin}>
                Log In
              </button>
            )}
            <button className="toggle-signup-btn1 button1" onClick={() => setIsSigningUp(!isSigningUp)}>
              {isSigningUp ? 'Already have an account? Log In' : 'New user? Sign Up'}
            </button>
            {message && <p className="message1">{message}</p>}
          </div>
        ) : (
          <div className="portfolio-content1">
            {isLoading ? (
              <div>Loading Portfolio...</div>
            ) : suggestions && suggestions.length === 0 ? (
              <div>Your portfolio is empty, add new stocks</div>
            ) : (
              <div className="main-div1">
                <table className="table-1" >
                  <thead>
                    <tr>
                      <th className="index-th">Symbol</th>
                      {portfolio.length > 0 &&
                        Object.keys(portfolio[0])
                          .filter(key => key !== 'symbol' && key !== '_id')
                          .map((key) => (
                            <th className="index-th2" key={key}>{key}</th>
                          ))}
                      <th className="rounded border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((item, index) => (
                      <tr key={index}>
                        <td className="tbody-td">{item.symbol}</td>
                        {Object.keys(item)
                          .filter(key => key !== 'symbol' && key !== '_id')
                          .map((key, idx) => (
                            <td className="tbody-tr-td" key={idx}>{item[key]}</td>
                          ))}
                        <td>
                          <button
                            className="remove-btn1 button1 rounded"
                            onClick={() => handleRemoveItem(item.symbol, item._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="add-item1">
              <input
                className='input1'
                type="text"
                placeholder="Add new stocks"
                value={newItem}
                onChange={(e) => {
                  setNewItem(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
              />
              {suggestions && suggestions.length > 0 && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
