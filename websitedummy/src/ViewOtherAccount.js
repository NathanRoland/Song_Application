import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './userContext';
import axios from 'axios';
import './ViewOtherAccount.css';

const ViewOtherAccount = () => {
  const { user } = useUser();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/account/view', {
        user_id: userId
      });
      setUserInfo(response.data);
    } catch (err) {
      setError('Failed to load user information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!user) {
      alert('Please log in to add friends');
      return;
    }

    try {
      const currentUserId = typeof user === 'string' ? user : user.id || user;
      await axios.post('http://127.0.0.1:5000/account/view/add_friend', {
        user_id: currentUserId,
        friend_id: userId
      });
      alert('Friend added successfully!');
    } catch (err) {
      alert('Failed to add friend');
    }
  };

  if (loading) {
    return (
      <div className="view-account-container">
        <div className="loading-spinner"></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-account-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="view-account-container">
        <div className="error-message">
          <p>User not found.</p>
        </div>
      </div>
    );
  }

  const isCurrentUser = user && (typeof user === 'string' ? user === userInfo.user_info.username : user.name === userInfo.user_info.username);

  return (
    <div className="view-account-container">
      <div className="account-header">
        <h1>👤 {userInfo.user_info.username}'s Profile</h1>
        {!isCurrentUser && user && (
          <button onClick={handleAddFriend} className="add-friend-button">
            👥 Add Friend
          </button>
        )}
      </div>

      <div className="account-content">
        <div className="profile-section">
          <div className="profile-picture">
            {userInfo.user_info.pfp_path ? (
              <img src={userInfo.user_info.pfp_path} alt="Profile" />
            ) : (
              <div className="default-avatar">
                {userInfo.user_info.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h2>{userInfo.user_info.username}</h2>
            <p className="bio">
              {userInfo.user_info.bio || 'No bio yet'}
            </p>
          </div>
        </div>

        <div className="account-details">
          <h3>Profile Information</h3>
          
          <div className="details-grid">
            <div className="detail-item">
              <label>Username:</label>
              <span>{userInfo.user_info.username}</span>
            </div>

            <div className="detail-item">
              <label>Bio:</label>
              <span>{userInfo.user_info.bio || 'No bio'}</span>
            </div>

            {userInfo.user_info.fav_artist && (
              <div className="detail-item">
                <label>Favorite Artist:</label>
                <span>{userInfo.user_info.fav_artist}</span>
              </div>
            )}

            {userInfo.user_info.fav_song && (
              <div className="detail-item">
                <label>Favorite Song:</label>
                <span>{userInfo.user_info.fav_song}</span>
              </div>
            )}

            <div className="detail-item">
              <label>Instagram:</label>
              <span>
                {userInfo.user_info.insta_link ? (
                  <a href={userInfo.user_info.insta_link} target="_blank" rel="noopener noreferrer">
                    {userInfo.user_info.insta_link}
                  </a>
                ) : (
                  'Not set'
                )}
              </span>
            </div>

            <div className="detail-item">
              <label>Spotify:</label>
              <span>
                {userInfo.user_info.spotify_link ? (
                  <a href={userInfo.user_info.spotify_link} target="_blank" rel="noopener noreferrer">
                    {userInfo.user_info.spotify_link}
                  </a>
                ) : (
                  'Not set'
                )}
              </span>
            </div>

            <div className="detail-item">
              <label>Apple Music:</label>
              <span>
                {userInfo.user_info.apple_music_link ? (
                  <a href={userInfo.user_info.apple_music_link} target="_blank" rel="noopener noreferrer">
                    {userInfo.user_info.apple_music_link}
                  </a>
                ) : (
                  'Not set'
                )}
              </span>
            </div>

            <div className="detail-item">
              <label>SoundCloud:</label>
              <span>
                {userInfo.user_info.soundcloud_link ? (
                  <a href={userInfo.user_info.soundcloud_link} target="_blank" rel="noopener noreferrer">
                    {userInfo.user_info.soundcloud_link}
                  </a>
                ) : (
                  'Not set'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        {userInfo.posts && userInfo.posts.length > 0 && (
          <div className="posts-section">
            <h3>📝 {userInfo.user_info.username}'s Posts ({userInfo.posts.length})</h3>
            <div className="posts-grid">
              {userInfo.posts.map((post, index) => (
                <div key={index} className="post-card">
                  <div className="post-header">
                    <h4 className="post-title">{post.post_title}</h4>
                    <span className="post-date">
                      {new Date(post.time).toLocaleDateString()} at {new Date(post.time).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="post-content">
                    <p className="post-text">{post.post_text}</p>
                    {post.photo_path && (
                      <div className="post-image">
                        <img 
                          src={post.photo_path} 
                          alt="Post" 
                          className="post-photo"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="post-stats">
                    <span className="post-likes">❤️ {post.like_amount || 0} likes</span>
                    <span className="post-comments">💬 {post.comment_amount || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userInfo.posts && userInfo.posts.length === 0 && (
          <div className="posts-section">
            <h3>📝 {userInfo.user_info.username}'s Posts</h3>
            <div className="no-posts">
              <p>This user hasn't made any posts yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOtherAccount; 