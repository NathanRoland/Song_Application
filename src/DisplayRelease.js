import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "./userContext";
import axios from "axios";
import { API_BASE_URL } from './config';

function DisplayRelease() {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artistNames, setArtistNames] = useState([]);

  useEffect(() => {
    async function fetchRelease() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/release/info`, { release_id: id });
        setRelease(response.data.release);
      } catch (err) {
        setError("Failed to fetch release info.");
      } finally {
        setLoading(false);
      }
    }
    fetchRelease();
  }, [id]);

  

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;
  if (error) return <div style={{ color: "#c33", textAlign: "center", marginTop: 40 }}>{error}</div>;
  if (!release) return null;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ flexShrink: 0 }}>
          {release.pic && release.pic !== "0" && release.pic !== "1" && release.pic !== null ? (
            <img 
              src={release.pic} 
              alt={release.name}
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
          <h2 style={{ margin: "0 0 16px 0" }}>{release.name}</h2>
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
      </div>
    </div>
  );
}

export default DisplayRelease; 