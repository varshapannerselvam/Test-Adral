import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import './TaskList.css'

export default function TaskList() {
  const { tasks, deleteTask, updateTask, clearCompleted } = useTasks()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showConfirm, setShowConfirm] = useState(false)

  const filtered = tasks
    .filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || t.status === filterStatus
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority
      return matchSearch && matchStatus && matchPriority
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
      return 0
    })

  const cycleStatus = (task) => {
    const next = { todo: 'in-progress', 'in-progress': 'completed', completed: 'todo' }
    updateTask(task.id, { status: next[task.status] })
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length

  const handleClearCompleted = () => {
    clearCompleted()
    setShowConfirm(false)
  }

  return (
    <div className="task-list-page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Tasks</h1>
            <p>{filtered.length} of {tasks.length} tasks</p>
          </div>
          <div className="header-actions">
            {completedCount > 0 && (
              <button className="btn btn-secondary" onClick={() => setShowConfirm(true)}>
                Clear completed ({completedCount})
              </button>
            )}
            <Link to="/tasks/new" className="btn btn-primary">+ New Task</Link>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <div className="tasks-container">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>{tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your filters'}</p>
            {tasks.length === 0 && <Link to="/tasks/new" className="btn btn-primary">+ Create Task</Link>}
          </div>
        ) : (
          filtered.map(task => (
            <div key={task.id} className={`task-card priority-${task.priority}`}>
              <div className="task-card-left">
                <button className="status-checkbox" onClick={() => cycleStatus(task)} title="Click to change status">
                  {task.status === 'completed' ? '✓' : task.status === 'in-progress' ? '◐' : '○'}
                </button>
              </div>
              <div className="task-card-body">
                <div className="task-card-header">
                  <h3 className={task.status === 'completed' ? 'task-done' : ''}>{task.title}</h3>
                  <div className="task-card-actions">
                    <Link to={`/tasks/edit/${task.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  <span className={`badge badge-${task.status === 'in-progress' ? 'in-progress' : task.status}`}>{task.status}</span>
                  <span className="task-category">{task.category}</span>
                  {task.dueDate && <span className="task-due">Due: {task.dueDate}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Clear completed tasks?</h3>
            <p>This will permanently remove {completedCount} completed task{completedCount !== 1 ? 's' : ''}. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleClearCompleted}>Clear all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
