import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Global200Chart() {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/charts/billboard/global-200")
      .then(res => {
        setChart(res.data.chart);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load chart.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {/* Main Mini Bar */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        marginBottom: 16,
        padding: "12px 0",
        borderBottom: "1px solid #eee"
      }}>
        <Link to="/charts/spotify" style={{ textDecoration: "none", color: "#1DB954", fontWeight: 600, fontSize: 18 }}>Spotify</Link>
        <Link to="/charts/billboard/hot-100" style={{ textDecoration: "none", color: "#222", fontWeight: 600, fontSize: 18 }}>Billboard</Link>
        <Link to="/charts/applemusic" style={{ textDecoration: "none", color: "#FA57C1", fontWeight: 600, fontSize: 18 }}>Apple Music</Link>
        <Link to="/charts/soundcloud" style={{ textDecoration: "none", color: "#FF5500", fontWeight: 600, fontSize: 18 }}>SoundCloud</Link>
      </div>
      {/* Billboard Mini Chart Bar */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        marginBottom: 32,
        padding: "8px 0",
        background: "#f7f7f7",
        borderRadius: 8
      }}>
        <span style={{ fontWeight: 600, color: "#222", marginRight: 8 }}>Billboard:</span>
        <Link to="/charts/billboard/hot-100" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Hot 100</Link>
        <Link to="/charts/billboard/200" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Billboard 200</Link>
        <Link to="/charts/billboard/global-200" style={{ textDecoration: "none", color: "#222", fontWeight: 500 }}>Global 200</Link>
      </div>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Billboard Global 200</h2>
      {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      {chart && chart.entries && (
        <ol style={{ paddingLeft: 24 }}>
          {chart.entries.map((entry, idx) => (
            <li key={idx} style={{ marginBottom: 12 }}>
              <b>#{entry.rank}</b> {entry.title} <span style={{ color: "#888" }}>by {entry.artist}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Global200Chart; 