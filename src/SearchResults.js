import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from './config';
import "./SearchResults.css";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('q');
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setError('No search query provided');
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/search`, {
        search: query
      });

      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (section) => {
    const icons = {
      songs: '🎵',
      artists: '🎤',
      users: '👤',
      releases: '💿',
      playlists: '📝',
      posts: '📰'
    };
    return icons[section] || '📄';
  };

  const getSectionTitle = (section) => {
    const titles = {
      songs: 'Songs',
      artists: 'Artists',
      users: 'Users',
      releases: 'Releases',
      playlists: 'Playlists',
      posts: 'Posts'
    };
    return titles[section] || section;
  };

  const handleResultClick = (item, section) => {
    // Navigate to appropriate page based on result type
    switch (section) {
      case 'songs':
        navigate(`/song/${item.key}`);
        break;
      case 'artists':
        navigate(`/artist/${item.key}`);
        break;
      case 'users':
        navigate(`/user/${item.key}`);
        break;
      case 'releases':
        navigate(`/release/${item.key}`);
        break;
      case 'playlists':
        navigate(`/playlist/${item.key}`);
        break;
      case 'posts':
        // For posts, we might want to show in a modal or navigate to a post view
        console.log('Post clicked:', item);
        break;
      default:
        console.log('Unknown section:', section);
    }
  };

  const renderResultItem = (item, section) => {
    switch (section) {
      case 'posts':
        return (
          <div key={item.post_id} className="search-result-item post-item" onClick={() => handleResultClick(item, section)}>
            <div className="result-icon">📰</div>
            <div className="result-content">
              <div className="result-title">{item.post_title}</div>
              <div className="result-subtitle">by {item.user_id}</div>
              <div className="result-text">{item.post_text.substring(0, 150)}...</div>
              <div className="result-meta">
                <span>❤️ {item.likes}</span>
                <span>💬 {item.comments}</span>
                <span>{new Date(item.time).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div key={item.key} className="search-result-item" onClick={() => handleResultClick(item, section)}>
            <div className="result-icon">{getSectionIcon(section)}</div>
            <div className="result-content">
              <div className="result-title">{item.name}</div>
            </div>
          </div>
        );
    }
  };

  const searchQuery = new URLSearchParams(location.search).get('q');

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="search-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Search Results</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching for "{searchQuery}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-page">
        <div className="search-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Search Results</h1>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalResults = Object.values(searchResults || {}).reduce((sum, items) => sum + (items?.length || 0), 0);

  return (
    <div className="search-results-page">
      <div className="search-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Search Results</h1>
        <div className="search-info">
          <p>Found {totalResults} results for "{searchQuery}"</p>
        </div>
      </div>

      <div className="search-results-container">
        {Object.entries(searchResults || {}).map(([section, items]) => {
          if (!items || items.length === 0) return null;
          
          return (
            <div key={section} className="search-section">
              <div className="section-header">
                <span className="section-icon">{getSectionIcon(section)}</span>
                <span className="section-title">{getSectionTitle(section)}</span>
                <span className="section-count">({items.length})</span>
              </div>
              
              <div className="section-results">
                {items.map(item => renderResultItem(item, section))}
              </div>
            </div>
          );
        })}
        
        {totalResults === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try adjusting your search terms or browse our content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 