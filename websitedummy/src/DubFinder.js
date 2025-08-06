import React, { useState, useRef } from 'react';
import axios from 'axios';
import './DubFinder.css';

const DubFinder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setError('Please select a valid audio file');
      setSelectedFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid audio file');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/dubfinder/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      setUploadResult(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsUploading(false);
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

  return (
    <div className="dubfinder-container">
      <div className="dubfinder-header">
        <h1>🎵 DubFinder</h1>
        <p>Upload an audio file to identify the song and get detailed information</p>
        <div className="dubfinder-nav">
          <a href="/dubfinder" className="nav-link active">🎵 Single Track</a>
          <a href="/dubfinder/setlist" className="nav-link">🎧 Setlist Analysis</a>
        </div>
      </div>

      <div className="upload-section">
        <div 
          className={`file-drop-zone ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p>Click to select or drag and drop an audio file</p>
            <p className="file-types">Supports: MP3, WAV, M4A, FLAC, and more</p>
          </div>
        </div>

        {selectedFile && (
          <div className="file-info">
            <h4>Selected File:</h4>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        <button 
          className="upload-button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? '🔄 Analyzing...' : '🎵 Upload and Analyze'}
        </button>
      </div>

      {uploadResult && uploadResult.result && (
        <div className="results-section">
          <div className="success-header">
            <h2>✅ Analysis Complete!</h2>
            <p>Successfully analyzed: <strong>{uploadResult.filename}</strong></p>
          </div>

          <div className="track-info">
            {/* Basic Track Info */}
            <div className="info-card basic-info">
              <h3>📀 Basic Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Title:</label>
                  <span>{uploadResult.result.title || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <label>Album:</label>
                  <span>{uploadResult.result.album || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <label>Release Date:</label>
                  <span>{formatDate(uploadResult.result.release_date)}</span>
                </div>
                {uploadResult.result.timecode && (
                  <div className="info-item">
                    <label>Duration:</label>
                    <span>{formatDuration(uploadResult.result.timecode)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Artists */}
            {uploadResult.result.artists && uploadResult.result.artists.length > 0 && (
              <div className="info-card artists-info">
                <h3>👥 Artists</h3>
                <div className="artists-list">
                  {uploadResult.result.artists.map((artist, index) => (
                    <span key={index} className="artist-tag">{artist}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Spotify Information */}
            {uploadResult.result.spotify_url && (
              <div className="info-card spotify-info">
                <h3>🎧 Spotify</h3>
                <div className="spotify-content">
                  {uploadResult.result.spotify_cover_art && (
                    <img 
                      src={uploadResult.result.spotify_cover_art} 
                      alt="Album Cover" 
                      className="album-cover"
                    />
                  )}
                  <div className="spotify-details">
                    <div className="info-item">
                      <label>Album:</label>
                      <span>{uploadResult.result.spotify_album || 'Unknown'}</span>
                    </div>
                    <div className="info-item">
                      <label>Spotify URL:</label>
                      <a 
                        href={uploadResult.result.spotify_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="spotify-link"
                      >
                        Open in Spotify
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MusicBrainz Information */}
            {uploadResult.result.musicbrainz_id && (
              <div className="info-card musicbrainz-info">
                <h3>🎼 MusicBrainz</h3>
                <div className="info-item">
                  <label>Recording ID:</label>
                  <span>{uploadResult.result.musicbrainz_id}</span>
                </div>
              </div>
            )}

            {/* Lyrics */}
            {uploadResult.result.lyrics && (
              <div className="info-card lyrics-info">
                <h3>📝 Lyrics</h3>
                <div className="lyrics-content">
                  <p>{uploadResult.result.lyrics}</p>
                </div>
              </div>
            )}

            {/* Raw Data (for debugging) */}
            <div className="info-card raw-data">
              <h3>🔍 Raw Analysis Data</h3>
              <details>
                <summary>Click to view raw data</summary>
                <pre className="raw-data-content">
                  {JSON.stringify(uploadResult.result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}

      {uploadResult && !uploadResult.result && (
        <div className="no-results">
          <h3>❌ No Results Found</h3>
          <p>The audio file could not be identified. Try a different file or check the audio quality.</p>
        </div>
      )}
    </div>
  );
};

export default DubFinder; 