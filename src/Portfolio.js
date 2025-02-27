import React, { useState } from 'react';
import axios from 'axios';
import './Portfolio.css';
import './Home/BalanceSheet.css';
import AddStock from './AddStock'; // Import the new component

const Portfolio = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [message, setMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleLogin = async () => {
    try {
      // First attempt to login via https://13.51.194.144/portfolio_login
      let response = await axios.post('https://13.51.194.144/portfolio_login', {
        id: userId,
        pass: password,
      });
  
      if (!response.data) {
        throw new Error('Incorrect username or password');
      }
  
      setIsLoggedIn(true);
      fetchPortfolio(userId);
      setMessage('');
    } catch (error) {
      console.error('Error logging in:', error);
      // If the first attempt fails, try the second server
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
        console.error('Error logging in on second server:', error);
        setMessage('Login failed. Please try again.');
      }
    }
  };
  
  const handleSignup = async () => {
    try {
      // First attempt to sign up via https://13.51.194.144/create_account
      let response = await axios.post('https://13.51.194.144/create_account', {
        id: userId,
        pass: password,
      });
  
      if (response.status === 200) {
        setMessage('Account created successfully. Please log in.');
        setIsSigningUp(false);
        return;
      } else {
        throw new Error('Sign-up failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      // If the first attempt fails, try the second server
      try {
        const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/create_account', {
          id: userId,
          pass: password,
        });
  
        if (response.status === 200) {
          setMessage('Account created successfully. Please log in.');
          setIsSigningUp(false);
        } else {
          setMessage('Sign-up failed. This username may be unavailable.');
        }
      } catch (error) {
        console.error('Error signing up on second server:', error);
        setMessage('Sign-up failed. This username may be unavailable.');
      }
    }
  };
  
  const fetchPortfolio = async (id) => {
    try {
      // First attempt to fetch portfolio via https://13.51.194.144/portfolio
      let response = await axios.post('https://13.51.194.144/portfolio', { id });
  
      if (!response.data) {
        throw new Error('Failed to fetch portfolio');
      }
  
      setPortfolio(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // If the first attempt fails, try the second server
      try {
        const response = await axios.post('https://intelligent-sysetem-backend.onrender.com/portfolio', { id });
  
        if (response.data) {
          setPortfolio(response.data);
          setIsLoading(false);
        } else {
          setMessage('Error fetching portfolio data.');
        }
      } catch (error) {
        console.error('Error fetching portfolio from second server:', error);
        setMessage('Error fetching portfolio data.');
      }
    }
  };
  
  const handleAddItem = async (symbolId) => {
    try {
      // First attempt to add item via https://13.51.194.144/portfolio_put
      await axios.put('https://13.51.194.144/portfolio_put', { id: userId, name: symbolId });
      fetchPortfolio(userId);
      setMessage('Item added successfully');
      return;
    } catch (error) {
      console.error('Error adding item:', error);
      // If the first attempt fails, try the second server
      try {
        await axios.put('https://intelligent-sysetem-backend.onrender.com/portfolio_put', { id: userId, name: symbolId });
        fetchPortfolio(userId);
        setMessage('Item added successfully');
      } catch (error) {
        console.error('Error adding item on second server:', error);
        setMessage('Failed to add item.');
      }
    }
  };
  
  const handleRemoveItem = async (symbol, id, item) => {
    if (window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      try {
        // First attempt to remove item via https://13.51.194.144/portfolio_delete
        await axios.post('https://13.51.194.144/portfolio_delete', { id: userId, name: id });
        fetchPortfolio(userId);
        setMessage('Item removed successfully');
        return;
      } catch (error) {
        console.error('Error removing item:', error);
        // If the first attempt fails, try the second server
        try {
          await axios.post('https://intelligent-sysetem-backend.onrender.com/portfolio_delete', { id: userId, name: id });
          fetchPortfolio(userId);
          setMessage('Item removed successfully');
        } catch (error) {
          console.error('Error removing item on second server:', error);
          setMessage('Failed to remove item.');
        }
      }
    }
  };
  

  return (
    <div className="portfolio-container1">
      <header className="header1">
        {isLoggedIn ? (
          <div className="row">
            <span className='col fs-5'>User_id:<span className="user-id1">{userId}</span></span>
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

      <div className="content-container1" style={{ overflow: "scroll" }}>
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
            ) : portfolio.length === 0 ? (
              <div>Your portfolio is empty, add new stocks</div>
            ) : (
              <div className="main-div1">
                <table className="table-1">
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
                            onClick={() => handleRemoveItem(item.symbol, item._id,item)}
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
            <AddStock userId={userId} onAddItem={handleAddItem} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
