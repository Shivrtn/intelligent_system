import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Balance_sheet from './Home/Balance_sheet';
import Cash_flow from './Home/Cash_flow';
import Income_statement from './Home/Income_statement';
import Historical_data from './Home/Historical_data';
import './App.css';

function Home() {
    const [data, setData] = useState(null);
    const [showNavbar, setShowNavbar] = useState(false);
    const [activeComponent, setActiveComponent] = useState(null);
    const [searchText, setSearchText] = useState(""); // State for search text
    const [suggestions, setSuggestions] = useState([]); // State for suggestions

    // Fetch data based on the provided ID
    const fetchData = async (id) => {
        try {
          // First attempt to fetch data from the primary server
         
      
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
      
          const result = await response.json();
          setData(result);
          setShowNavbar(true);
          setActiveComponent('Balance_sheet'); // Show Balance Sheet by default
          return;
        } catch (error) {
          console.error('Error fetching data from primary server:', error);
          // If the first attempt fails, try the secondary server
          try {
            const response = await fetch('https://intelligent-sysetem-backend.onrender.com/find', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                collectionName: 'Data',
                query: { _id: id },
              }),
            });
      
            if (response.ok) {
              const result = await response.json();
              setData(result);
              setShowNavbar(true);
              setActiveComponent('Balance_sheet'); // Show Balance Sheet by default
            } else {
              console.error('Failed to fetch data from the second server');
            }
          } catch (error) {
            console.error('Error fetching data from secondary server:', error);
          }
        }
      };
      
      // Handle search input change
      const handleSearchChange = async (e) => {
        const text = e.target.value;
        setSearchText(text);
      
        if (text.length > 0) {
          try {
            // First attempt to fetch suggestions from the primary server
           
      
            if (!response.ok) {
              throw new Error('Failed to fetch suggestions');
            }
      
            const result = await response.json();
            setSuggestions(result); // Set suggestions based on input
            return;
          } catch (error) {
            console.error('Error fetching suggestions from primary server:', error);
            // If the first attempt fails, try the secondary server
            try {
              const response = await fetch('https://intelligent-sysetem-backend.onrender.com/suggestion', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchText: text }),
              });
      
              if (response.ok) {
                const result = await response.json();
                setSuggestions(result); // Set suggestions based on input
              } else {
                console.error('Failed to fetch suggestions from the second server');
              }
            } catch (error) {
              console.error('Error fetching suggestions from secondary server:', error);
            }
          }
        } else {
          setSuggestions([]); // Clear suggestions if input is empty
        }
      };
      

    // Handle clicking a suggestion
    const handleSuggestionClick = (id) => {
        fetchData(id); // Fetch data based on the suggestion clicked
        setSearchText(""); // Clear the search text
        setSuggestions([]); // Clear suggestions after selection
    };

    // Handle clicking the company name to reset view
    const handleRelianceClick = () => {
        setShowNavbar(false); // Hide the navbar and return to search input
        setActiveComponent(null); // Reset active component
        setData(null); // Optionally clear the data state if desired
    };

    // Render the active component based on state
    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'Balance_sheet':
                return <Balance_sheet data={data?.BalanceSheet} />;
            case 'Cash_flow':
                return <Cash_flow data={data?.CashFlow_Statement} />;
            case 'Income_statement':
                return <Income_statement data={data?.Income_Statement} />;
            case 'Historical_data':
                // Include all keys except for BalanceSheet, Income_Statement, and CashFlow_Statement
                const filteredData = Object.fromEntries(
                    Object.entries(data || {}).filter(
                        ([key]) => !['BalanceSheet', 'Income_Statement', 'CashFlow_Statement',"_id"].includes(key)
                    )
                );
                return <Historical_data data={filteredData} />;
            default:
                return null;
        }
    };
  
        return (
            <div>
                {!showNavbar ? (
                    <div className="w-100 h-100 max_h home-body d-flex justify-content-center">
                        <div className="home_div d-flex flex-column align-items-center justify-content-center">
                            <input
                                className="px-2 mb-2"
                                placeholder="ENTER STOCK SYMBOL"
                                value={searchText}
                                onChange={handleSearchChange}
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion._id}
                                            onClick={() => handleSuggestionClick(suggestion._id)}
                                            className="suggestion-item"
                                        >
                                            {suggestion.value}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-main">
                        <div className="navbar container-fluid m-0 p-0 d-flex justify-content-between h-nav fs-6">
                            <button
                                className={`nav-link page h_1 rounded border border-dark flex-fill mx-1 ${activeComponent === 'Balance_sheet' ? 'dark-background' : ''}`}
                                onClick={() => setActiveComponent('Balance_sheet')}
                            >
                                Balance <br />Sheet
                            </button>
                            <button
                                className={`nav-link page h_1 rounded border border-dark flex-fill mx-1 ${activeComponent === 'Cash_flow' ? 'dark-background' : ''}`}
                                onClick={() => setActiveComponent('Cash_flow')}
                            >
                                Cash<br />Flow
                            </button>
                            <button
                                className={`nav-link page h_1 rounded border border-dark flex-fill mx-1 ${activeComponent === 'Income_statement' ? 'dark-background' : ''}`}
                                onClick={() => setActiveComponent('Income_statement')}
                            >
                                Income<br />Statement
                            </button>
                            <button
                                className={`nav-link page h_1 rounded border border-dark flex-fill mx-1 ${activeComponent === 'Historical_data' ? 'dark-background' : ''}`}
                                onClick={() => setActiveComponent('Historical_data')}
                            >
                                Historical<br />Data
                            </button>
                            <div className="h_1 rounded border border-dark flex-fill mx-1">
                                <div onClick={handleRelianceClick} className="sym">
                                    <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px' }} />
                                    {data?.symbol || "Company Name"}
                                    <span className="tooltip-text">Click to search the company</span>
                                </div>
                                <div className="d-flex">
                                    <div className="industry ">{data?.Industry || "Company Industry"}</div>
                                    <div className="ltp ">{data?.LTP || "N/A"}</div>
                                </div>
                            </div>
                        </div>
    
                        <div className="component-container">
                            {renderActiveComponent()}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    

export default Home;
