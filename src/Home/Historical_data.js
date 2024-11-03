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

  const keys = Object.keys(data).filter(key => key !== 'Historical' && key !== 'LTP' && key !== 'Industry' && key !== 'symbol');
  
  const chartData = Object.entries(data.Historical || {}).map(([date, value]) => {
    const year = new Date(date).getFullYear();
    return {
      fullDate: date,
      year,
      value,
    };
  });

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
    <div className="bg-light" style={{ padding: '20px', backgroundColor: '#ffffff', height: '500px' }}>
      <h3 style={{ textAlign: 'center', color: '#2b8a3e' }}>Historical Data</h3>
      
      <div className="info-tab" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '15px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          marginBottom: '20px',
        }}>
        {keys.map(key => (
          <div key={key} style={{
              flex: '1 1 200px',
              padding: '15px',
              backgroundColor: '#ffffff',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
            <strong style={{ fontSize: '1rem', color: '#495057' }}>{key.replace(/_/g, ' ')}:</strong>
            <p style={{ fontSize: '1.1rem', color: '#333', margin: '5px 0 0' }}>{data[key]}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#6c757d' }}>Data at 1-Month Intervals</p>
      <ResponsiveContainer width="100%" height="80%" style={{ backgroundColor: '#ffffff' }}>
        <LineChart data={chartData} style={{ backgroundColor: '#ffffff' }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12, fill: '#495057' }} 
            label={{ value: 'Year', position: 'insideBottomRight', offset: -5, fill: '#495057' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#495057' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#FF6F61"
            strokeWidth={2}
            dot={{ stroke: '#FF6F61', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#FF6F61' }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Historical_data;
