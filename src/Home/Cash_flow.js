import React from 'react';
import './BalanceSheet.css';
function Cash_flow({ data }) {
    // If there's no data, display a loading message
    if (!data) {
        return <div>Loading...</div>;
    }

    // Collect all unique balance sheet item names across the years
    const allItems = new Set();
    Object.values(data).forEach((yearData) => {
        Object.keys(yearData).forEach((item) => allItems.add(item));
    });

    // Convert the set into an array to use as row headers
    const itemsArray = Array.from(allItems);

    return (
        <div className="main-div">
            <table className="table-1">
                <thead>
                    <tr>
                        <th className="index-th">Item</th>
                        {Object.keys(data).map((year) => (
                            <th key={year} className="index-th2">{year}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {itemsArray.map((item) => (
                        <tr key={item}>
                            <td className="tbody-td">{item}</td>
                            {Object.keys(data).map((year) => (
                                <td
                                    key={year}
                                    className={`tbody-tr-td ${
                                        data[year][item] && data[year][item] !== 0 ? 'nonZero' : 'zeroValue'
                                    }`}
                                >
                                    {data[year][item] !== undefined && data[year][item] !== 0
                                        ? data[year][item]
                                        : '_'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Cash_flow;
