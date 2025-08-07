import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./userContext";
import PostModal from "./PostModal";
import Feed from "./Feed";

function Home() {
  const { user } = useUser();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const feedRef = useRef();

  const handlePostClick = () => {
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handlePostCreated = () => {
    // Refresh the feed when a post is created
    if (feedRef.current && feedRef.current.fetchFeed) {
      feedRef.current.fetchFeed();
    }
  };

  // If user is not logged in, show the welcome page
  if (!user) {
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

  // If user is logged in, show feed with post button
  return (
    <div style={{ 
      backgroundColor: "white", 
      minHeight: "100vh", 
      position: "relative",
      marginTop: 80 
    }}>
      {/* Post Button */}
      <button 
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "12px 24px",
          backgroundColor: "#1db954",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1ed760";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#1db954";
          e.target.style.transform = "translateY(0)";
        }}
        onClick={handlePostClick}
      >
        📝 Post
      </button>

      {/* Feed Component */}
      <Feed ref={feedRef} />

      {/* Post Modal */}
      <PostModal 
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

export default Home;