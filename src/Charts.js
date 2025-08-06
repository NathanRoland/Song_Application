import React from "react";
import { Link } from "react-router-dom";

function Charts() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {/* Mini Bar */}
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
      <div style={{ textAlign: "center", color: "#888", fontSize: 20 }}>
        Select a chart above to view the latest rankings.
      </div>
    </div>
  );
}

export default Charts; 