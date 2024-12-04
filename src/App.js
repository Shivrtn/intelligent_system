import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import Stocks from './Stocks';
import Filter from './Filter';
import Portfolio from './Portfolio';

import './Home/BalanceSheet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const handleClick = (e) => {
    // Remove "set" class from all links
    document.querySelectorAll('.main_page').forEach(link => {
      link.classList.remove('set');
      link.classList.add('unset');
    });
    // Add "set" class to the clicked link
    e.currentTarget.classList.add('set');
    e.currentTarget.classList.remove('unset');
  };

  // State to manage the visibility of the contact and description
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [isContactVisible, setContactVisible] = useState(false);

  // Toggle description visibility
  const toggleDescriptionVisibility = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  // Toggle contact visibility
  const toggleContactVisibility = () => {
    setContactVisible(!isContactVisible);
  };

  return (
    <Router>
      <div>
        <div className='head'>INTELLIGENT SYSTEM</div>
        <div className='navbar na nav-1 m-0 p-0'>
          <Link
            className="nav-link page w-25 rounded border border-dark main_page unset"
            to="/"
            onClick={handleClick}
          >
            Home
          </Link>
          <Link
            className="nav-link page w-25 rounded border border-dark main_page unset"
            to="/stocks"
            onClick={handleClick}
          >
            Stocks
          </Link>
          <Link
            className="nav-link page w-25 rounded border border-dark main_page unset"
            to="/filter"
            onClick={handleClick}
          >
            Filter
          </Link>
          <Link
            className="nav-link page w-25 rounded border border-dark main_page unset"
            to="/portfolio"
            onClick={handleClick}
          >
            Portfolio
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/portfolio" element={<Portfolio />} />
          
          {/* Catch-all route that redirects to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Footer Section */}
        <footer className="footer text-center mt-5">
          <p>Created by Shiv</p>

          {/* Buttons for toggling visibility */}
          <button className="btn btn-link" onClick={toggleDescriptionVisibility}>
            Description
          </button>
          {isDescriptionVisible && (
            <p>This website is created for stock market fundamental analysis</p>
          )}

          <button className="btn btn-link" onClick={toggleContactVisibility}>
            Contact Us
          </button>
          {isContactVisible && (
            <p>Contact: <a href="mailto:shivratansuthar148@gmail.com">shivratansuthar148@gmail.com</a></p>
          )}
        </footer>
      </div>
    </Router>
  );
}

export default App;
