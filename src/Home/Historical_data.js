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
    <div className="bg-light p-4" style={{ backgroundColor: '#ffffff' }}>
      <h3 className="text-center text-success mb-4">Historical Data</h3>
      
      <div className="info-tab d-flex flex-wrap justify-content-center gap-3 mb-4">
        {keys.map(key => (
          <div key={key} className="col-12 col-md-4 col-lg-3 p-3 bg-white shadow-sm rounded text-center">
            <strong className="d-block mb-2" style={{ fontSize: '1rem', color: '#495057' }}>
              {key.replace(/_/g, ' ')}:
            </strong>
            <p style={{ fontSize: '1.1rem', color: '#333' }}>{data[key]}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-muted mb-4">Data at 1-Month Intervals</p>
      
      <ResponsiveContainer width="100%" height={300} className="mb-4">
        <LineChart data={chartData}>
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
