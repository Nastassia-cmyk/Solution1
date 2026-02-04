﻿import React, { useState } from 'react';
import { Task } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { StatusBadge } from './StatusBadge';
import { CommentSection } from './CommentSection';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  teamMembers: string[];
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, teamMembers }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ title: task.title, assignee: task.assignee || '' });
  const { updateTask, deleteTask, loading } = useAppContext();

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (err) {
      // Error handled by context
    }
  };

  const handleSaveEdit = async (field: string) => {
    try {
      if (field === 'title') {
        await updateTask(task.id, { title: editValues.title });
      } else if (field === 'assignee') {
        await updateTask(task.id, { assignee: editValues.assignee || undefined });
      }
      setEditingField(null);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (err) {
        // Error handled by context
      }
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="task-card-title-section">
          {editingField === 'title' ? (
            <input
              type="text"
              value={editValues.title}
              onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
              onBlur={() => handleSaveEdit('title')}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit('title')}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h4 onDoubleClick={() => { setEditingField('title'); setEditValues({ ...editValues, title: task.title }); }}>
              {task.title}
            </h4>
          )}
          <StatusBadge status={task.status} onChange={handleStatusChange} />
        </div>
        <div className="task-card-actions">
          <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(); }} disabled={loading}>
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="task-card-body">
          <p className="task-description">{task.description}</p>
          
          <div className="task-meta">
            <div className="meta-item">
              <strong>Assigned to:</strong>
              {editingField === 'assignee' ? (
                <select
                  value={editValues.assignee}
                  onChange={(e) => setEditValues({ ...editValues, assignee: e.target.value })}
                  onBlur={() => handleSaveEdit('assignee')}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              ) : (
                <span onDoubleClick={() => { setEditingField('assignee'); setEditValues({ ...editValues, assignee: task.assignee || '' }); }}>
                  {task.assignee || 'Unassigned'}
                </span>
              )}
            </div>
            <div className="meta-item">
              <strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>

          <CommentSection taskId={task.id} teamMembers={teamMembers} />
        </div>
      )}
    </div>
  );
};
