import React, { useState, useEffect } from 'react';
import { useUser } from './userContext';
import axios from 'axios';
import './UserAccount.css';

const UserAccount = () => {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/account', {
        name: user.name,
        id: user.id
      });
      setUserInfo(response.data);
      setEditForm(response.data.user_info);
    } catch (err) {
      setError('Failed to load user information');
    } finally {
      setLoading(false);
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
      await axios.post('http://127.0.0.1:5000/account/edit', {
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
      </div>
    </div>
  );
};

export default UserAccount; 