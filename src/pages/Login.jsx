import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }
    login(username.trim())
    navigate('/dashboard')
  }

  const handleReset = (e) => {
    e.preventDefault()
    if (!resetEmail.trim()) return
    setResetSent(true)
    setTimeout(() => { setShowReset(false); setResetSent(false); setResetEmail('') }, 2000)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand">
            <div className="login-brand-icon">T</div>
            <h1>TaskFlow</h1>
          </div>
          <p>{showReset ? 'Reset your password' : 'Sign in to manage your tasks'}</p>
        </div>

        {!showReset ? (
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                placeholder="Enter your username"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-green login-btn">
              Sign In
            </button>

            <button type="button" className="forgot-link" onClick={() => setShowReset(true)}>
              Forgot password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="login-form">
            {resetSent ? (
              <div className="login-success">Reset link sent! Check your inbox.</div>
            ) : (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary login-btn">
                  Send Reset Link
                </button>
              </>
            )}
            <button type="button" className="forgot-link" onClick={() => { setShowReset(false); setResetSent(false); setResetEmail('') }}>
              Back to Sign In
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>Demo: use any username & password (4+ chars)</p>
        </div>
      </div>
    </div>
  )
}
