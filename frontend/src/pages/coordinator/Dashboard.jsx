import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineHome,
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineStar,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineSparkles,
    HiOutlineUserGroup,
    HiOutlineCash
} from 'react-icons/hi'
import { useState, useEffect } from 'react'

// Import specific views
import CoordinatorEvents from './Events'
import InstituteView from './InstituteView'
import DepartmentView from './DepartmentView'
import EventView from './EventView'
import CoordinatorGroups from './Groups'
import CoordinatorWinners from './Winners'
import CoordinatorAttendance from './Attendance'

// Chart components
import MiniStatCard from '../../components/charts/MiniStatCard'
import AttendanceChart from '../../components/charts/AttendanceChart'
import PaymentStatusChart from '../../components/charts/PaymentStatusChart'
import GroupParticipationChart from '../../components/charts/GroupParticipationChart'
import useDashboardData from '../../hooks/useDashboardData'

const sidebarItems = [
    { path: '/coordinator', icon: HiOutlineHome, label: 'Dashboard', exact: true },
    { path: '/coordinator/events', icon: HiOutlineCalendar, label: 'My Events' },
    { path: '/coordinator/groups', icon: HiOutlineUserGroup, label: 'Groups' },
    { path: '/coordinator/attendance', icon: HiOutlineClipboardCheck, label: 'Attendance' },
    { path: '/coordinator/winners', icon: HiOutlineStar, label: 'Winners' },
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
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-[280px] bg-midnight-950/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
                            <div>
                                <h1 className="text-xl font-bold gradient-text">Frolic</h1>
                                <p className="text-xs text-white/40">Coordinator Panel</p>
                            </div>
                        </div>
                    </div>

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
                                                ? 'bg-emerald-500/20 text-emerald-400'
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

                    <div className="p-4 border-t border-white/10">
                        <div className="glass-card p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.UserName?.charAt(0) || 'C'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user?.UserName || 'Coordinator'}</p>
                                    <p className="text-xs text-white/40 truncate">{user?.EmailAddress || 'coordinator@frolic.com'}</p>
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
    const roleLabels = {
        'institute_coordinator': 'Institute Coordinator',
        'department_coordinator': 'Department Coordinator',
        'event_coordinator': 'Event Coordinator',
        'coordinator': 'Coordinator'
    }

    return (
        <header className="sticky top-0 z-30 bg-midnight-950/80 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/5 lg:hidden"
                >
                    <HiOutlineMenu className="w-6 h-6 text-white" />
                </button>

                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white hidden sm:block">Coordinator Dashboard</h2>
                </div>

                <div className="flex items-center gap-4">
                    <p className="text-sm text-white/60 hidden sm:block">
                        {/*@ts-ignore*/}
                        {roleLabels[useAuth().user?.role] || 'Coordinator'}
                    </p>
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

// Coordinator Dashboard Home
// Coordinator Dashboard Home — Premium SaaS Analytics
function DashboardHome() {
    const { user } = useAuth()
    const { stats, charts, loading } = useDashboardData('coordinator')

    // Choose specific view based on role
    if (user?.role === 'institute_coordinator') {
        return <InstituteView />
    }
    if (user?.role === 'department_coordinator') {
        return <DepartmentView />
    }
    if (user?.role === 'event_coordinator') {
        return <EventView />
    }

    // Sparkline data for stat cards
    const grpSparkline = (charts.groupParticipation || []).map(d => d.teams)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Coordinator Dashboard</h1>
                    <p className="text-white/50 text-sm">Manage and track your assigned events</p>
                </div>
            </div>

            {/* ─── Stat Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MiniStatCard
                    label="Active Events"
                    value={loading ? '...' : stats.activeEvents}
                    gradient="from-blue-500 to-cyan-500"
                    icon={<HiOutlineCalendar className="w-5 h-5 text-white" />}
                    delay={0}
                    loading={loading}
                />
                <MiniStatCard
                    label="Total Groups"
                    value={loading ? '...' : stats.totalGroups}
                    gradient="from-emerald-500 to-teal-500"
                    icon={<HiOutlineUserGroup className="w-5 h-5 text-white" />}
                    delay={0.1}
                    loading={loading}
                    sparkData={grpSparkline}
                />
                <MiniStatCard
                    label="Payments Verified"
                    value={loading ? '...' : stats.paidGroups}
                    gradient="from-purple-500 to-pink-500"
                    icon={<HiOutlineCash className="w-5 h-5 text-white" />}
                    delay={0.2}
                    loading={loading}
                    badge={stats.paymentRate ? `${stats.paymentRate}% rate` : null}
                    badgeColor={stats.paymentRate >= 70 ? 'emerald' : 'amber'}
                />
                <MiniStatCard
                    label="Pending Payments"
                    value={loading ? '...' : stats.pendingPayments}
                    gradient="from-amber-500 to-orange-500"
                    icon={<HiOutlineClipboardCheck className="w-5 h-5 text-white" />}
                    delay={0.3}
                    loading={loading}
                    badge={stats.pendingPayments > 0 ? "Action Needed" : "All Clear"}
                    badgeColor={stats.pendingPayments > 0 ? "rose" : "emerald"}
                />
            </div>

            {/* ─── Charts ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AttendanceChart
                    data={charts.attendanceData}
                    rate={stats.attendanceRate || 0}
                    delay={0.4}
                />
                <PaymentStatusChart
                    data={charts.paymentStatus}
                    rate={stats.paymentRate || 0}
                    delay={0.45}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <GroupParticipationChart
                    data={charts.groupParticipation}
                    delay={0.5}
                />
            </div>

            <p className="text-white/40 text-center mt-10">Select a specific role to see a customized dashboard.</p>
        </div>
    )
}

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

export default function CoordinatorDashboard() {
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
                        <Route path="events/*" element={<CoordinatorEvents />} />
                        <Route path="groups/*" element={<CoordinatorGroups />} />
                        <Route path="attendance/*" element={<CoordinatorAttendance />} />
                        <Route path="payments/*" element={<CoordinatorGroups />} />
                        <Route path="winners/*" element={<CoordinatorWinners />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
