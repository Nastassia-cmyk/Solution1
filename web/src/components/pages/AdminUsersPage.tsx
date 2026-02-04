import React, { useEffect, useState } from 'react';
import { User, Task } from '../../types';
import { settingsApi } from '../../services/settingsApi';
import { api } from '../../services/api';
import '../../styles/AdminUsersPage.css';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [settings, allTasks] = await Promise.all([
          settingsApi.getSettings(),
          api.tasks.getAll(),
        ]);
        setUsers(settings.users);
        setTasks(allTasks);
        setError(null);
      } catch (err) {
        setError('Failed to load data');
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate role counts
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roles = Object.keys(roleCounts).sort();

  // Helper function to count completed tasks for a user
  const getCompletedTasksCount = (userId: number): number => {
    return tasks.filter(task => task.assignee === userId && task.status === 'done').length;
  };

  if (loading) {
    return <div className="admin-users-loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <h2>Users Management</h2>

      {error && <div className="admin-users-error">{error}</div>}

      {/* Summary Cards */}
      <div className="admin-users-summary">
        <div className="summary-card total">
          <div className="card-value">{users.length}</div>
          <div className="card-label">Total Users</div>
        </div>
        {roles.map(role => (
          <div key={role} className="summary-card">
            <div className="card-value">{roleCounts[role]}</div>
            <div className="card-label">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="admin-users-table-container">
        {users.length === 0 ? (
          <div className="admin-users-empty">
            <p>No users found</p>
          </div>
        ) : (
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Total Completed Tasks</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="completed-tasks-cell">
                    <span className="completed-tasks-badge">{getCompletedTasksCount(user.id)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
