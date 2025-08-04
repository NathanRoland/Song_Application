import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/search', {
        search: query
      });

      // Limit each section to 3 results initially
      const limitedResults = {
        songs: response.data.songs?.slice(0, 3) || [],
        artists: response.data.artists?.slice(0, 3) || [],
        users: response.data.users?.slice(0, 3) || [],
        releases: response.data.releases?.slice(0, 3) || [],
        playlists: response.data.playlists?.slice(0, 3) || [],
        posts: response.data.posts?.slice(0, 3) || []
      };

      // Store full results for pagination
      const fullResults = {
        songs: response.data.songs || [],
        artists: response.data.artists || [],
        users: response.data.users || [],
        releases: response.data.releases || [],
        playlists: response.data.playlists || [],
        posts: response.data.posts || []
      };

      setSearchResults({ limited: limitedResults, full: fullResults });
      setIsSearchOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      handleSearch(query);
    } else {
      setSearchResults(null);
      setIsSearchOpen(false);
    }
  };

  const handleSeeMore = (section) => {
    if (!searchResults) return;

    const currentCount = searchResults.limited[section].length;
    const newCount = Math.min(currentCount + 5, searchResults.full[section].length);
    
    setSearchResults(prev => ({
      ...prev,
      limited: {
        ...prev.limited,
        [section]: prev.full[section].slice(0, newCount)
      }
    }));
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

  const renderResultItem = (item, section) => {
    switch (section) {
      case 'posts':
        return (
          <div key={item.post_id} className="search-result-item post-item">
            <div className="result-icon">📰</div>
            <div className="result-content">
              <div className="result-title">{item.post_title}</div>
              <div className="result-subtitle">by {item.user_id}</div>
              <div className="result-text">{item.post_text.substring(0, 100)}...</div>
            </div>
          </div>
        );
      default:
        return (
          <div key={item.key} className="search-result-item">
            <div className="result-icon">{getSectionIcon(section)}</div>
            <div className="result-content">
              <div className="result-title">{item.name}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search songs, artists, users, posts..."
          value={searchQuery}
          onChange={handleInputChange}
          className="search-input"
        />
        {loading && <div className="search-spinner"></div>}
      </div>

      {isSearchOpen && searchResults && (
        <div className="search-results">
          {Object.entries(searchResults.limited).map(([section, items]) => {
            if (items.length === 0) return null;
            
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
                
                {searchResults.full[section].length > items.length && (
                  <button
                    className="see-more-button"
                    onClick={() => handleSeeMore(section)}
                  >
                    See more {getSectionTitle(section)} ({searchResults.full[section].length - items.length} more)
                  </button>
                )}
              </div>
            );
          })}
          
          {Object.values(searchResults.limited).every(items => items.length === 0) && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 