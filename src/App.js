import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Stocks from './Stocks';
import Filter from './Filter';
import Portfolio from './Portfolio';

import './Home/BalanceSheet.css';

import { useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
function App() {
  function onclick(){

  }
  return (
    <Router>
      <div>
        <div className=' head'> INTELLIGENT SYSTEM</div>
        <div className='navbar na nav-1 m-0 p-0'>
          <Link className='nav-link page w-25 rounded border border-dark main_page ' to="/">Home</Link>
          <Link className='nav-link page w-25 rounded border border-dark main_page' to="/stocks">Stocks</Link>
          <Link className='nav-link page w-25 rounded border border-dark main_page' to="/filter">Filter</Link>
          <Link className='nav-link page w-25 rounded border border-dark main_page' to="/portfolio">Portfolio</Link>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/portfolio" element={<Portfolio />} />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
