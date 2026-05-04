import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const navItems = [
  { path: '/dashboard', label: '대시보드', icon: '📊' },
  { path: '/dashboard/projects', label: '프로젝트', icon: '🎨' },
  { path: '/dashboard/members', label: '멤버', icon: '👥' },
  { path: '/dashboard/content', label: '콘텐츠', icon: '📝' },
  { path: '/dashboard/inquiries', label: '문의관리', icon: '💬' },
]

export default function DashboardLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dash">
      <aside className="dash-sidebar" id="sidebar">
        <div className="dash-sidebar-header">
          <span className="dash-logo">ONEST</span>
          <span className="dash-logo-sub">ADMIN</span>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `dash-nav-item ${isActive ? 'dash-nav-active' : ''}`
              }
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <span className="dash-user-name">{admin?.name || 'Admin'}</span>
            <span className="dash-user-email">{admin?.email}</span>
          </div>
          <button onClick={handleLogout} className="dash-logout" id="logout-btn">
            로그아웃
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  )
}
