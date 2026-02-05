import React, { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import api from '../utils/api';
import '../styles/PostsChart.css';

const PostsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyPostCounts();
  }, []);

  const fetchDailyPostCounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/stats/daily-counts');
      if (response.data.success && response.data.data) {
        setChartData(response.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching daily post counts:', err);
      setError('Failed to load chart data');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const getChartStats = () => {
    if (chartData.length === 0) return { total: 0, average: 0, peak: 0, peakDate: '' };
    
    const total = chartData.reduce((sum, item) => sum + item.count, 0);
    // Only count days with posts for average
    const daysWithPosts = chartData.filter(item => item.count > 0).length;
    const average = daysWithPosts > 0 ? (total / daysWithPosts).toFixed(1) : 0;
    const peakDay = chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0]);
    
    return {
      total,
      average,
      peak: peakDay.count,
      peakDate: peakDay.displayDate || new Date(peakDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const stats = getChartStats();

  if (loading) {
    return (
      <div className="posts-chart-container loading">
        <div className="chart-spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-chart-container error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="posts-chart-container">
      <div className="chart-header">
        <div className="chart-title-section">
          <div className="chart-icon-wrapper">
            <span className="chart-icon">📊</span>
          </div>
          <div className="chart-title-text">
            <h3>Blog Activity Analytics</h3>
            <p className="chart-description">Daily publishing trends over the last 30 days</p>
          </div>
        </div>
        
        {chartData.length > 0 && (
          <div className="chart-stats-summary">
            <div className="stat-mini">
              <span className="stat-mini-icon">📝</span>
              <div className="stat-mini-content">
                <span className="stat-mini-value">{stats.total}</span>
                <span className="stat-mini-label">Total Posts</span>
              </div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-icon">📈</span>
              <div className="stat-mini-content">
                <span className="stat-mini-value">{stats.average}</span>
                <span className="stat-mini-label">Avg/Day</span>
              </div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-icon">🔥</span>
              <div className="stat-mini-content">
                <span className="stat-mini-value">{stats.peak}</span>
                <span className="stat-mini-label">Peak ({stats.peakDate})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty">
          <div className="chart-empty-icon">📈</div>
          <h4>No Activity Data Yet</h4>
          <p>Post activity will appear here once users start publishing content</p>
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart
              data={chartData}
              margin={{ top: 30, right: 40, left: 10, bottom: 70 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" strokeOpacity={0.5} />
              <XAxis
                dataKey="displayDate"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11, fill: '#6c757d', fontWeight: 500 }}
                stroke="#dee2e6"
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6c757d', fontWeight: 500 }}
                stroke="#dee2e6"
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
                  padding: '12px 16px'
                }}
                labelStyle={{
                  color: '#667eea',
                  fontWeight: '700',
                  marginBottom: '6px'
                }}
                itemStyle={{
                  color: '#333',
                  fontWeight: '600'
                }}
                cursor={{
                  stroke: 'rgba(102, 126, 234, 0.3)',
                  strokeWidth: 2,
                  strokeDasharray: '5 5'
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '25px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
                iconType="circle"
              />
              <Bar
                dataKey="count"
                fill="url(#colorCount)"
                name="Daily Posts"
                radius={[10, 10, 0, 0]}
                maxBarSize={50}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="url(#lineGradient)"
                strokeWidth={4}
                dot={{ fill: '#fff', stroke: '#667eea', strokeWidth: 3, r: 6 }}
                activeDot={{ r: 8, fill: '#667eea', stroke: '#fff', strokeWidth: 3 }}
                name="Trend Line"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PostsChart;
