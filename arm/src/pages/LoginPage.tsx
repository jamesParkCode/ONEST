import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { adminLogin } from '../lib/api'

export default function LoginPage() {
  const { setAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('이메일과 비밀번호를 입력하세요.')

    setLoading(true)
    try {
      const admin = await adminLogin(email, password)
      if (admin) {
        setAdmin(admin)
        navigate('/dashboard')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-logo">ONEST</h1>
          <p className="login-subtitle">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" id="login-form">
          <div className="login-field">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@onest.studio"
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit" disabled={loading} id="login-submit">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
