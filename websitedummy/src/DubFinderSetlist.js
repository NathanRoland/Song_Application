import React, { useState } from 'react';
import axios from 'axios';
import './DubFinderSetlist.css';

const DubFinderSetlist = () => {
  const [link, setLink] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [setlistResult, setSetlistResult] = useState(null);
  const [error, setError] = useState(null);

  const handleLinkChange = (event) => {
    setLink(event.target.value);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!link.trim()) {
      setError('Please enter a valid SoundCloud or YouTube link');
      return;
    }

    // Validate link format
    const isValidLink = link.includes('soundcloud.com') || 
                       link.includes('youtube.com') || 
                       link.includes('youtu.be');
    
    if (!isValidLink) {
      setError('Please enter a valid SoundCloud or YouTube link');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSetlistResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/dubfinder/setlist', {
        link: link.trim()
      });

      console.log('Setlist response:', response.data);
      setSetlistResult(response.data);
    } catch (err) {
      console.error('Setlist analysis error:', err);
      setError(err.response?.data?.error || 'Failed to analyze setlist');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getPlatformIcon = (link) => {
    if (link.includes('soundcloud.com')) return '🎵';
    if (link.includes('youtube.com') || link.includes('youtu.be')) return '📺';
    return '🔗';
  };

  return (
    <div className="dubfinder-setlist-container">
      <div className="setlist-header">
        <h1>🎧 DubFinder Setlist</h1>
        <p>Analyze SoundCloud or YouTube links to extract track information from mixes and sets</p>
        <div className="dubfinder-nav">
          <a href="/dubfinder" className="nav-link">🎵 Single Track</a>
          <a href="/dubfinder/setlist" className="nav-link active">🎧 Setlist Analysis</a>
        </div>
      </div>

      <div className="link-input-section">
        <div className="input-group">
          <label htmlFor="link-input">Enter SoundCloud or YouTube Link:</label>
          <div className="link-input-wrapper">
            <input
              id="link-input"
              type="url"
              value={link}
              onChange={handleLinkChange}
              placeholder="https://soundcloud.com/artist/mix-name or https://youtube.com/watch?v=..."
              className="link-input"
              disabled={isAnalyzing}
            />
            <button 
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={!link.trim() || isAnalyzing}
            >
              {isAnalyzing ? '🔄 Analyzing...' : '🎵 Analyze Setlist'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        <div className="supported-platforms">
          <h4>Supported Platforms:</h4>
          <div className="platform-icons">
            <span className="platform-icon">🎵 SoundCloud</span>
            <span className="platform-icon">📺 YouTube</span>
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="analyzing-section">
          <div className="loading-spinner"></div>
          <h3>🔄 Analyzing Setlist...</h3>
          <p>This may take a few minutes depending on the length of the mix</p>
          <div className="progress-info">
            <p>• Downloading audio from {getPlatformIcon(link)} {link.includes('soundcloud.com') ? 'SoundCloud' : 'YouTube'}</p>
            <p>• Splitting into segments for analysis</p>
            <p>• Identifying tracks using music recognition</p>
          </div>
        </div>
      )}

      {setlistResult && setlistResult.setlist && (
        <div className="setlist-results">
          <div className="success-header">
            <h2>✅ Setlist Analysis Complete!</h2>
            <p>Found <strong>{setlistResult.setlist.length}</strong> tracks in the setlist</p>
          </div>

          <div className="setlist-tracks">
            {setlistResult.setlist.map((track, index) => (
              <div key={index} className="track-card">
                <div className="track-header">
                  <div className="track-number">#{index + 1}</div>
                  <div className="track-title">
                    <h3>{track.title || 'Unknown Track'}</h3>
                    {track.artists && track.artists.length > 0 && (
                      <p className="track-artists">
                        {track.artists.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="track-details">
                  {/* Basic Info */}
                  <div className="detail-section">
                    <h4>📀 Track Information</h4>
                    <div className="detail-grid">
                      {track.album && (
                        <div className="detail-item">
                          <label>Album:</label>
                          <span>{track.album}</span>
                        </div>
                      )}
                      {track.release_date && (
                        <div className="detail-item">
                          <label>Release Date:</label>
                          <span>{formatDate(track.release_date)}</span>
                        </div>
                      )}
                      {track.timecode && (
                        <div className="detail-item">
                          <label>Duration:</label>
                          <span>{formatDuration(track.timecode)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Spotify Info */}
                  {track.spotify_url && (
                    <div className="detail-section">
                      <h4>🎧 Spotify</h4>
                      <div className="spotify-section">
                        {track.spotify_cover_art && (
                          <img 
                            src={track.spotify_cover_art} 
                            alt="Album Cover" 
                            className="track-album-cover"
                          />
                        )}
                        <div className="spotify-links">
                          <a 
                            href={track.spotify_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="spotify-link"
                          >
                            🎵 Open in Spotify
                          </a>
                          {track.spotify_album && (
                            <p className="spotify-album">Album: {track.spotify_album}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MusicBrainz Info */}
                  {track.musicbrainz_id && (
                    <div className="detail-section">
                      <h4>🎼 MusicBrainz</h4>
                      <div className="detail-item">
                        <label>Recording ID:</label>
                        <span>{track.musicbrainz_id}</span>
                      </div>
                    </div>
                  )}

                  {/* Lyrics */}
                  {track.lyrics && (
                    <div className="detail-section">
                      <h4>📝 Lyrics</h4>
                      <div className="lyrics-preview">
                        <p>{track.lyrics.substring(0, 200)}...</p>
                        <details>
                          <summary>Show full lyrics</summary>
                          <p className="full-lyrics">{track.lyrics}</p>
                        </details>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Setlist Summary */}
          <div className="setlist-summary">
            <h3>📊 Setlist Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <label>Total Tracks:</label>
                <span>{setlistResult.setlist.length}</span>
              </div>
              <div className="stat-item">
                <label>Identified Tracks:</label>
                <span>{setlistResult.setlist.filter(track => track.title && track.title !== 'Unknown Track').length}</span>
              </div>
              <div className="stat-item">
                <label>Unique Artists:</label>
                <span>{new Set(setlistResult.setlist.flatMap(track => track.artists || [])).size}</span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="export-section">
            <h3>📤 Export Setlist</h3>
            <div className="export-buttons">
              <button 
                className="export-button"
                onClick={() => {
                  const setlistText = setlistResult.setlist.map((track, index) => 
                    `${index + 1}. ${track.title || 'Unknown Track'} - ${track.artists?.join(', ') || 'Unknown Artist'}`
                  ).join('\n');
                  navigator.clipboard.writeText(setlistText);
                  alert('Setlist copied to clipboard!');
                }}
              >
                📋 Copy to Clipboard
              </button>
              <button 
                className="export-button"
                onClick={() => {
                  const setlistData = {
                    link: link,
                    analyzedAt: new Date().toISOString(),
                    tracks: setlistResult.setlist
                  };
                  const dataStr = JSON.stringify(setlistData, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'setlist-analysis.json';
                  link.click();
                }}
              >
                💾 Download JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {setlistResult && (!setlistResult.setlist || setlistResult.setlist.length === 0) && (
        <div className="no-results">
          <h3>❌ No Tracks Found</h3>
          <p>The setlist could not be analyzed. This might be due to:</p>
          <ul>
            <li>Audio quality issues</li>
            <li>Mix contains unknown or unreleased tracks</li>
            <li>Link is not accessible</li>
            <li>Mix is too short or too long</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DubFinderSetlist; 