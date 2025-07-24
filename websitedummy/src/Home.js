import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./userContext";

function Home() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close dropdown on outside click
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
    <div>
      {/* Main Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", marginTop: 80 }}>
        <h1>Welcome to Song Application!</h1>
        <p style={{ maxWidth: 600, textAlign: "center", fontSize: 18 }}>
          Discover, share, and comment on your favorite songs, albums, and playlists. Connect with other music lovers and explore a world of music together!
        </p>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button style={{ marginTop: 24, padding: "12px 32px", fontSize: 16, borderRadius: 8, cursor: "pointer" }}>
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;