import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from './userContext';
import axios from 'axios';
import './PostView.css';

// Comment component for recursive rendering
const Comment = ({ comment, onReply, replyingTo, replyText, setReplyText, onSubmitReply, onCancelReply, submittingReply, formatTime }) => {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-author">
          <div className="comment-avatar">
            {comment.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="comment-info">
            <span className="comment-author-name">
              {comment.username || `User ${comment.user_id}`}
            </span>
            <span className="comment-time">
              {formatTime(comment.time)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="comment-body">
        <p className="comment-text">{comment.comment_text}</p>
      </div>
      
      <div className="comment-actions">
        <span className="comment-likes">❤️ {comment.likes || 0}</span>
        <button 
          className="reply-button"
          onClick={() => onReply(comment.comment_id)}
        >
          💬 Reply
        </button>
      </div>

      {/* Reply form */}
      {replyingTo === comment.comment_id && (
        <div className="reply-form">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="reply-input"
            rows="2"
          />
          <div className="reply-actions">
            <button 
              onClick={() => onSubmitReply(comment.comment_id)}
              disabled={submittingReply || !replyText.trim()}
              className="submit-reply-button"
            >
              {submittingReply ? 'Posting...' : 'Post Reply'}
            </button>
            <button 
              onClick={onCancelReply}
              className="cancel-reply-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map((reply, index) => (
            <Comment 
              key={reply.comment_id}
              comment={reply}
              onReply={onReply}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
              submittingReply={submittingReply}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PostView = () => {
  const { postId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/post/view', {
        post_id: postId
      });
      setPost(response.data.post_info);
      setComments(response.data.post_info.comments || []);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const userId = typeof user === 'string' ? user : user.id || user;
      await axios.post('http://127.0.0.1:5000/post/like', {
        user_id: userId,
        post_id: postId
      });
      // Refresh post to update like count
      fetchPost();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const userId = typeof user === 'string' ? user : user.id || user;
      await axios.post('http://127.0.0.1:5000/post/view/add_comment', {
        user_id: userId,
        post_id: postId,
        comment_text: newComment.trim(),
        parent_comment_id: 0
      });
      
      setNewComment('');
      // Refresh post to get new comments
      fetchPost();
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    if (!user) {
      alert('Please log in to reply');
      return;
    }

    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      setSubmittingReply(true);
      const userId = typeof user === 'string' ? user : user.id || user;
      await axios.post('http://127.0.0.1:5000/post/view/add_comment', {
        user_id: userId,
        post_id: postId,
        comment_text: replyText.trim(),
        parent_comment_id: parentCommentId
      });
      
      setReplyText('');
      setReplyingTo(null);
      // Refresh post to get new comments
      fetchPost();
    } catch (err) {
      console.error('Failed to add reply:', err);
      alert('Failed to add reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
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
      <div className="post-view-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-view-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-view-container">
        <div className="error-message">
          <p>Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-view-container">
      <div className="post-view-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1>📰 Post View</h1>
      </div>

      <div className="post-content">
        <div className="post-card">
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

          <div className="post-body">
            <h2 className="post-title">{post.post_title}</h2>
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
              <span className="likes-count">❤️ {post.likes_amount || 0} likes</span>
              <span className="comments-count">💬 {post.comments_amount || 0} comments</span>
            </div>
            
            <div className="action-buttons">
              <button 
                className="like-button"
                onClick={handleLikePost}
              >
                ❤️ Like
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>💬 Comments ({comments.length})</h3>
          
          {/* Add Comment */}
          {user && (
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                rows="3"
              />
              <button 
                onClick={handleAddComment}
                disabled={submittingComment || !newComment.trim()}
                className="add-comment-button"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <Comment 
                  key={comment.comment_id}
                  comment={comment}
                  onReply={handleReplyClick}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onSubmitReply={handleAddReply}
                  onCancelReply={handleCancelReply}
                  submittingReply={submittingReply}
                  formatTime={formatTime}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView; 