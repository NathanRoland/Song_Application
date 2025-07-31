import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DisplayArtist() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date"); // "date" or "type"

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("http://127.0.0.1:5000/artist/info", { artist_id: id });
        setArtist(response.data);
      } catch (err) {
        setError("Failed to fetch artist info.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  // Sort releases based on current sort criteria
  const getSortedReleases = () => {
    if (!artist || !artist.releases) return [];
    
    const sortedReleases = [...artist.releases];
    
    if (sortBy === "date") {
      sortedReleases.sort((a, b) => {
        const dateA = new Date(a.date || "1900-01-01");
        const dateB = new Date(b.date || "1900-01-01");
        return dateB - dateA; // Newest first
      });
    } else if (sortBy === "type") {
      sortedReleases.sort((a, b) => {
        const getTypeOrder = (release) => {
          if (release.is_album) return 1;
          if (release.is_EP) return 2;
          return 3; // Song
        };
        return getTypeOrder(a) - getTypeOrder(b);
      });
    }
    
    return sortedReleases;
  };

  const getReleaseType = (release) => {
    if (release.is_album) return "Album";
    if (release.is_EP) return "EP";
    return "Song"; // Default to Song instead of Unknown
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!artist) return <div>No artist found.</div>;

  const sortedReleases = getSortedReleases();

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2>{artist.name}</h2>
      <p><strong>Bio:</strong> {artist.bio || "N/A"}</p>
      <p><strong>Country:</strong> {artist.country || "N/A"}</p>
      <p><strong>Genre:</strong> {artist.genre || "N/A"}</p>
      <p><strong>Instagram:</strong> {artist.insta_link || "N/A"}</p>
      <p><strong>Spotify:</strong> {artist.spotify_link || "N/A"}</p>
      <p><strong>Apple Music:</strong> {artist.apple_music_link || "N/A"}</p>
      <p><strong>SoundCloud:</strong> {artist.soundcloud_link || "N/A"}</p>
      <p><strong>Email:</strong> {artist.email || "N/A"}</p>
      <p><strong>Profile Picture:</strong> {artist.pfp_path ? <img src={artist.pfp_path} alt="Profile" style={{ maxWidth: 100 }} /> : "N/A"}</p>
      
      {artist.releases && artist.releases.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3>Releases</h3>
            <div>
              <label style={{ marginRight: 8 }}>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}
              >
                <option value="date">Release Date</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>
          {sortedReleases.map((release, index) => (
            <div key={index} style={{ marginBottom: 20, padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  {release.pic && release.pic !== "0" && release.pic !== "1" && release.pic !== null ? (
                    <img 
                      src={release.pic} 
                      alt={release.name}
                      style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 8, 
                        objectFit: "cover",
                        border: "1px solid #eee"
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 8, 
                      background: "#f0f0f0", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: 32,
                      border: "1px solid #eee"
                    }}>
                      🎵
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 8px 0" }}>{release.name}</h4>
                  <p><strong>Release Date:</strong> {release.date || "N/A"}</p>
                  <p><strong>Duration:</strong> {release.time || "N/A"} minutes</p>
                  <p><strong>Unreleased:</strong> {release.unreleased ? "Yes" : "No"}</p>
                  <p><strong>Type:</strong> {getReleaseType(release)}</p>
                  
                  {release.songs && release.songs.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <h5 style={{ margin: "0 0 8px 0" }}>Songs</h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {release.songs.map((song, songIndex) => (
                          <div key={songIndex} style={{ 
                            padding: 8, 
                            background: "#f5f5f5", 
                            borderRadius: 4,
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
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: 4, 
                                    objectFit: "cover"
                                  }}
                                />
                              ) : (
                                <div style={{ 
                                  width: 40, 
                                  height: 40, 
                                  borderRadius: 4, 
                                  background: "#e0e0e0", 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center",
                                  fontSize: 16
                                }}>
                                  🎵
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <strong style={{ display: "block", marginBottom: 2 }}>{song.name}</strong>
                              <small style={{ color: "#666" }}>
                                Duration: {song.time || "N/A"} minutes | 
                                Apple Plays: {song.apl_plays || "N/A"} | 
                                Spotify Plays: {song.spt_plays || "N/A"} | 
                                SoundCloud Plays: {song.soundcloud_plays || "N/A"}
                              </small>
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
        </div>
      )}
    </div>
  );
}

export default DisplayArtist; 