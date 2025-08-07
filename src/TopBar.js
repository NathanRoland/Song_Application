import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./userContext";
import SearchBar from "./SearchBar";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function TopBar() {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setUserInfo(null);
    setMenuOpen(false);
    navigate("/");
  };

  const fetchUserInfo = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userName = typeof user === 'string' ? user : user.name || user;
      const userId = typeof user === 'object' && user.id ? user.id : user;
      
      const response = await axios.post(`${BASE_URL}/account`, {
        name: userName,
        id: userId
      });
      setUserInfo(response.data.user_info);
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (menuOpen && user && !userInfo) {
      fetchUserInfo();
    }
  }, [menuOpen, user]);

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
      {/* Left side - Navigation links */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexShrink: 0
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
      
      {/* Center - Search Bar */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", margin: "0 20px" }}>
        <SearchBar />
      </div>
      
      {/* Right side - User Icon Dropdown */}
      <div style={{ 
        position: "relative", 
        display: "flex",
        alignItems: "center",
        flexShrink: 0
      }} ref={menuRef}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={(e) => e.target.style.background = "transparent"}
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
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            minWidth: 280,
            padding: 0,
            zIndex: 2000,
            border: "1px solid #e9ecef"
          }}>
            {user ? (
              <>
                {/* User Info Section */}
                <div style={{
                  padding: "16px",
                  borderBottom: "1px solid #e9ecef",
                  background: "#f8f9fa"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#1db954",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px"
                    }}>
                      {typeof user === 'string' ? user.charAt(0).toUpperCase() : 
                       typeof user === 'object' && user.name ? user.name.charAt(0).toUpperCase() : 
                       'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>
                        {typeof user === 'string' ? user : 
                         typeof user === 'object' && user.name ? user.name : 
                         'User'}
                      </div>
                      {loading ? (
                        <div style={{ fontSize: "12px", color: "#666" }}>Loading...</div>
                      ) : userInfo?.bio ? (
                        <div style={{ 
                          fontSize: "12px", 
                          color: "#666",
                          lineHeight: "1.4",
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {userInfo.bio}
                        </div>
                      ) : (
                        <div style={{ fontSize: "12px", color: "#666" }}>No bio set</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div style={{ padding: "8px" }}>
                  <Link 
                    to="/account" 
                    style={{ 
                      display: "flex", 
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px", 
                      textDecoration: "none", 
                      color: "#333", 
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease"
                    }} 
                    onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Account Settings
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center",
                      gap: "12px",
                      width: "100%", 
                      padding: "12px", 
                      background: "none", 
                      border: "none", 
                      color: "#dc3545", 
                      textAlign: "left", 
                      borderRadius: "8px", 
                      cursor: "pointer",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#fff5f5"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "8px" }}>
                <Link 
                  to="/login" 
                  style={{ 
                    display: "flex", 
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px", 
                    textDecoration: "none", 
                    color: "#333", 
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease"
                  }} 
                  onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Login
                </Link>
                
                <Link 
                  to="/signup" 
                  style={{ 
                    display: "flex", 
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px", 
                    textDecoration: "none", 
                    color: "#333", 
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease"
                  }} 
                  onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopBar; 