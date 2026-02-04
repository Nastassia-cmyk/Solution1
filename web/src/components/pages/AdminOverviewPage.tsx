import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { User } from '../../types';
import { settingsApi } from '../../services/settingsApi';
import '../../styles/AdminOverviewPage.css';

export const AdminOverviewPage: React.FC = () => {
  const { tasks, loadTasks, loading, error } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadTasks();
    // Load users from settings
    settingsApi.getSettings()
      .then(settings => setUsers(settings.users))
      .catch(err => console.error('Failed to load users:', err));
  }, [loadTasks]);

  // Calculate status counts
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const totalCount = tasks.length;

  // Get last 5 completed tasks
  const completedTasks = tasks
    .filter(t => t.status === 'done')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAssignee = (assigneeId?: number) => {
    if (!assigneeId) return '-';
    const user = users.find(u => u.id === assigneeId);
    return user ? `${user.name} (${user.role})` : '-';
  };

  return (
    <div className="admin-overview">
      <h2>Admin Overview</h2>

      {error && <div className="overview-error">{error}</div>}

      {loading && <div className="overview-loading">Loading tasks...</div>}

      {!loading && (
        <>
          {/* Summary Cards */}
          <section className="overview-summary">
            <div className="summary-card">
              <div className="card-label">Total Tasks</div>
              <div className="card-value">{totalCount}</div>
            </div>

            <div className="summary-card status-todo">
              <div className="card-label">To Do</div>
              <div className="card-value">{todoCount}</div>
            </div>

            <div className="summary-card status-in-progress">
              <div className="card-label">In Progress</div>
              <div className="card-value">{inProgressCount}</div>
            </div>

            <div className="summary-card status-done">
              <div className="card-label">Done</div>
              <div className="card-value">{doneCount}</div>
            </div>
          </section>

          {/* Completed Tasks Section */}
          <section className="overview-completed-section">
            <h3>Last 5 Completed Tasks</h3>
            
            {completedTasks.length === 0 ? (
              <div className="overview-empty-state">
                <p>No completed tasks yet.</p>
              </div>
            ) : (
              <div className="overview-table-wrapper">
                <table className="overview-table">
                  <thead>
                    <tr>
                      <th>Task Title</th>
                      <th>Assigned To</th>
                      <th>Completed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTasks.map(task => (
                      <tr key={task.id}>
                        <td className="task-title">{task.title}</td>
                        <td className="task-assignee">{formatAssignee(task.assignee)}</td>
                        <td className="task-date">{formatDate(task.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminOverviewPage;
