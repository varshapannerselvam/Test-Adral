import { useTasks } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const { tasks } = useTasks()
  const { user } = useAuth()

  const today = new Date().toISOString().split('T')[0]
  
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    overdue: tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'completed').length,
  }

  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Welcome back, {user?.username}</h1>
        <p>Here's an overview of your tasks</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">⊞</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon todo">○</div>
          <div className="stat-info">
            <span className="stat-value">{stats.todo}</span>
            <span className="stat-label">To Do</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress">◐</div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon done">✓</div>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-icon overdue">!</div>
          <div className="stat-info">
            <span className="stat-value">{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-progress">
          <h3>Completion Rate</h3>
          <div className="progress-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className="progress-bg" />
              <circle cx="60" cy="60" r="50" className="progress-fill" style={{ strokeDasharray: `${completionRate * 3.14} 314` }} />
            </svg>
            <span className="progress-text">{completionRate}%</span>
          </div>
          {stats.highPriority > 0 && (
            <div className="priority-alert">
              <span className="badge badge-high">{stats.highPriority} high priority</span>
              <span>tasks need attention</span>
            </div>
          )}
        </div>

        <div className="card dashboard-recent">
          <div className="recent-header">
            <h3>Recent Tasks</h3>
            <Link to="/tasks" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="recent-list">
            {recentTasks.map(task => (
              <div key={task.id} className="recent-item">
                <div className="recent-item-info">
                  <span className="recent-item-title">{task.title}</span>
                  <span className="recent-item-date">{task.createdAt}</span>
                </div>
                <span className={`badge badge-${task.status === 'in-progress' ? 'in-progress' : task.status}`}>
                  {task.status}
                </span>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <p className="empty-text">No tasks yet. Create your first task!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
