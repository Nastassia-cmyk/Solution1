import React from 'react';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-root">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>System administration and settings</p>
        <nav className="admin-nav">
          <button className="admin-nav-btn" onClick={() => window.location.hash = '#/tasks'}>
            Back to Tasks
          </button>
          <button className="admin-nav-btn active" onClick={() => window.location.hash = '#/admin'}>
            Admin
          </button>
        </nav>
      </header>

      <main className="admin-main">
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-sidebar-section">
              <h3>Navigation</h3>
              <ul className="admin-menu">
                <li><a href="#/admin/overview" className="admin-menu-item">Overview</a></li>
                <li><a href="#/admin/users" className="admin-menu-item">Users</a></li>
                <li><a href="#/admin/settings" className="admin-menu-item">Settings</a></li>
              </ul>
            </div>
          </aside>

          <section className="admin-content">
            <div className="admin-welcome">
              <h2>Welcome to Admin Dashboard</h2>
              <p>Select an option from the sidebar to get started.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
