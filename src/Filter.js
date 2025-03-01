import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faArrowLeft, faList, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./Filter.css";

const Filter = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [value, setValue] = useState("");
    const [filtered, setFiltered] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
    const [showWords, setShowWords] = useState(false);
    const [words, setWords] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 30;

    const onSubmit = async () => {
        try {
            // First attempt to fetch from https://13.51.194.144/filterStocks
            let response = await fetch('https://13.51.194.144/filterStocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: value }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok from the first server');
            }
    
            const result = await response.json();
            setFiltered(result); // Set the filtered data from the first request
            return; // Exit function if the first request is successful
        } catch (error) {
            console.error('First server failed, trying second server...', error);
            // If the first attempt fails, try the second server
            try {
                const response = await fetch('https://intelligent-sysetem-backend.onrender.com/filterStocks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: value }),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok from the second server');
                }
    
                const result = await response.json();
                setFiltered(result); // Set the filtered data from the second request
            } catch (error) {
                console.error('Error fetching data from both servers:', error); // Log if both requests fail
            }
        }
    
        setIsSubmitted(true); // Set the submission state at the end
    };
    

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
        const sortedData = [...filtered].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setFiltered(sortedData);
    };

    const resetFilter = () => {
        setIsSubmitted(false);
        setValue("");
        setFiltered(null);
        setPage(1); // Reset page to 1
    };

    const toggleWordsVisibility = () => {
        setShowWords((prev) => !prev);
    };

    const suggestion_words = async () => {
        setShowWords((prev) => !prev);
    
        try {
            // First attempt to fetch from https://13.51.194.144/Columns
            let response = await fetch('https://13.51.194.144/Columns');
            if (!response.ok) {
                throw new Error('Network response was not ok from the first server');
            }
    
            const new_words = await response.json();
            setWords(new_words.cols); // Set the words from the first server
        } catch (error) {
            console.log('First server failed, trying second server...', error);
    
            // If the first attempt fails, try fetching from the second server
            try {
                let response = await fetch('https://intelligent-sysetem-backend.onrender.com/Columns');
                if (!response.ok) {
                    throw new Error('Network response was not ok from the second server');
                }
    
                const new_words = await response.json();
                setWords(new_words.cols); // Set the words from the second server
            } catch (error) {
                console.log('Error fetching words from both servers:', error); // Log if both requests fail
            }
        }
    };
    

    // Pagination handlers
    const handlePageChange = (event) => {
        const newPage = Math.max(1, Math.min(Math.ceil(filtered.length / itemsPerPage), Number(event.target.value)));
        setPage(newPage);
    };

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filtered.length / itemsPerPage)));
    };

    return (
        <div className="filter-container">
            {!isSubmitted ? (
                <div className="div-filter">
                    <input
                        value={value}
                        type="text"
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Type filter criteria (e.g., PE>0 and profit_to_asset>0)"
                        className="filter-input rounded"
                    />
                    <button type="button" onClick={onSubmit} className="filter-button m-2 rounded bg-success">
                        Apply Filter
                    </button>
                    <button type="button" className="words-button" onClick={suggestion_words}>
                        <FontAwesomeIcon icon={faList} /> Available Words
                    </button>
                    {showWords && (
                        <div className="words-flex-container">
                            {words.map((word, index) => (
                                <div key={index} className="word-item">{word}</div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="filter-results-container">
                    <div className="row">
                        <button className="back-button col-4" onClick={resetFilter}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                        </button>
                        <h2 className="col-5 text-dark  center">filtered stocks  </h2>
                    </div>
                    {filtered ? (
                        <div className="main-div">
                            <table className="table-1">
                                <thead>
                                    <tr>
                                        <th className="index-th" onClick={() => handleSort("symbol")}>
                                            Symbol <FontAwesomeIcon icon={faSort} className="sort-icon" />
                                        </th>
                                        {Object.keys(filtered[0]).filter(key => key !== "symbol").map((key) => (
                                            <th key={key} className="index-th2" onClick={() => handleSort(key)}>
                                                {key}
                                                <FontAwesomeIcon icon={faSort} className="sort-icon" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index) => (
                                        <tr key={index}>
                                            <td className="tbody-td">{item.symbol}</td>
                                            {Object.keys(item).filter(key => key !== "symbol").map((key, idx) => (
                                                <td key={idx} className={key === "Industry" ? "scroll_row" : "tbody-tr-td"}>
                                                    {item[key]}
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
                                    max={Math.ceil(filtered.length / itemsPerPage)}
                                    value={page}
                                    onChange={handlePageChange}
                                    className="page-input"
                                />
                                <button onClick={handleNextPage} disabled={page === Math.ceil(filtered.length / itemsPerPage)}>
                                    Next <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <h1>No Data Found</h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default Filter;
