import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineCollection,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineUsers,
    HiOutlineStar,
    HiOutlineCog,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineX,
    HiOutlineSparkles
} from 'react-icons/hi'
import { useState } from 'react'
import Institutes from './Institutes'
import Departments from './Departments'
import Events from './Events'
import Users from './Users'
import Groups from './Groups'
import Winners from './Winners'
import Settings from './settings'

const sidebarItems = [
    { path: '/admin', icon: HiOutlineHome, label: 'Dashboard', exact: true },
    { path: '/admin/institutes', icon: HiOutlineOfficeBuilding, label: 'Institutes' },
    { path: '/admin/departments', icon: HiOutlineCollection, label: 'Departments' },
    { path: '/admin/events', icon: HiOutlineCalendar, label: 'Events' },
    { path: '/admin/groups', icon: HiOutlineUserGroup, label: 'Groups' },
    { path: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
    { path: '/admin/winners', icon: HiOutlineStar, label: 'Winners' },
    { path: '/admin/settings', icon: HiOutlineCog, label: 'Settings' },
]

function Sidebar({ isOpen, setIsOpen }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar - Fixed on mobile, static on desktop */}
            <aside
                className={`fixed top-0 left-0 h-full w-[280px] bg-midnight-950/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
                            <div>
                                <h1 className="text-xl font-bold gradient-text">Frolic</h1>
                                <p className="text-xs text-white/40">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = item.exact
                                    ? location.pathname === item.path
                                    : location.pathname.startsWith(item.path)

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-accent-500/20 text-accent-400 shadow-glow-sm'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="glass-card p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.UserName?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user?.UserName || 'Admin'}</p>
                                    <p className="text-xs text-white/40 truncate">{user?.EmailAddress || 'admin@frolic.com'}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <HiOutlineLogout className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

function TopBar({ setIsOpen, onLogout }) {
    return (
        <header className="sticky top-0 z-30 bg-midnight-950/80 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/5 lg:hidden"
                >
                    <HiOutlineMenu className="w-6 h-6 text-white" />
                </button>

                <div className="flex-1 lg:ml-0">
                    <h2 className="text-lg font-semibold text-white hidden sm:block">Admin Dashboard</h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-white/60">Welcome back,</p>
                        <p className="text-sm font-medium text-white">Administrator</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                        <HiOutlineLogout className="w-5 h-5" />
                        <span className="hidden sm:inline font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

// Dashboard Home Component
function DashboardHome() {
    const stats = [
        { label: 'Total Events', value: '12', gradient: 'from-blue-500 to-cyan-500' },
        { label: 'Active Groups', value: '48', gradient: 'from-emerald-500 to-teal-500' },
        { label: 'Participants', value: '256', gradient: 'from-orange-500 to-amber-500' },
        { label: 'Institutes', value: '8', gradient: 'from-purple-500 to-pink-500' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-white/60">Welcome to Frolic Management System</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card-hover p-6"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                            <span className="text-2xl font-bold text-white">{stat.value.charAt(0)}</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-white/60">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/events" className="btn-secondary text-center text-sm">
                        New Event
                    </Link>
                    <Link to="/admin/institutes" className="btn-secondary text-center text-sm">
                        Add Institute
                    </Link>
                    <Link to="/admin/users" className="btn-secondary text-center text-sm">
                        Manage Users
                    </Link>
                    <Link to="/admin/winners" className="btn-secondary text-center text-sm">
                        View Winners
                    </Link>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                                <HiOutlineCalendar className="w-5 h-5 text-accent-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">New event registered</p>
                                <p className="text-sm text-white/40">Code Sprint - Computer Science</p>
                            </div>
                            <p className="text-xs text-white/40">2 hours ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Placeholder components for other routes
function PlaceholderPage({ title }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <div className="glass-card p-12 text-center">
                <p className="text-white/60">This section is under development</p>
                <p className="text-sm text-white/40 mt-2">Coming soon...</p>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-midnight-950 lg:flex">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-h-screen">
                <TopBar setIsOpen={setSidebarOpen} onLogout={handleLogout} />

                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Routes>
                        <Route index element={<DashboardHome />} />
                        <Route path="institutes/*" element={<Institutes />} />
                        <Route path="departments/*" element={<Departments />} />
                        <Route path="events/*" element={<Events />} />
                        <Route path="groups/*" element={<Groups />} />
                        <Route path="users/*" element={<Users />} />
                        <Route path="winners/*" element={<Winners />} />
                        <Route path="settings/*" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
