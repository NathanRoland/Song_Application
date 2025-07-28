import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function DisplayRelease() {
  const { id } = useParams();
  const location = useLocation();
  const [release, setRelease] = useState(location.state?.release || null);
  const [loading, setLoading] = useState(!location.state?.release);
  const [error, setError] = useState(null);
  const [artistNames, setArtistNames] = useState([]);

  useEffect(() => {
    if (release) return; // Already have release data from state
    async function fetchRelease() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post("http://127.0.0.1:5000/release/info", { release_id: id });
        setRelease(response.data.release);
      } catch (err) {
        setError("Failed to fetch release info.");
      } finally {
        setLoading(false);
      }
    }
    fetchRelease();
  }, [id, release]);

  

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  if (error) return <div style={{ color: "#c33", textAlign: "center", marginTop: 40 }}>{error}</div>;
  if (!release) return null;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>{release.name}</h2>
      <div style={{ marginBottom: 8 }}><strong>Artists:</strong> {release.artist_names.length > 0 ? release.artist_names.join(", ") : "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>Release Date:</strong> {release.release_date || "N/A"}</div>
      <div style={{ marginBottom: 8 }}><strong>Duration:</strong> {release.time || "N/A"} seconds</div>
      <div style={{ marginBottom: 8 }}><strong>Status:</strong> {release.unreleased ? "Unreleased" : "Released"}</div>
      <div style={{ marginBottom: 8 }}><strong>Type:</strong> {release.is_album ? "Album" : release.is_EP ? "EP" : release.is_Song ? "Song" : "Unknown"}</div>
      <div style={{ marginBottom: 8 }}><strong>Likes:</strong> {release.likes || 0}</div>
      <div style={{ marginTop: 24 }}>
        <h4>Comments</h4>
        {release.comments && release.comments.length > 0 ? (
          <ul style={{ paddingLeft: 20 }}>
            {release.comments.map((comment, idx) => (
              <li key={idx}>{comment}</li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "#888" }}>No comments yet.</div>
        )}
      </div>
    </div>
  );
}

export default DisplayRelease; 