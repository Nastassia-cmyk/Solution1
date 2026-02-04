import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { settingsApi } from '../../services/settingsApi';
import '../../styles/AdminUsersPage.css';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const settings = await settingsApi.getSettings();
        setUsers(settings.users);
        setError(null);
      } catch (err) {
        setError('Failed to load users');
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Calculate role counts
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roles = Object.keys(roleCounts).sort();

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
