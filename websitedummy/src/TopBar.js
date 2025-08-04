import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import SearchBar from "./SearchBar";

function TopBar() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav style={{
      width: "100%",
      background: "#222",
      padding: "16px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 24
      }}>
      <Link to="/" style={{ 
        color: "#fff", 
        textDecoration: "none", 
        display: "flex", 
        alignItems: "center",
        gap: "8px",
        fontWeight: 600, 
        fontSize: 18 
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        Home
      </Link>
      <Link to="/songs" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>Songs</Link>
      <Link to="/artists" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>Artists</Link>
      <Link to="/dubfinder" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>DubFinder</Link>
      <Link to="/playlists" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>Playlists</Link>
        <Link to="/charts" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>Charts</Link>
      </div>
      
      {/* Search Bar */}
      <SearchBar />
      
      {/* User Icon Dropdown */}
      <div style={{ position: "relative" }} ref={menuRef}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: 24,
            display: "flex",
            alignItems: "center"
          }}
          aria-label="Account menu"
        >
          {/* Simple user SVG icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
        </button>
        {menuOpen && (
          <div style={{
            position: "absolute",
            right: 0,
            top: 40,
            background: "#fff",
            color: "#222",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: 140,
            padding: 8,
            zIndex: 2000
          }}>
            {user ? (
              <>
                <Link to="/account" style={{ display: "block", padding: 8, textDecoration: "none", color: "#222", borderRadius: 4 }} onClick={() => setMenuOpen(false)}>Account</Link>
                <button onClick={handleLogout} style={{ display: "block", width: "100%", padding: 8, background: "none", border: "none", color: "#222", textAlign: "left", borderRadius: 4, cursor: "pointer" }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ display: "block", padding: 8, textDecoration: "none", color: "#222", borderRadius: 4 }} onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" style={{ display: "block", padding: 8, textDecoration: "none", color: "#222", borderRadius: 4 }} onClick={() => setMenuOpen(false)}>Signup</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopBar; 