﻿import React, { useEffect, useState } from 'react';
import TaskPage from './components/pages/TaskPage';
import AdminLayout from './components/layouts/AdminLayout';
import './App.css';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.slice(1) || '/tasks';
    return hash;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/tasks';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentRoute === '/admin') {
    return <AdminLayout />;
  }

  return <TaskPage />;
};

export default App;
