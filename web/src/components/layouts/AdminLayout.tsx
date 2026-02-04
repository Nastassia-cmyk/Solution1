﻿import React, { useState, useEffect } from 'react';
import AdminOverviewPage from '../pages/AdminOverviewPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import SettingsPage from '../pages/SettingsPage';
import { SettingsProvider } from '../../context/SettingsContext';
import { AppProvider } from '../../context/AppContext';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const [currentAdminRoute, setCurrentAdminRoute] = useState<string>(() => {
    const hash = window.location.hash.slice(1) || '/admin';
    return hash;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/admin';
      setCurrentAdminRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderAdminContent = () => {
    if (currentAdminRoute === '/admin/overview') {
      return (
        <AppProvider>
          <AdminOverviewPage />
        </AppProvider>
      );
    }

    if (currentAdminRoute === '/admin/users') {
      return <AdminUsersPage />;
    }

    if (currentAdminRoute === '/admin/settings') {
      return (
        <SettingsProvider>
          <SettingsPage />
        </SettingsProvider>
      );
    }

    return (
      <div className="admin-welcome">
        <h2>Welcome to Admin Dashboard</h2>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    );
  };

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
                <li>
                  <a 
                    href="#/admin/overview" 
                    className={`admin-menu-item ${currentAdminRoute === '/admin/overview' ? 'active' : ''}`}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a 
                    href="#/admin/users" 
                    className={`admin-menu-item ${currentAdminRoute === '/admin/users' ? 'active' : ''}`}
                  >
                    Users
                  </a>
                </li>
                <li>
                  <a 
                    href="#/admin/settings" 
                    className={`admin-menu-item ${currentAdminRoute === '/admin/settings' ? 'active' : ''}`}
                  >
                    Settings
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          <section className="admin-content">
            {renderAdminContent()}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
