import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function DisplaySong() {
  const { id } = useParams();
  const location = useLocation();
  const [song, setSong] = useState(location.state?.song || null);
  const [loading, setLoading] = useState(!location.state?.song);
  const [error, setError] = useState(null);
  const [artistNames, setArtistNames] = useState([]);
  const [releaseName, setReleaseName] = useState("");

  useEffect(() => {
    if (song) return; // Already have song data from state
    async function fetchSong() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${BASE_URL}/song/info`, { song_id: id });
        setSong(response.data.song);
      } catch (err) {
        setError("Failed to fetch song info.");
      } finally {
        setLoading(false);
      }
    }
    fetchSong();
  }, [id, song]);

  

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  if (error) return <div style={{ color: "#c33", textAlign: "center", marginTop: 40 }}>{error}</div>;
  if (!song) return null;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ flexShrink: 0 }}>
          {song.pic && song.pic !== "0" && song.pic !== "1" && song.pic !== null ? (
            <img 
              src={song.pic} 
              alt={song.name}
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: 12, 
                objectFit: "cover",
                border: "1px solid #eee"
              }}
            />
          ) : (
            <div style={{ 
              width: 120, 
              height: 120, 
              borderRadius: 12, 
              background: "#f0f0f0", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: 48,
              border: "1px solid #eee"
            }}>
              🎵
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "0 0 16px 0" }}>{song.name}</h2>
          <div style={{ marginBottom: 16 }}>
            <strong>Artists:</strong> {song.artist_names.length > 0 ? song.artist_names.join(", ") : "N/A"}
          </div>
      <div style={{ marginBottom: 8 }}><strong>Release Date:</strong> {song.release_date || "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>Duration:</strong> {song.time || "N/A"} seconds</div>
      <div style={{ marginBottom: 8 }}><strong>Status:</strong> {song.unreleased ? "Unreleased" : "Released"}</div>
      <div style={{ marginBottom: 8 }}><strong>Apple Plays:</strong> {song.apl_plays || "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>Spotify Plays:</strong> {song.spt_plays || "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>SoundCloud Plays:</strong> {song.soundcloud_plays || "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>Release:</strong> {song.release_name || "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>Likes:</strong> {song.likes || 0}</div>
      <div style={{ marginTop: 24 }}>
        <h4>Comments</h4>
        {song.comments && song.comments.length > 0 ? (
          <ul style={{ paddingLeft: 20 }}>
            {song.comments.map((comment, idx) => (
              <li key={idx}>{comment}</li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "#888" }}>No comments yet.</div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}

export default DisplaySong; 