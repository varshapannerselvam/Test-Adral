import { createContext, useContext, useState } from 'react'

const TaskContext = createContext(null)

const initialTasks = [
  { id: 1, title: 'Design homepage mockup', description: 'Create wireframes and high-fidelity mockups for the new homepage', priority: 'high', status: 'in-progress', category: 'Design', createdAt: '2026-11-01', dueDate: '2026-11-10' },
  { id: 2, title: 'Fix login bug', description: 'Users report intermittent login failures on mobile devices', priority: 'high', status: 'todo', category: 'Development', createdAt: '2026-11-02', dueDate: '2026-11-06' },
  { id: 3, title: 'Write API documentation', description: 'Document all REST endpoints with request/response examples', priority: 'medium', status: 'todo', category: 'Documentation', createdAt: '2026-11-02', dueDate: '2026-11-12' },
  { id: 4, title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', priority: 'medium', status: 'completed', category: 'Development', createdAt: '2026-10-28', dueDate: '2026-11-03' },
  { id: 5, title: 'User research interviews', description: 'Conduct 5 user interviews to gather feedback on the new feature', priority: 'low', status: 'in-progress', category: 'Research', createdAt: '2026-11-03', dueDate: '2026-11-15' },
  { id: 6, title: 'Update dependencies', description: 'Review and update all npm packages to latest stable versions', priority: 'low', status: 'completed', category: 'Development', createdAt: '2026-10-25', dueDate: '2026-10-30' },
]

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })

  const saveTasks = (updated) => {
    setTasks(updated)
    localStorage.setItem('taskflow_tasks', JSON.stringify(updated))
  }

  const addTask = (task) => {
    const newTask = { ...task, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }
    saveTasks([newTask, ...tasks])
  }

  const updateTask = (id, updates) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const clearCompleted = () => {
    saveTasks(tasks.filter(t => t.status !== 'completed'))
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, clearCompleted }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => useContext(TaskContext)
