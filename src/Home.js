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
            const response = await fetch('http://16.170.249.88:4000/find', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collectionName: 'Data',
                    query: { _id: id },
                }),
            });

            const result = await response.json();
            setData(result);
            setShowNavbar(true);
            setActiveComponent('Balance_sheet'); // Show Balance Sheet by default
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Handle search input change
    const handleSearchChange = async (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.length > 0) {
            try {
                const response = await fetch('http://16.170.249.88:4000/suggestion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchText: text }),
                });

                const result = await response.json();
                setSuggestions(result); // Set suggestions based on input
            } catch (error) {
                console.error('Error fetching suggestions:', error);
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
                        <button className="nav-link page h_1 rounded border border-dark flex-fill mx-1" onClick={() => setActiveComponent('Balance_sheet')}>
                            Balance <br />Sheet
                        </button>
                        <button className="nav-link page h_1 rounded border border-dark flex-fill mx-1" onClick={() => setActiveComponent('Cash_flow')}>
                            Cash<br />Flow
                        </button>
                        <button className="nav-link page h_1 rounded border border-dark flex-fill mx-1" onClick={() => setActiveComponent('Income_statement')}>
                            Income<br />Statement
                        </button>
                        <button className="nav-link page h_1 rounded border border-dark flex-fill mx-1" onClick={() => setActiveComponent('Historical_data')}>
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
