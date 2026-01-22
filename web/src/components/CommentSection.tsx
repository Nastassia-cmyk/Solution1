import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/CommentSection.css';

interface CommentSectionProps {
  taskId: string;
  teamMembers: string[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ taskId, teamMembers }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const { comments, loadComments, addComment, deleteComment, loading } = useAppContext();
  const taskComments = comments.get(taskId) || [];

  useEffect(() => {
    loadComments(taskId);
  }, [taskId, loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addComment(taskId, { author, text });
      setText('');
    } catch (err) {
      // Error handled by context
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(taskId, commentId);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="comment-section">
      <h5>Comments ({taskComments.length})</h5>
      
      <div className="comments-list">
        {taskComments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong>{comment.author}</strong>
              <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
              <button
                className="comment-delete-btn"
                onClick={() => handleDeleteComment(comment.id)}
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <p className="comment-text">{comment.text}</p>
          </div>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor={`author-${taskId}`}>Your name</label>
          <select
            id={`author-${taskId}`}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          >
            <option value="">Select your name</option>
            {teamMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor={`text-${taskId}`}>Comment</label>
          <textarea
            id={`text-${taskId}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};
