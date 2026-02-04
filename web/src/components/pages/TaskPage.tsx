import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { TaskForm } from '../TaskForm';
import { TaskCard } from '../TaskCard';
import './TaskPage.css';

const TEAM_MEMBERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

export const TaskPage: React.FC = () => {
  const { tasks, loadTasks, loading, error } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = filterStatus
    ? tasks.filter(task => task.status === filterStatus)
    : tasks;

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="page-root">
      <header className="page-header">
        <h1>Task Manager</h1>
        <p>Manage tasks for your team</p>
        <nav className="page-nav">
          <button className="nav-btn active" onClick={() => window.location.hash = '#/tasks'}>
            Tasks
          </button>
          <button className="nav-btn" onClick={() => window.location.hash = '#/admin'}>
            Admin
          </button>
        </nav>
      </header>

      <main className="page-main">
        <div className="page-layout">
          <aside className="page-sidebar">
            <TaskForm teamMembers={TEAM_MEMBERS} onSuccess={loadTasks} />
          </aside>

          <section className="page-content">
            {error && <div className="error-message">{error}</div>}
            
            <div className="task-stats">
              <div className="stat">
                <span className="stat-count">{todoCount}</span>
                <span className="stat-label">To Do</span>
              </div>
              <div className="stat">
                <span className="stat-count">{inProgressCount}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat">
                <span className="stat-count">{doneCount}</span>
                <span className="stat-label">Done</span>
              </div>
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${!filterStatus ? 'active' : ''}`}
                onClick={() => setFilterStatus(null)}
              >
                All Tasks ({tasks.length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'todo' ? 'active' : ''}`}
                onClick={() => setFilterStatus('todo')}
              >
                To Do
              </button>
              <button
                className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
                onClick={() => setFilterStatus('in-progress')}
              >
                In Progress
              </button>
              <button
                className={`filter-btn ${filterStatus === 'done' ? 'active' : ''}`}
                onClick={() => setFilterStatus('done')}
              >
                Done
              </button>
            </div>

            <div className="tasks-container">
              {loading && tasks.length === 0 ? (
                <p className="loading-message">Loading tasks...</p>
              ) : filteredTasks.length === 0 ? (
                <p className="empty-message">
                  {filterStatus ? `No ${filterStatus} tasks` : 'No tasks yet. Create one to get started!'}
                </p>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} teamMembers={TEAM_MEMBERS} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TaskPage;
