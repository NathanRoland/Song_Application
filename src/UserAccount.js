import React, { useState, useEffect } from 'react';
import { useUser } from './userContext';
import axios from 'axios';
import './UserAccount.css';

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const UserAccount = () => {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [friendRequestsLoading, setFriendRequestsLoading] = useState(false);
  const [friendRequestsError, setFriendRequestsError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);

  useEffect(() => {
    if (user && user !== '') {
      fetchUserInfo();
      // fetchFriendRequests(); // Commented out since we get friend requests from main account endpoint
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/account`, {
        name: typeof user === 'string' ? user : user.name || user,
        id: typeof user === 'object' && user.id ? user.id : user
      });
      console.log('Account response:', response.data);
      setUserInfo(response.data);
      setEditForm(response.data.user_info);
      
      // Set friends and friend requests from the response
      if (response.data.friends) {
        setFriends(response.data.friends);
      }
      if (response.data.friend_requests) {
        setFriendRequests({
          received: response.data.friend_requests,
          sent: [] // The backend doesn't return sent requests in this endpoint
        });
      }
    } catch (err) {
      setError('Failed to load user information');
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setFriendRequestsLoading(true);
      setFriendRequestsError(null);
      
      const userId = typeof user === 'object' && user.id ? user.id : user;
      if (!userId) {
        throw new Error('No valid user ID');
      }
      
      const response = await axios.post(`${BASE_URL}/account/friend_requests`, {
        user_id: userId
      });
      setFriendRequests(response.data);
    } catch (err) {
      console.error('Failed to load friend requests:', err);
      setFriendRequestsError('Failed to load friend requests');
      // Set default empty state to prevent undefined errors
      setFriendRequests({ received: [], sent: [] });
    } finally {
      setFriendRequestsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(userInfo.user_info);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/account/edit`, {
        name: user.name,
        id: user.id,
        ...editForm
      });
      
      // Refresh user info
      await fetchUserInfo();
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAcceptFriendRequest = async (username) => {
    try {
      const currentUserId = typeof user === 'object' && user.id ? user.id : user;
      const friendUserId = await getUserIdByUsername(username);
      
      if (!friendUserId) {
        alert('Could not find user');
        return;
      }
      
      await axios.post(`${BASE_URL}/account/view/accept_friend`, {
        user_id: currentUserId,
        friend_id: friendUserId
      });
      
      // Refresh user info to get updated friends and friend requests
      await fetchUserInfo();
      alert('Friend request accepted!');
    } catch (err) {
      alert('Failed to accept friend request');
    }
  };

  const handleRejectFriendRequest = async (username) => {
    try {
      const currentUserId = typeof user === 'object' && user.id ? user.id : user;
      const friendUserId = await getUserIdByUsername(username);
      
      if (!friendUserId) {
        alert('Could not find user');
        return;
      }
      
      await axios.post(`${BASE_URL}/account/view/reject_friend`, {
        user_id: currentUserId,
        friend_id: friendUserId
      });
      
      // Refresh user info to get updated friends and friend requests
      await fetchUserInfo();
      alert('Friend request rejected');
    } catch (err) {
      alert('Failed to reject friend request');
    }
  };

  const handleRemoveSentRequest = async (username) => {
    try {
      const currentUserId = typeof user === 'object' && user.id ? user.id : user;
      const friendUserId = await getUserIdByUsername(username);
      
      if (!friendUserId) {
        alert('Could not find user');
        return;
      }
      
      await axios.post(`${BASE_URL}/account/remove_sent_request`, {
        user_id: currentUserId,
        friend_id: friendUserId
      });
      
      // Refresh user info to get updated friends and friend requests
      await fetchUserInfo();
      alert('Friend request removed');
    } catch (err) {
      alert('Failed to remove friend request');
    }
  };

  const getUserIdByUsername = async (username) => {
    try {
      const response = await axios.post(`${BASE_URL}/account/get_user_id_by_username`, {
        username: username
      });
      return response.data.user_id;
    } catch (err) {
      console.error('Failed to get user ID:', err);
      return null;
    }
  };

  const handleViewFriendProfile = (username) => {
    // Navigate to the friend's profile page
    // This would typically use React Router navigation
    window.location.href = `/user/${username}`;
  };

  if (!user) {
    return (
      <div className="user-account-container">
        <div className="error-message">
          <p>Please log in to view your account.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-account-container">
        <div className="loading-spinner"></div>
        <p>Loading account information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-account-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const isArtist = userInfo?.is_artist;

  return (
    <div className="user-account-container">
      <div className="account-header">
        <h1>👤 Account Profile</h1>
        <div className="user-type-badge">
          {isArtist ? '🎵 Artist' : '👤 User'}
        </div>
      </div>

      <div className="account-content">
        <div className="profile-section">
          <div className="profile-picture">
            {userInfo?.user_info?.pfp_path ? (
              <img src={userInfo.user_info.pfp_path} alt="Profile" />
            ) : (
              <div className="default-avatar">
                {userInfo?.user_info?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h2>{userInfo?.user_info?.username}</h2>
            <p className="bio">
              {userInfo?.user_info?.bio || 'No bio yet'}
            </p>
          </div>
        </div>

        <div className="account-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-button">
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-button">
                💾 Save Changes
              </button>
              <button onClick={handleCancel} className="cancel-button">
                ❌ Cancel
              </button>
            </div>
          )}
        </div>

        <div className="account-details">
          <h3>Account Information</h3>
          
          <div className="details-grid">
            <div className="detail-item">
              <label>Username:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{userInfo?.user_info?.username}</span>
              )}
            </div>

            <div className="detail-item">
              <label>Bio:</label>
              {isEditing ? (
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="edit-textarea"
                  rows="3"
                />
              ) : (
                <span>{userInfo?.user_info?.bio || 'No bio'}</span>
              )}
            </div>

            {!isArtist && (
              <>
                <div className="detail-item">
                  <label>Favorite Artist:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fav_artist || ''}
                      onChange={(e) => handleInputChange('fav_artist', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{userInfo?.user_info?.fav_artist || 'Not set'}</span>
                  )}
                </div>

                <div className="detail-item">
                  <label>Favorite Song:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fav_song || ''}
                      onChange={(e) => handleInputChange('fav_song', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{userInfo?.user_info?.fav_song || 'Not set'}</span>
                  )}
                </div>
              </>
            )}

            <div className="detail-item">
              <label>Instagram:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.insta_link || ''}
                  onChange={(e) => handleInputChange('insta_link', e.target.value)}
                  className="edit-input"
                  placeholder="https://instagram.com/username"
                />
              ) : (
                <span>
                  {userInfo?.user_info?.insta_link ? (
                    <a href={userInfo.user_info.insta_link} target="_blank" rel="noopener noreferrer">
                      {userInfo.user_info.insta_link}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </span>
              )}
            </div>

            <div className="detail-item">
              <label>Spotify:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.spotify_link || ''}
                  onChange={(e) => handleInputChange('spotify_link', e.target.value)}
                  className="edit-input"
                  placeholder="https://open.spotify.com/user/username"
                />
              ) : (
                <span>
                  {userInfo?.user_info?.spotify_link ? (
                    <a href={userInfo.user_info.spotify_link} target="_blank" rel="noopener noreferrer">
                      {userInfo.user_info.spotify_link}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </span>
              )}
            </div>

            <div className="detail-item">
              <label>Apple Music:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.apple_music_link || ''}
                  onChange={(e) => handleInputChange('apple_music_link', e.target.value)}
                  className="edit-input"
                  placeholder="https://music.apple.com/profile/username"
                />
              ) : (
                <span>
                  {userInfo?.user_info?.apple_music_link ? (
                    <a href={userInfo.user_info.apple_music_link} target="_blank" rel="noopener noreferrer">
                      {userInfo.user_info.apple_music_link}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </span>
              )}
            </div>

            <div className="detail-item">
              <label>SoundCloud:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.soundcloud_link || ''}
                  onChange={(e) => handleInputChange('soundcloud_link', e.target.value)}
                  className="edit-input"
                  placeholder="https://soundcloud.com/username"
                />
              ) : (
                <span>
                  {userInfo?.user_info?.soundcloud_link ? (
                    <a href={userInfo.user_info.soundcloud_link} target="_blank" rel="noopener noreferrer">
                      {userInfo.user_info.soundcloud_link}
                    </a>
                  ) : (
                    'Not set'
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Friends Section */}
        {user && (
          <div className="friends-section">
            <h3>👥 My Friends ({friends?.length || 0})</h3>
            {friends?.length > 0 ? (
              <div className="friends-list">
                {friends.map((friend, index) => (
                  <div key={index} className="friend-item">
                    <span className="friend-username">{friend.username}</span>
                    <div className="friend-actions">
                      <button 
                        onClick={() => handleViewFriendProfile(friend.username)}
                        className="view-profile-button"
                      >
                        👤 View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-friends">You don't have any friends yet. Start connecting with other users!</p>
            )}
          </div>
        )}

        {/* Friend Requests Section */}
        {user && (
          <div className="friend-requests-section">
            <h3>👥 Friend Requests</h3>
            
            {friendRequestsLoading ? (
              <div className="loading-spinner"></div>
            ) : friendRequestsError ? (
              <div className="error-message">
                <p>{friendRequestsError}</p>
              </div>
            ) : (
              <div className="friend-requests-content">
                {/* Received Friend Requests */}
                <div className="received-requests">
                  <h4>📥 Received Requests ({friendRequests?.received?.length || 0})</h4>
                  {friendRequests?.received?.length > 0 ? (
                    <div className="requests-list">
                      {friendRequests.received.map((request, index) => (
                        <div key={index} className="request-item">
                          <span className="request-username">{request.username}</span>
                          <div className="request-actions">
                            <button 
                              onClick={() => handleAcceptFriendRequest(request.username)}
                              className="accept-button"
                            >
                              ✅ Accept
                            </button>
                            <button 
                              onClick={() => handleRejectFriendRequest(request.username)}
                              className="reject-button"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-requests">No received friend requests</p>
                  )}
                </div>

                {/* Sent Friend Requests */}
                <div className="sent-requests">
                  <h4>📤 Sent Requests ({friendRequests?.sent?.length || 0})</h4>
                  {friendRequests?.sent?.length > 0 ? (
                    <div className="requests-list">
                      {friendRequests.sent.map((request, index) => (
                        <div key={index} className="request-item">
                          <span className="request-username">{request.username}</span>
                          <div className="request-actions">
                            <button 
                              onClick={() => handleRemoveSentRequest(request.username)}
                              className="remove-button"
                            >
                              🗑️ Remove Request
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-requests">No sent friend requests</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        {userInfo?.posts && userInfo.posts.length > 0 && (
          <div className="posts-section">
            <h3>📝 My Posts ({userInfo.posts.length})</h3>
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

        {userInfo?.posts && userInfo.posts.length === 0 && (
          <div className="posts-section">
            <h3>📝 My Posts</h3>
            <div className="no-posts">
              <p>You haven't made any posts yet.</p>
              <p>Start sharing your thoughts and music!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount; 