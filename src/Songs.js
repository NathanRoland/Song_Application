import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function Songs() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ songs: [], releases: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [showAllReleases, setShowAllReleases] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setError(null);
    setShowAllSongs(false);
    setShowAllReleases(false);

    try {
      const response = await axios.post(`${BASE_URL}/songs`, {
        song: search
      });
      
      setResults(response.data);
    } catch (err) {
      console.error("Error searching songs:", err);
      setError("Failed to search songs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPlayCount = (count) => {
    if (!count) return "N/A";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getReleaseType = (release) => {
    if (release.is_album) return "Album";
    if (release.is_EP) return "EP";
    return "Song";
  };

  // Handler for clicking a song
  const handleSongClick = async (songId) => {
    try {
      const response = await axios.post(`${BASE_URL}/song/info`, { song_id: songId });
      navigate(`/song/info/${songId}`, { state: { song: response.data.song } });
    } catch (err) {
      alert("Failed to fetch song info.");
    }
  };

  // Handler for clicking a release
  const handleReleaseClick = async (releaseId) => {
    try {
      const response = await axios.post(`${BASE_URL}/release/info`, { release_id: releaseId });
      navigate(`/release/info/${releaseId}`, { state: { release: response.data.release } });
    } catch (err) {
      alert("Failed to fetch release info.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Search Songs & Releases</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Type a song or release name..."
          style={{ flex: 1, padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "12px 24px", 
            fontSize: 16, 
            borderRadius: 6, 
            background: loading ? "#ccc" : "#222", 
            color: "#fff", 
            border: "none", 
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: "#fee", color: "#c33", borderRadius: 6, border: "1px solid #fcc" }}>
          {error}
        </div>
      )}

      {/* Songs Results */}
      {results.songs && results.songs.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: "#333" }}>Songs ({results.songs.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(showAllSongs ? results.songs : results.songs.slice(0, 3)).map((song, index) => (
              <div key={index} style={{ 
                padding: 16, 
                border: "1px solid #eee", 
                borderRadius: 8, 
                background: "#fafafa" 
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}>
                    {song.pic && song.pic !== "0" && song.pic !== "1" && song.pic !== null ? (
                      <img 
                        src={song.pic} 
                        alt={song.name}
                        style={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: 8, 
                          objectFit: "cover",
                          border: "1px solid #eee"
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 8, 
                        background: "#f0f0f0", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: 24,
                        border: "1px solid #eee"
                      }}>
                        🎵
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: "#222", cursor: "pointer" }} onClick={() => handleSongClick(song.id)}>
                        {song.name}
                      </h4>
                      <span style={{ 
                        padding: "4px 8px", 
                        background: "#222", 
                        color: "#fff", 
                        borderRadius: 4, 
                        fontSize: 12 
                      }}>
                        Song
                      </span>
                    </div>
                    
                    <p style={{ margin: "8px 0", color: "#666", fontSize: 14 }}>
                      <strong>Artists:</strong> {song.artist_names ? song.artist_names.filter(name => name).join(", ") : "N/A"}
                    </p>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, fontSize: 12, color: "#888" }}>
                      <div><strong>Release Date:</strong> {song.release_date || "N/A"}</div>
                      <div><strong>Duration:</strong> {formatDuration(song.time)}</div>
                      <div><strong>Status:</strong> {song.unreleased ? "Unreleased" : "Released"}</div>
                      <div><strong>Apple Plays:</strong> {formatPlayCount(song.apl_plays)}</div>
                      <div><strong>Spotify Plays:</strong> {formatPlayCount(song.spt_plays)}</div>
                      <div><strong>SoundCloud Plays:</strong> {formatPlayCount(song.soundcloud_plays)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* View More Songs Button */}
            {results.songs.length > 3 && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => setShowAllSongs(!showAllSongs)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 14,
                    borderRadius: 6,
                    background: "#f0f0f0",
                    color: "#333",
                    border: "1px solid #ddd",
                    cursor: "pointer"
                  }}
                >
                  {showAllSongs ? "Show Less" : `View More (${results.songs.length - 3} more)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Releases Results */}
      {results.releases && results.releases.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: "#333" }}>Releases ({results.releases.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(showAllReleases ? results.releases : results.releases.slice(0, 3)).map((release, index) => (
              <div key={index} style={{ 
                padding: 16, 
                border: "1px solid #eee", 
                borderRadius: 8, 
                background: "#fafafa" 
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}>
                    {release.pic && release.pic !== "0" && release.pic !== "1" && release.pic !== null ? (
                      <img 
                        src={release.pic} 
                        alt={release.name}
                        style={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: 8, 
                          objectFit: "cover",
                          border: "1px solid #eee"
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 8, 
                        background: "#f0f0f0", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: 24,
                        border: "1px solid #eee"
                      }}>
                        🎵
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <h4 style={{ margin: 0, color: "#222", cursor: "pointer" }} onClick={() => handleReleaseClick(release.id)}>
                        {release.name}
                      </h4>
                      <span style={{ 
                        padding: "4px 8px", 
                        background: "#444", 
                        color: "#fff", 
                        borderRadius: 4, 
                        fontSize: 12 
                      }}>
                        {getReleaseType(release)}
                      </span>
                    </div>
                    
                    <p style={{ margin: "8px 0", color: "#666", fontSize: 14 }}>
                      <strong>Artists:</strong> {release.artist_names ? release.artist_names.filter(name => name).join(", ") : "N/A"}
                    </p>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, fontSize: 12, color: "#888" }}>
                      <div><strong>Release Date:</strong> {release.date || "N/A"}</div>
                      <div><strong>Duration:</strong> {formatDuration(release.time)}</div>
                      <div><strong>Status:</strong> {release.unreleased ? "Unreleased" : "Released"}</div>
                      <div><strong>Type:</strong> {getReleaseType(release)}</div>
                    </div>
                    
                    {/* Songs in this release */}
                    {release.songs && release.songs.length > 0 && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #eee" }}>
                        <h5 style={{ margin: "0 0 8px 0", color: "#666", fontSize: 13 }}>Songs in this release:</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {release.songs.map((song, songIndex) => (
                            <div key={songIndex} style={{ 
                              padding: 8, 
                              background: "#f5f5f5", 
                              borderRadius: 4, 
                              fontSize: 12,
                              display: "flex",
                              gap: 8,
                              alignItems: "center"
                            }}>
                              <div style={{ flexShrink: 0 }}>
                                {song.pic && song.pic !== "0" && song.pic !== "1" && song.pic !== null ? (
                                  <img 
                                    src={song.pic} 
                                    alt={song.name}
                                    style={{ 
                                      width: 30, 
                                      height: 30, 
                                      borderRadius: 4, 
                                      objectFit: "cover"
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: 30, 
                                    height: 30, 
                                    borderRadius: 4, 
                                    background: "#e0e0e0", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    fontSize: 12
                                  }}>
                                    🎵
                                  </div>
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "bold", color: "#333" }}>{song.name}</div>
                                <div style={{ color: "#666", marginTop: 2 }}>
                                  Duration: {formatDuration(song.time)} | 
                                  Apple: {formatPlayCount(song.apl_plays)} | 
                                  Spotify: {formatPlayCount(song.spt_plays)} | 
                                  SoundCloud: {formatPlayCount(song.soundcloud_plays)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* View More Releases Button */}
            {results.releases.length > 3 && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => setShowAllReleases(!showAllReleases)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 14,
                    borderRadius: 6,
                    background: "#f0f0f0",
                    color: "#333",
                    border: "1px solid #ddd",
                    cursor: "pointer"
                  }}
                >
                  {showAllReleases ? "Show Less" : `View More (${results.releases.length - 3} more)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && results.songs && results.songs.length === 0 && results.releases && results.releases.length === 0 && search && (
        <div style={{ textAlign: "center", color: "#888", padding: 32 }}>
          No songs or releases found for "{search}".
        </div>
      )}

      {/* Initial State */}
      {!loading && !error && (!results.songs || results.songs.length === 0) && (!results.releases || results.releases.length === 0) && !search && (
        <div style={{ textAlign: "center", color: "#888", padding: 32 }}>
          Search for songs and releases above.
        </div>
      )}
    </div>
  );
}

export default Songs; 