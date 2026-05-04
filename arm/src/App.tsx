import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import ProjectsPage from './pages/ProjectsPage'
import MembersPage from './pages/MembersPage'
import ContentPage from './pages/ContentPage'
import InquiriesPage from './pages/InquiriesPage'
import InquiryDetailPage from './pages/InquiryDetailPage'
import './App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="inquiries/:id" element={<InquiryDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App
