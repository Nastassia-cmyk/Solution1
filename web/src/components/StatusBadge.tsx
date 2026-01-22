import React from 'react';
import { TaskStatus } from '../types';
import '../styles/StatusBadge.css';

interface StatusBadgeProps {
  status: TaskStatus;
  onChange?: (status: TaskStatus) => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, onChange }) => {
  const statusColors: Record<TaskStatus, string> = {
    'todo': 'badge-todo',
    'in-progress': 'badge-in-progress',
    'done': 'badge-done',
  };

  return onChange ? (
    <select
      className={`status-badge ${statusColors[status]}`}
      value={status}
      onChange={(e) => onChange(e.target.value as TaskStatus)}
    >
      <option value="todo">To Do</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  ) : (
    <span className={`status-badge ${statusColors[status]}`}>
      {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
    </span>
  );
};
