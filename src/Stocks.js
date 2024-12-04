import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Stocks() {
    const [stocks, setStocks] = useState([]); // State to store the stock data
    const [loading, setLoading] = useState(true); // State for loading state
    const [error, setError] = useState(null); // State for error handling
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // State for sorting
    const [page, setPage] = useState(1); // State for pagination
    const itemsPerPage = 30;

    // Function to fetch stock data from the API
    // Function to fetch stock data from the API
const fetchStockData = async () => {
    setLoading(true); // Start loading before the fetch attempt
    try {
        // First attempt to fetch from https://13.51.194.144/
        let response = await fetch('https://13.51.194.144/Stocks');
        if (!response.ok) {
            throw new Error('Network response was not ok from the first server');
        }
        const data = await response.json();
        setStocks(data); // Update the state with fetched data
        return; // If successful, exit the function
    } catch (error) {
        console.error("First server failed, trying second server...");
        // If the first attempt fails, try fetching from the second server
        try {
            let response = await fetch('https://intelligent-sysetem-backend.onrender.com/Stocks');
            if (!response.ok) {
                throw new Error('Network response was not ok from the second server');
            }
            const data = await response.json();
            setStocks(data); // Update the state with fetched data
        } catch (error) {
            setError(error.message); // Set error message if both fetch attempts fail
        }
    } finally {
        setLoading(false); // Set loading to false after all attempts
    }
};


    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchStockData(); // Fetch the stock data when the component mounts
    }, []); // Empty dependency array ensures this runs only once

    // Function to format numbers safely
    const formatNumber = (value) => {
        if (typeof value === 'number') {
            return value.toFixed(2);
        }
        return value !== null && value !== undefined ? value : 'N/A';
    };

    // Sorting function
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedStocks = [...stocks].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setStocks(sortedStocks); // Update stocks state with sorted data
    };

    // Pagination handlers
    const handlePageChange = (event) => {
        const newPage = Math.max(1, Math.min(Math.ceil(stocks.length / itemsPerPage), Number(event.target.value)));
        setPage(newPage);
    };

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(stocks.length / itemsPerPage)));
    };

    // Render the loading, error, or stock data
    return (
        <div>
            {loading && <p>Loading stock data... </p>}
            {error && <p>Error fetching data: {error}</p>}
            {!loading && !error && stocks.length > 0 && (
                <div className="main-div">
                    <table className="table-1">
                        <thead>
                            <tr>
                                <th className="index-th" onClick={() => handleSort("symbol")}>
                                    Symbol <FontAwesomeIcon icon={faSort} className="sort-icon" />
                                </th>
                                {Object.keys(stocks[0]).filter(key => key !== "symbol").map((key) => (
                                    <th key={key} className="index-th2" onClick={() => handleSort(key)}>
                                        {key}
                                        <FontAwesomeIcon icon={faSort} className="sort-icon" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index) => (
                                <tr key={index}>
                                    <td className="tbody-td">{item.symbol}</td>
                                    {Object.keys(item).filter(key => key !== "symbol").map((key, idx) => (
                                        <td key={idx} className={key === "Industry" ? "scroll_row" : "tbody-tr-td"}>
                                            {formatNumber(item[key])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-controls">
                        <button onClick={handlePrevPage} disabled={page === 1}>
                            <FontAwesomeIcon icon={faChevronLeft} /> Prev
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={Math.ceil(stocks.length / itemsPerPage)}
                            value={page}
                            onChange={handlePageChange}
                            className="page-input"
                        />
                        <button onClick={handleNextPage} disabled={page === Math.ceil(stocks.length / itemsPerPage)}>
                            Next <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stocks;
