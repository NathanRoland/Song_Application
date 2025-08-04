import React, { useState, useEffect } from 'react';
import { useUser } from './userContext';
import axios from 'axios';
import PostModal from './PostModal';
import './Feed.css';

const Feed = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/feed', {
        user_id: user.id
      });
      setPosts(response.data.posts || []);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (postId) => {
    setSelectedPostId(postId);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPostId(null);
    // Refresh feed after viewing post
    fetchFeed();
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post('http://127.0.0.1:5000/post/like', {
        user_id: user.id,
        post_id: postId
      });
      // Refresh feed to update like count
      fetchFeed();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Unknown time';
    
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading-spinner"></div>
        <p>Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>📰 Your Feed</h2>
        <p>Posts from you and your friends</p>
      </div>

      {posts.length === 0 ? (
        <div className="empty-feed">
          <div className="empty-feed-icon">📭</div>
          <h3>No posts yet</h3>
          <p>Be the first to share something! Click the "Post" button to get started.</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.post_id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <div className="author-avatar">
                    {post.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{post.username || `User ${post.user_id}`}</span>
                    <span className="post-time">{formatTime(post.time)}</span>
                  </div>
                </div>
              </div>

              <div className="post-content">
                <h3 className="post-title">{post.post_title}</h3>
                <p className="post-text">{post.post_text}</p>
                {post.photo_path && (
                  <div className="post-photo">
                    <img 
                      src={`http://127.0.0.1:5000/${post.photo_path}`} 
                      alt="Post photo" 
                      className="post-image"
                    />
                  </div>
                )}
              </div>

              <div className="post-actions">
                               <div className="post-stats">
                 <span className="likes-count">❤️ {post.likes || 0}</span>
                 <span className="comments-count">💬 {post.comments || 0}</span>
               </div>
                
                <div className="action-buttons">
                  <button 
                    className="like-button"
                    onClick={() => handleLikePost(post.post_id)}
                  >
                    ❤️ Like
                  </button>
                  <button 
                    className="view-button"
                    onClick={() => handleViewPost(post.post_id)}
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal for viewing posts */}
      <PostModal 
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        postId={selectedPostId}
      />
    </div>
  );
};

export default Feed; 