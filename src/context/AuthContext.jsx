import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (username) => {
    const userData = { username, avatar: username[0].toUpperCase(), loggedInAt: new Date().toISOString() }
    setUser(userData)
    localStorage.setItem('taskflow_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('taskflow_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
