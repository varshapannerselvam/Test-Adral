import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TaskList from './pages/TaskList'
import TaskForm from './pages/TaskForm'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><TaskProvider><Sidebar><Dashboard /></Sidebar></TaskProvider></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TaskProvider><Sidebar><TaskList /></Sidebar></TaskProvider></ProtectedRoute>} />
      <Route path="/tasks/new" element={<ProtectedRoute><TaskProvider><Sidebar><TaskForm /></Sidebar></TaskProvider></ProtectedRoute>} />
      <Route path="/tasks/edit/:id" element={<ProtectedRoute><TaskProvider><Sidebar><TaskForm /></Sidebar></TaskProvider></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
