import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { User } from '../types';
import '../styles/TaskForm.css';

interface TaskFormProps {
  onSuccess?: () => void;
  users: User[];
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSuccess, users }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const { addTask, loading, error } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask({ title, description, assignee: assignee ? parseInt(assignee) : undefined });
      setTitle('');
      setDescription('');
      setAssignee('');
      onSuccess?.();
    } catch (err) {
      // Error is displayed via context
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create New Task</h3>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="assignee">Assign to</label>
        <select
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};
