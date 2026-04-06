import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineHome,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineStar,
    HiOutlineLogout,
    HiOutlineMenu,
    HiOutlineSparkles,
    HiOutlineSearch,
    HiOutlineFilter
} from 'react-icons/hi'
import { useState } from 'react'
import StudentEvents from './Events'
import StudentMyGroups from './MyGroups'
import StudentResults from './Results'

const sidebarItems = [
    { path: '/student', icon: HiOutlineHome, label: 'Dashboard', exact: true },
    { path: '/student/events', icon: HiOutlineCalendar, label: 'Browse Events' },
    { path: '/student/my-groups', icon: HiOutlineUserGroup, label: 'My Groups' },
    { path: '/student/results', icon: HiOutlineStar, label: 'Results' },
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
                                <p className="text-xs text-white/40">Student Portal</p>
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
                                                ? 'bg-blue-500/20 text-blue-400 shadow-glow-blue'
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
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.UserName?.charAt(0) || 'S'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user?.UserName || 'Student'}</p>
                                    <p className="text-xs text-white/40 truncate">{user?.EmailAddress || 'student@frolic.com'}</p>
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

                <div className="flex-1 max-w-xl mx-4 hidden md:block">
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-12 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <p className="text-sm text-white/60 hidden sm:block">Student Dashboard</p>
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

// Student Dashboard Home
function DashboardHome() {
    const { user } = useAuth()
    const [stats, setStats] = useState({ registeredEvents: 0, myGroups: 0, achievements: 0 })
    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user's groups
                const groupsRes = await fetch('/api/groups')
                const groupsData = await groupsRes.json()
                const myGroups = (groupsData.data || []).filter(g => 
                    (g.CreatedBy?._id || g.CreatedBy) === user?._id
                )
                
                // Fetch achievements (winners)
                const winRes = await fetch('/api/winners')
                const winData = await winRes.json()
                const myGroupIds = myGroups.map(g => g._id)
                const myAchievements = (winData.data || []).filter(w => 
                    myGroupIds.includes(w.GroupID?._id || w.GroupID)
                )

                // Fetch events
                const eventsRes = await fetch('/api/events')
                const eventsData = await eventsRes.json()
                const activeEvents = (eventsData.data || []).filter(e => e.IsActive).slice(0, 4)

                setStats({
                    registeredEvents: myGroups.length, // Proxy for events registered
                    myGroups: myGroups.length,
                    achievements: myAchievements.length
                })

                setUpcomingEvents(activeEvents)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?._id) {
            fetchDashboardData()
        }
    }, [user])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back! 👋</h1>
                <p className="text-white/60">Explore events and manage your groups</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-hover p-6"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                        <HiOutlineCalendar className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {loading ? <span className="animate-pulse w-8 h-8 bg-white/10 rounded block"></span> : stats.registeredEvents}
                    </p>
                    <p className="text-sm text-white/60">Registered Events</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card-hover p-6"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                        <HiOutlineUserGroup className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {loading ? <span className="animate-pulse w-8 h-8 bg-white/10 rounded block"></span> : stats.myGroups}
                    </p>
                    <p className="text-sm text-white/60">My Groups</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card-hover p-6"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                        <HiOutlineStar className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">
                        {loading ? <span className="animate-pulse w-8 h-8 bg-white/10 rounded block"></span> : stats.achievements}
                    </p>
                    <p className="text-sm text-white/60">Achievements</p>
                </motion.div>
            </div>

            {/* Upcoming Events */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
                    <Link to="/student/events" className="text-sm text-blue-400 hover:text-blue-300">
                        View All →
                    </Link>
                </div>
                <div className="space-y-3">
                    {loading ? (
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
                            ))}
                        </div>
                    ) : upcomingEvents.length === 0 ? (
                        <p className="text-white/60 text-center py-4">No upcoming events right now.</p>
                    ) : upcomingEvents.map((event, i) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div>
                                <p className="text-white font-medium">{event.EventName}</p>
                                <p className="text-sm text-white/40">{event.DepartmentID?.DepartmentName || 'TBD'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-white/60">{event.EventDate ? new Date(event.EventDate).toLocaleDateString() : 'TBD'}</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                    Open
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
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

export default function StudentDashboard() {
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
                        <Route path="events/*" element={<StudentEvents />} />
                        <Route path="my-groups/*" element={<StudentMyGroups />} />
                        <Route path="results/*" element={<StudentResults />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}
