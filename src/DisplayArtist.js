import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from './config';

function DisplayArtist() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("songs"); // "songs", "albums", "eps", "posts"

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/artist/info`, { artist_id: id });
        setArtist(response.data);
      } catch (err) {
        setError("Failed to fetch artist info.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  const getReleaseType = (release) => {
    if (release.is_album) return "Album";
    if (release.is_EP) return "EP";
    return "Song"; // Default to Song instead of Unknown
  };

  // Helper functions to organize data by type
  const getAllSongs = () => {
    if (!artist || !artist.releases) return [];
    
    const allSongs = [];
    artist.releases.forEach(release => {
      if (release.songs) {
        release.songs.forEach(song => {
          allSongs.push({
            ...song,
            releaseName: release.name,
            releaseDate: release.date,
            releaseType: getReleaseType(release)
          });
        });
      }
    });
    
    // Sort by release date (newest first)
    return allSongs.sort((a, b) => {
      const dateA = new Date(a.releaseDate || "1900-01-01");
      const dateB = new Date(b.releaseDate || "1900-01-01");
      return dateB - dateA;
    });
  };

  const getAlbums = () => {
    if (!artist || !artist.releases) return [];
    
    const albums = artist.releases.filter(release => release.is_album);
    
    // Sort by release date (newest first)
    return albums.sort((a, b) => {
      const dateA = new Date(a.date || "1900-01-01");
      const dateB = new Date(b.date || "1900-01-01");
      return dateB - dateA;
    });
  };

  const getEPs = () => {
    if (!artist || !artist.releases) return [];
    
    const eps = artist.releases.filter(release => release.is_EP);
    
    // Sort by release date (newest first)
    return eps.sort((a, b) => {
      const dateA = new Date(a.date || "1900-01-01");
      const dateB = new Date(b.date || "1900-01-01");
      return dateB - dateA;
    });
  };

  const getPosts = () => {
    if (!artist || !artist.posts) return [];
    
    // Sort posts by time (newest first)
    return artist.posts.sort((a, b) => {
      const timeA = new Date(a.time || "1900-01-01");
      const timeB = new Date(b.time || "1900-01-01");
      return timeB - timeA;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!artist) return <div>No artist found.</div>;

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

      {/* Dropdown Section for Songs, Albums, EPs, and Posts */}
      <div style={{ marginTop: 40 }}>
        <h3>Content Library</h3>
        <div style={{ marginBottom: 20 }}>
          <select 
            value={activeSection} 
            onChange={(e) => setActiveSection(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              borderRadius: 8, 
              border: "1px solid #ddd",
              fontSize: 14,
              minWidth: 120
            }}
          >
            <option value="songs">Songs ({getAllSongs().length})</option>
            <option value="albums">Albums ({getAlbums().length})</option>
            <option value="eps">EPs ({getEPs().length})</option>
            <option value="posts">Posts ({getPosts().length})</option>
          </select>
        </div>

        {/* Songs Section */}
        {activeSection === "songs" && (
          <div>
            <h4>Songs ({getAllSongs().length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {getAllSongs().map((song, index) => (
                <div key={index} style={{ 
                  padding: 16, 
                  border: "1px solid #eee", 
                  borderRadius: 8,
                  display: "flex",
                  gap: 12,
                  alignItems: "center"
                }}>
                  <div style={{ flexShrink: 0 }}>
                    {song.pic && song.pic !== "0" && song.pic !== "1" && song.pic !== null ? (
                      <img 
                        src={song.pic} 
                        alt={song.name}
                        style={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: 6, 
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 6, 
                        background: "#f0f0f0", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: 24
                      }}>
                        🎵
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: "0 0 4px 0" }}>{song.name}</h5>
                    <p style={{ margin: "0 0 4px 0", fontSize: 14, color: "#666" }}>
                      From: {song.releaseName} ({song.releaseType})
                    </p>
                    <p style={{ margin: "0 0 4px 0", fontSize: 12, color: "#888" }}>
                      Release Date: {song.releaseDate || "N/A"}
                    </p>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      <span style={{ marginRight: 12 }}>⏱️ {song.time || "N/A"} min</span>
                      <span style={{ marginRight: 12 }}>🍎 {song.apl_plays || "N/A"}</span>
                      <span style={{ marginRight: 12 }}>🎵 {song.spt_plays || "N/A"}</span>
                      <span>🔊 {song.soundcloud_plays || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums Section */}
        {activeSection === "albums" && (
          <div>
            <h4>Albums ({getAlbums().length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {getAlbums().map((album, index) => (
                <div key={index} style={{ 
                  padding: 16, 
                  border: "1px solid #eee", 
                  borderRadius: 8
                }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0 }}>
                      {album.pic && album.pic !== "0" && album.pic !== "1" && album.pic !== null ? (
                        <img 
                          src={album.pic} 
                          alt={album.name}
                          style={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 8, 
                            objectFit: "cover"
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
                          fontSize: 32
                        }}>
                          💿
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: "0 0 8px 0" }}>{album.name}</h5>
                      <p style={{ margin: "0 0 4px 0", fontSize: 14, color: "#666" }}>
                        Release Date: {album.date || "N/A"}
                      </p>
                      <p style={{ margin: "0 0 4px 0", fontSize: 14, color: "#666" }}>
                        Duration: {album.time || "N/A"} minutes
                      </p>
                      <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                        Songs: {album.songs ? album.songs.length : 0}
                      </p>
                      {album.songs && album.songs.length > 0 && (
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {album.songs.slice(0, 3).map((song, songIndex) => (
                            <div key={songIndex} style={{ marginBottom: 2 }}>
                              • {song.name}
                            </div>
                          ))}
                          {album.songs.length > 3 && (
                            <div style={{ marginTop: 4, color: "#999" }}>
                              +{album.songs.length - 3} more songs
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EPs Section */}
        {activeSection === "eps" && (
          <div>
            <h4>EPs ({getEPs().length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {getEPs().map((ep, index) => (
                <div key={index} style={{ 
                  padding: 16, 
                  border: "1px solid #eee", 
                  borderRadius: 8
                }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0 }}>
                      {ep.pic && ep.pic !== "0" && ep.pic !== "1" && ep.pic !== null ? (
                        <img 
                          src={ep.pic} 
                          alt={ep.name}
                          style={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 8, 
                            objectFit: "cover"
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
                          fontSize: 32
                        }}>
                          📀
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: "0 0 8px 0" }}>{ep.name}</h5>
                      <p style={{ margin: "0 0 4px 0", fontSize: 14, color: "#666" }}>
                        Release Date: {ep.date || "N/A"}
                      </p>
                      <p style={{ margin: "0 0 4px 0", fontSize: 14, color: "#666" }}>
                        Duration: {ep.time || "N/A"} minutes
                      </p>
                      <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                        Songs: {ep.songs ? ep.songs.length : 0}
                      </p>
                      {ep.songs && ep.songs.length > 0 && (
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {ep.songs.slice(0, 3).map((song, songIndex) => (
                            <div key={songIndex} style={{ marginBottom: 2 }}>
                              • {song.name}
                            </div>
                          ))}
                          {ep.songs.length > 3 && (
                            <div style={{ marginTop: 4, color: "#999" }}>
                              +{ep.songs.length - 3} more songs
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {activeSection === "posts" && (
          <div>
            <h4>Posts ({getPosts().length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {getPosts().map((post, index) => (
                <div key={index} style={{ 
                  padding: 16, 
                  border: "1px solid #eee", 
                  borderRadius: 8
                }}>
                  <div style={{ marginBottom: 8 }}>
                    <h5 style={{ margin: "0 0 4px 0" }}>{post.post_title}</h5>
                    <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                      {new Date(post.time).toLocaleDateString()} at {new Date(post.time).toLocaleTimeString()}
                    </p>
                  </div>
                  <p style={{ margin: "0 0 8px 0", lineHeight: 1.5 }}>
                    {post.post_text}
                  </p>
                  {post.photo_path && (
                    <img 
                      src={post.photo_path} 
                      alt="Post"
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: 200, 
                        borderRadius: 8,
                        objectFit: "cover"
                      }}
                    />
                  )}
                  <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                    <span style={{ marginRight: 12 }}>❤️ {post.like_amount || 0} likes</span>
                    <span>💬 {post.comment_amount || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisplayArtist; 