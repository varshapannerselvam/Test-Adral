import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import './TaskForm.css'

export default function TaskForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, addTask, updateTask } = useTasks()
  const existing = id ? tasks.find(t => t.id === Number(id)) : null

  const [form, setForm] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    priority: existing?.priority || 'medium',
    status: existing?.status || 'todo',
    category: existing?.category || '',
    dueDate: existing?.dueDate || '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    if (existing) {
      updateTask(existing.id, form)
    } else {
      addTask(form)
    }
    navigate('/tasks')
  }

  return (
    <div className="task-form-page">
      <div className="page-header">
        <h1>{existing ? 'Edit Task' : 'New Task'}</h1>
        <p>{existing ? 'Update the task details below' : 'Fill in the details to create a new task'}</p>
      </div>

      <form onSubmit={handleSubmit} className="task-form card">
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Enter task title"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe the task..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              placeholder="e.g. Development, Design"
              className={errors.category ? 'input-error' : ''}
            />
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={e => handleChange('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => handleChange('status', e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => handleChange('dueDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/tasks')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {existing ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
