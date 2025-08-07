import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from './config';

function Artists() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await axios.post(`${API_BASE_URL}/artists`, {
        artist: search,
      });
      if (response.data && response.data.artists) {
        setResults(response.data.artists);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Failed to fetch artists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Search Artists</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Type an artist name..."
          style={{ flex: 1, padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "12px 24px", fontSize: 16, borderRadius: 6, background: "#222", color: "#fff", border: "none", cursor: "pointer" }}>
          Search
        </button>
      </form>
      {loading && <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>}
      {error && <div style={{ textAlign: "center", color: "red" }}>{error}</div>}
      {!loading && !error && results.length === 0 && (
        <div style={{ textAlign: "center", color: "#888" }}>No results yet.</div>
      )}
      {!loading && !error && results.length > 0 && (
        <div>
          <h3 style={{ textAlign: "center" }}>Results</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {results.map((artist) => (
              <li key={artist.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                <Link to={`/artist/${artist.id}`} style={{ textDecoration: "none", color: "#222" }}>
                  {artist.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Artists; 