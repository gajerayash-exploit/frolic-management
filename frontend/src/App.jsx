import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import AdminDashboard from './pages/admin/Dashboard'
import StudentDashboard from './pages/student/Dashboard'
import CoordinatorDashboard from './pages/coordinator/Dashboard'

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'admin') return <Navigate to="/admin" replace />
        if (user?.role === 'student') return <Navigate to="/student" replace />
        if (['institute_coordinator', 'department_coordinator', 'event_coordinator'].includes(user?.role)) {
            return <Navigate to="/coordinator" replace />
        }
        return <Navigate to="/" replace />
    }

    return children
}

function App() {
    const { isAuthenticated, user, loading } = useAuth()

    // Show loading spinner while auth is initializing
    if (loading) {
        return (
            <div className="min-h-screen bg-midnight-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-500 mx-auto mb-4"></div>
                    <p className="text-white/60">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-midnight-950">
            <Routes>
                {/* Public route - Landing/Login */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate 
                                to={
                                    ['institute_coordinator', 'department_coordinator', 'event_coordinator'].includes(user?.role)
                                        ? '/coordinator'
                                        : `/${user?.role || 'student'}`
                                } 
                                replace 
                            />
                        ) : (
                            <Landing />
                        )
                    }
                />

                {/* Admin routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Student routes */}
                <Route
                    path="/student/*"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Coordinator routes */}
                <Route
                    path="/coordinator/*"
                    element={
                        <ProtectedRoute allowedRoles={['institute_coordinator', 'department_coordinator', 'event_coordinator']}>
                            <CoordinatorDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* 404 - Redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
