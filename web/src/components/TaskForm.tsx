import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/TaskForm.css';

interface TaskFormProps {
  onSuccess?: () => void;
  teamMembers: string[];
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSuccess, teamMembers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const { addTask, loading, error } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask({ title, description, assignee: assignee || undefined });
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
          {teamMembers.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};
