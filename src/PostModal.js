import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from './userContext';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './PostModal.css';

const PostModal = ({ isOpen, onClose, postId = null, onPostCreated }) => {
  const { user } = useUser();
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [isCreating, setIsCreating] = useState(!postId);
  const [postData, setPostData] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/post/view`, {
        post_id: postId
      });
      setPostData(response.data.post_info);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isOpen && postId) {
      fetchPost();
    }
  }, [isOpen, postId, fetchPost]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postText.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('post_title', postTitle);
      formData.append('post_text', postText);
      
      if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
      }

      const response = await axios.post(`${API_BASE_URL}/post/publish`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Reset form and close modal
        setPostTitle('');
        setPostText('');
        setSelectedPhoto(null);
        setPhotoPreview(null);
        onClose();
        // Optionally refresh the feed or show success message
        if (onPostCreated) {
          onPostCreated();
        }
        // Show success message (you could add a toast notification here)
        console.log('Post published successfully!');
      }
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setError('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // You'll need to implement this endpoint
      await axios.post(`${API_BASE_URL}/post/comment`, {
        user_id: user.id,
        post_id: postId,
        comment_text: commentText
      });

      setCommentText('');
      // Refresh post data to show new comment
      await fetchPost();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPostTitle('');
    setPostText('');
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setCommentText('');
    setError(null);
    setPostData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isCreating ? 'Create New Post' : 'View Post'}</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {isCreating ? (
          // Create Post Form
          <div className="create-post-form">
            <div className="form-group">
              <label htmlFor="post-title">Title:</label>
              <input
                id="post-title"
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Enter post title..."
                className="post-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="post-text">Content:</label>
              <textarea
                id="post-text"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Write your post content..."
                className="post-textarea"
                rows="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="post-photo">Photo (optional):</label>
              <input
                id="post-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="photo-input"
              />
              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="remove-photo"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                className="cancel-button" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="publish-button" 
                onClick={handleCreatePost}
                disabled={loading}
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        ) : (
          // View Post Content
          <div className="view-post-content">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : postData ? (
              <>
                <div className="post-header">
                  <h3>{postData.post_title}</h3>
                                     <div className="post-meta">
                     <span className="post-time">{postData.time}</span>
                     <span className="post-stats">
                       ❤️ {postData.likes} • 💬 {postData.comments}
                     </span>
                   </div>
                </div>

                <div className="post-content">
                  <p>{postData.post_text}</p>
                  {postData.photo_path && (
                    <div className="post-photo">
                      <img 
                        src={`${API_BASE_URL}/${postData.photo_path}`} 
                        alt="" 
                        className="post-image"
                      />
                    </div>
                  )}
                </div>

                                 <div className="comments-section">
                   <h4>Comments ({postData.comments})</h4>
                  
                  <div className="add-comment">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="comment-input"
                      rows="3"
                    />
                    <button 
                      className="comment-button"
                      onClick={handleAddComment}
                      disabled={loading}
                    >
                      {loading ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>

                  <div className="comments-list">
                    {postData.comments && postData.comments.length > 0 ? (
                      postData.comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-user">User {comment.user_id}</span>
                            <span className="comment-time">{comment.time}</span>
                          </div>
                          <p className="comment-text">{comment.comment_text}</p>
                          <div className="comment-actions">
                            <button className="like-button">❤️ {comment.likes}</button>
                            <button className="reply-button">Reply</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>Post not found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal; 