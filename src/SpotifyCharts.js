import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from './config';
import "./SpotifyCharts.css";

const SpotifyCharts = () => {
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [chartType, setChartType] = useState('daily');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // List of available countries
  const countries = [
    'Global', 'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 
    'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Denmark', 
    'Norway', 'Sweden', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 
    'Slovakia', 'Slovenia', 'Croatia', 'Serbia', 'Bulgaria', 'Romania', 
    'Greece', 'Turkey', 'Ukraine', 'Russia', 'Belarus', 'Estonia', 'Latvia', 
    'Lithuania', 'Iceland', 'Ireland', 'Portugal', 'Luxembourg', 'Malta', 
    'Cyprus', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 
    'Peru', 'Ecuador', 'Venezuela', 'Uruguay', 'Paraguay', 'Bolivia', 
    'Australia', 'New Zealand', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 
    'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 
    'Maldives', 'Afghanistan', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 
    'Tajikistan', 'Turkmenistan', 'Azerbaijan', 'Georgia', 'Armenia', 
    'Moldova', 'Albania', 'North Macedonia', 'Kosovo', 'Montenegro', 
    'Bosnia and Herzegovina', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 
    'United Arab Emirates', 'Saudi Arabia', 'Yemen', 'Jordan', 'Lebanon', 
    'Syria', 'Iraq', 'Iran', 'Israel', 'Palestine', 'Egypt', 'Libya', 
    'Tunisia', 'Algeria', 'Morocco', 'Western Sahara', 'Mauritania', 
    'Senegal', 'Gambia', 'Guinea-Bissau', 'Guinea', 'Sierra Leone', 
    'Liberia', 'Ivory Coast', 'Ghana', 'Togo', 'Benin', 'Nigeria', 
    'Niger', 'Burkina Faso', 'Mali', 'Chad', 'Sudan', 'South Sudan', 
    'Central African Republic', 'Cameroon', 'Equatorial Guinea', 'Gabon', 
    'Republic of the Congo', 'Democratic Republic of the Congo', 'Angola', 
    'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 
    'South Africa', 'Lesotho', 'Eswatini', 'Madagascar', 'Comoros', 
    'Mauritius', 'Seychelles', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 
    'Burundi', 'Ethiopia', 'Eritrea', 'Djibouti', 'Somalia', 'Somaliland'
  ];

  useEffect(() => {
    fetchChartData();
  }, [selectedCountry, chartType]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = chartType === 'daily' ? '/charts/spotify/daily' : '/charts/spotify/weekly';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
        country: selectedCountry
      });
      
      setChartData(response.data.data || {});
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to fetch chart data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const numValue = parseInt(num.replace(/,/g, ''));
    if (numValue >= 1000000) {
      return `${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
    return numValue.toString();
  };

  const getChangeIcon = (change) => {
    if (!change) return '➖';
    if (change.includes('+')) return '📈';
    if (change.includes('-')) return '📉';
    return '➖';
  };

  const getChangeColor = (change) => {
    if (!change) return '#666';
    if (change.includes('+')) return '#22c55e';
    if (change.includes('-')) return '#ef4444';
    return '#666';
  };

  return (
    <div className="spotify-charts-container">
      <div className="charts-header">
        <h1>🎵 Spotify Charts</h1>
        <p>Discover the most popular songs on Spotify worldwide</p>
      </div>

      <div className="charts-controls">
        <div className="control-group">
          <label htmlFor="country-select">Country:</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="country-select"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="chart-type">Chart Type:</label>
          <div className="chart-type-buttons">
            <button
              className={`chart-type-btn ${chartType === 'daily' ? 'active' : ''}`}
              onClick={() => setChartType('daily')}
            >
              📊 Daily
            </button>
            <button
              className={`chart-type-btn ${chartType === 'weekly' ? 'active' : ''}`}
              onClick={() => setChartType('weekly')}
            >
              📈 Weekly
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading {chartType} chart for {selectedCountry}...</p>
        </div>
      ) : (
        <div className="charts-content">
          <div className="chart-header">
            <h2>
              {chartType === 'daily' ? '📊 Daily' : '📈 Weekly'} Chart - {selectedCountry}
            </h2>
            <p className="chart-subtitle">
              Top songs on Spotify {chartType === 'daily' ? 'today' : 'this week'}
            </p>
          </div>

          {Object.keys(chartData).length > 0 ? (
            <div className="chart-list">
              {Object.entries(chartData).map(([position, song]) => (
                <div key={position} className="chart-item">
                  <div className="position-badge">
                    {position}
                  </div>
                  
                  <div className="song-info">
                    <div className="song-details">
                      <h3 className="song-title">{song.song}</h3>
                      <p className="song-artists">
                        {Array.isArray(song.artists) ? song.artists.join(', ') : song.artists}
                      </p>
                    </div>
                  </div>

                  <div className="chart-stats">
                    <div className="stat-group">
                      <span className="stat-label">Streams:</span>
                      <span className="stat-value">{formatNumber(song.streams)}</span>
                    </div>
                    
                    <div className="stat-group">
                      <span className="stat-label">Total:</span>
                      <span className="stat-value">{formatNumber(song.total_weekly_streams || song.total_streams)}</span>
                    </div>

                    <div className="stat-group">
                      <span className="stat-label">Peak:</span>
                      <span className="stat-value">{song.peak}</span>
                    </div>

                    <div className="stat-group">
                      <span className="stat-label">
                        {chartType === 'daily' ? 'Days:' : 'Weeks:'}
                      </span>
                      <span className="stat-value">
                        {chartType === 'daily' ? song.days : song.weeks}
                      </span>
                    </div>

                    <div className="stat-group">
                      <span className="stat-label">Change:</span>
                      <span 
                        className="stat-value change-value"
                        style={{ color: getChangeColor(song.change) }}
                      >
                        {getChangeIcon(song.change)} {song.change}
                      </span>
                    </div>

                    {chartType === 'weekly' && song.change_in_weekly_streams && (
                      <div className="stat-group">
                        <span className="stat-label">Weekly Change:</span>
                        <span 
                          className="stat-value change-value"
                          style={{ color: getChangeColor(song.change_in_weekly_streams) }}
                        >
                          {getChangeIcon(song.change_in_weekly_streams)} {song.change_in_weekly_streams}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <h3>📭 No Chart Data Available</h3>
              <p>No chart data found for {selectedCountry} {chartType} chart.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyCharts; 