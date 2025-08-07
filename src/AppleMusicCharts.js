import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from './config';
import './SpotifyCharts.css';

const countryList = [
  'Global', 'United States', 'United Kingdom', 'Andorra', 'Argentina', 'Australia', 'Austria', 'Belarus', 'Belgium', 'Bolivia', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'Colombia', 'Costa Rica', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Guatemala', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kazakhstan', 'Latvia', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'Norway', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'Uruguay', 'Venezuela', 'Vietnam'
];

const AppleMusicCharts = () => {
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line
  }, [selectedCountry]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/charts/apple_music`, {
        country: selectedCountry
      });
      setChartData(response.data.data || {});
    } catch (err) {
      setError('Failed to fetch Apple Music chart data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spotify-charts-container">
      <div className="charts-header">
        <h1>🍏 Apple Music Charts</h1>
        <p>Top songs on Apple Music by country</p>
      </div>
      <div className="charts-controls">
        <div className="control-group">
          <label htmlFor="country-select">Country:</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="country-select"
          >
            {countryList.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
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
          <p>Loading Apple Music chart for {selectedCountry}...</p>
        </div>
      ) : (
        <div className="charts-content">
          <div className="chart-header">
            <h2>Apple Music Chart - {selectedCountry}</h2>
            <p className="chart-subtitle">Top songs on Apple Music</p>
          </div>
          {Object.keys(chartData).length > 0 ? (
            <div className="chart-list">
              {Object.entries(chartData).map(([position, song]) => (
                <div key={position} className="chart-item">
                  <div className="position-badge">{position}</div>
                  <div className="song-info">
                    <div className="song-details">
                      <h3 className="song-title">{song.name}</h3>
                      <p className="song-artists">
                        {Array.isArray(song.artists) ? song.artists.join(', ') : song.artists}
                      </p>
                    </div>
                  </div>
                  <div className="chart-stats">
                    <div className="stat-group">
                      <span className="stat-label">Change:</span>
                      <span className="stat-value">{song.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <h3>📭 No Chart Data Available</h3>
              <p>No Apple Music chart data found for {selectedCountry}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppleMusicCharts; 