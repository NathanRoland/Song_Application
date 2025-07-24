import React, { useState } from "react";

function Artists() {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add search logic here
    alert(`Searching for artist: ${search}`);
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
      {/* Placeholder for search results */}
      <div style={{ textAlign: "center", color: "#888" }}>
        No results yet.
      </div>
    </div>
  );
}

export default Artists; 