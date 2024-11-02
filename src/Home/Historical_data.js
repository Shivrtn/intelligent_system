import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function Historical_data({ data }) {
  // Prepare data for the chart
  const chartData = Object.entries(data).map(([date, value]) => {
    const year = new Date(date).getFullYear(); // Extract year for x-axis
    return {
      fullDate: date, // Keep full date for tooltip
      year, // Use year for x-axis
      value,
    };
  });

  // Custom tooltip to show full date
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #ccc', padding: '10px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Date: ${payload[0].payload.fullDate}`}</p>
          <p style={{ margin: 0 }}>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-light" style={{ padding: '20px', height: '400px' }}>
      <h3 style={{ textAlign: 'center', color: '#2b8a3e' }}>Historical Data</h3>
      <p style={{ textAlign: 'center', color: '#6c757d' }}>Data at 1-Month Intervals</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12, fill: '#495057' }} 
            label={{ value: 'Year', position: 'insideBottomRight', offset: -5, fill: '#495057' }} // Add label for the x-axis
          />
          <YAxis tick={{ fontSize: 12, fill: '#495057' }} />
          <Tooltip content={<CustomTooltip />} /> {/* Use custom tooltip */}
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF6F61" // Happy color
            strokeWidth={2}
            dot={{ stroke: '#FF6F61', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#FF6F61' }} // Change color on hover
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Historical_data;
