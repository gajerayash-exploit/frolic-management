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
    HiOutlineSparkles,
    HiOutlineCash,
    HiOutlineTrendingUp,
    HiOutlineChartBar
} from 'react-icons/hi'
import { useState, useEffect } from 'react'
import Institutes from './Institutes'
import Departments from './Departments'
import Events from './Events'
import Users from './Users'
import Groups from './Groups'
import Winners from './Winners'
import Settings from './settings'
import AdminAttendance from './Attendance'

// Chart components
import MiniStatCard from '../../components/charts/MiniStatCard'
import RegistrationTrendChart from '../../components/charts/RegistrationTrendChart'
import EventStatusChart from '../../components/charts/EventStatusChart'
import DepartmentDistributionChart from '../../components/charts/DepartmentDistributionChart'
import PaymentStatusChart from '../../components/charts/PaymentStatusChart'
import AttendanceChart from '../../components/charts/AttendanceChart'
import InstituteActivityChart from '../../components/charts/InstituteActivityChart'
import RevenueTrendChart from '../../components/charts/RevenueTrendChart'
import useDashboardData from '../../hooks/useDashboardData'

const sidebarItems = [
    { path: '/admin', icon: HiOutlineHome, label: 'Dashboard', exact: true },
    { path: '/admin/institutes', icon: HiOutlineOfficeBuilding, label: 'Institutes' },
    { path: '/admin/departments', icon: HiOutlineCollection, label: 'Departments' },
    { path: '/admin/events', icon: HiOutlineCalendar, label: 'Events' },
    { path: '/admin/groups', icon: HiOutlineUserGroup, label: 'Groups' },
    { path: '/admin/attendance', icon: HiOutlineClipboardCheck, label: 'Attendance' },
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

// RelativeTime Component for live updating timestamps
function RelativeTime({ dateString }) {
    const [timeStr, setTimeStr] = useState('');

    useEffect(() => {
        const updateTime = () => {
            if (!dateString) return;
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) setTimeStr('Just now');
            else if (diffInSeconds < 3600) setTimeStr(`${Math.floor(diffInSeconds / 60)}m ago`);
            else if (diffInSeconds < 86400) setTimeStr(`${Math.floor(diffInSeconds / 3600)}h ago`);
            else if (diffInSeconds < 604800) setTimeStr(`${Math.floor(diffInSeconds / 86400)}d ago`);
            else setTimeStr(date.toLocaleDateString());
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [dateString]);

    return <span>{timeStr}</span>;
}

// Dashboard Home Component — Premium SaaS Analytics
function DashboardHome() {
    const { stats, charts, loading } = useDashboardData('admin')
    const [recentEvents, setRecentEvents] = useState([])

    // Fetch recent events separately for the list section
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/events')
                const data = await res.json()
                setRecentEvents((data.data || []).slice(-4).reverse())
            } catch (e) {
                console.error('Recent events fetch error:', e)
            }
        }
        fetchRecent()
    }, [])

    // Sparkline data for stat cards (derived from chart trend data)
    const regSparkline = (charts.registrationTrend || []).map(d => d.registrations)
    const grpSparkline = (charts.groupParticipation || []).map(d => d.teams)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
                    <p className="text-white/50 text-sm">
                        Welcome to Frolic Management System —{' '}
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">Last synced just now</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
            </div>

            {/* ─── Stat Cards Row ─────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <MiniStatCard
                    label="Total Events"
                    value={loading ? '...' : stats.totalEvents}
                    gradient="from-blue-500 to-cyan-500"
                    icon={<HiOutlineCalendar className="w-5 h-5 text-white" />}
                    delay={0}
                    loading={loading}
                    badge={stats.activeEvents ? `${stats.activeEvents} active` : null}
                    badgeColor="emerald"
                    sparkData={regSparkline}
                />
                <MiniStatCard
                    label="Active Events"
                    value={loading ? '...' : stats.upcomingEvents}
                    gradient="from-emerald-500 to-teal-500"
                    icon={<HiOutlineTrendingUp className="w-5 h-5 text-white" />}
                    delay={0.05}
                    loading={loading}
                    badge="Upcoming"
                    badgeColor="blue"
                />
                <MiniStatCard
                    label="Total Groups"
                    value={loading ? '...' : stats.totalGroups}
                    gradient="from-purple-500 to-pink-500"
                    icon={<HiOutlineUserGroup className="w-5 h-5 text-white" />}
                    delay={0.1}
                    loading={loading}
                    sparkData={grpSparkline}
                />
                <MiniStatCard
                    label="Total Users"
                    value={loading ? '...' : stats.totalUsers}
                    gradient="from-orange-500 to-amber-500"
                    icon={<HiOutlineUsers className="w-5 h-5 text-white" />}
                    delay={0.15}
                    loading={loading}
                />
                <MiniStatCard
                    label="Revenue Collected"
                    value={loading ? '...' : `₹${stats.collectedRevenue?.toLocaleString() || 0}`}
                    gradient="from-teal-500 to-cyan-500"
                    icon={<HiOutlineCash className="w-5 h-5 text-white" />}
                    delay={0.2}
                    loading={loading}
                    badge={stats.paymentRate ? `${stats.paymentRate}%` : null}
                    badgeColor={stats.paymentRate >= 70 ? 'emerald' : 'amber'}
                />
                <MiniStatCard
                    label="Winners Declared"
                    value={loading ? '...' : stats.winnersDecl}
                    gradient="from-amber-500 to-orange-500"
                    icon={<HiOutlineStar className="w-5 h-5 text-white" />}
                    delay={0.25}
                    loading={loading}
                    badge={stats.winnersPending ? `${stats.winnersPending} pending` : null}
                    badgeColor="amber"
                />
            </div>

            {/* ─── Charts Row 1: Registration Trend + Event Status ─ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <RegistrationTrendChart
                    data={charts.registrationTrend}
                    delay={0.3}
                />
                <EventStatusChart
                    data={charts.eventStatus}
                    total={stats.totalEvents}
                    delay={0.35}
                />
            </div>

            {/* ─── Charts Row 2: Department + Payment ──────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DepartmentDistributionChart
                    data={charts.departmentDistribution}
                    delay={0.4}
                />
                <PaymentStatusChart
                    data={charts.paymentStatus}
                    rate={stats.paymentRate || 0}
                    delay={0.45}
                />
            </div>

            {/* ─── Charts Row 3: Revenue Trend + Attendance ──────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RevenueTrendChart
                    data={charts.revenueTrend}
                    totalRevenue={stats.collectedRevenue || 0}
                    delay={0.5}
                />
                <AttendanceChart
                    data={charts.attendanceData}
                    rate={stats.attendanceRate || 0}
                    delay={0.55}
                />
            </div>

            {/* ─── Charts Row 4: Institute Activity ────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InstituteActivityChart
                    data={charts.instituteActivity}
                    delay={0.6}
                />
            </div>

            {/* ─── Quick Actions ─────────────────────────────────── */}
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

            {/* ─── Recent Events ─────────────────────────────────── */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/10 rounded w-1/3" />
                                    <div className="h-3 bg-white/10 rounded w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : recentEvents.length === 0 ? (
                        <p className="text-white/40 text-center py-4">No events yet. Create your first event!</p>
                    ) : (
                        recentEvents.map((event) => (
                            <div key={event._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                                    <HiOutlineCalendar className="w-5 h-5 text-accent-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">{event.EventName}</p>
                                    <p className="text-sm text-white/40">{event.DepartmentID?.DepartmentName || 'No Department'}</p>
                                </div>
                                <p className="text-xs text-white/40">
                                    <RelativeTime dateString={event.createdAt} />
                                </p>
                            </div>
                        ))
                    )}
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
        <div className="h-screen bg-midnight-950 lg:flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopBar setIsOpen={setSidebarOpen} onLogout={handleLogout} />

                <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
                    <Routes>
                        <Route index element={<DashboardHome />} />
                        <Route path="institutes/*" element={<Institutes />} />
                        <Route path="departments/*" element={<Departments />} />
                        <Route path="events/*" element={<Events />} />
                        <Route path="groups/*" element={<Groups />} />
                        <Route path="attendance/*" element={<AdminAttendance />} />
                        <Route path="users/*" element={<Users />} />
                        <Route path="winners/*" element={<Winners />} />
                        <Route path="settings/*" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
