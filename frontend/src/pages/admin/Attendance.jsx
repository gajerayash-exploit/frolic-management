import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineClipboardCheck,
    HiOutlineSearch,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineUsers,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
    HiOutlineExclamation,
    HiOutlineCalendar,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineLockClosed,
    HiOutlineFilter
} from 'react-icons/hi'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function AdminAttendance() {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEventId, setSelectedEventId] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedGroupId, setExpandedGroupId] = useState(null)
    const [togglingIds, setTogglingIds] = useState(new Set())
    const [confirmModal, setConfirmModal] = useState(null)
    const [bulkProcessing, setBulkProcessing] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [eventsRes, groupsRes] = await Promise.all([
                fetch('/api/events'),
                fetch('/api/groups')
            ])
            const eventsData = await eventsRes.json()
            const groupsData = await groupsRes.json()
            setEvents(eventsData.data || [])
            setGroups(groupsData.data || [])
        } catch (error) {
            console.error('Error fetching attendance data:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleAttendance = async (groupId, newValue) => {
        setTogglingIds(prev => new Set(prev).add(groupId))
        try {
            const token = localStorage.getItem('frolic_token')
            const res = await fetch(`/api/groups/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ IsPresent: newValue })
            })
            if (res.ok) {
                const data = await res.json()
                setGroups(prev =>
                    prev.map(g =>
                        g._id === groupId
                            ? {
                                ...g,
                                IsPresent: newValue,
                                AttendanceMarkedBy: data.data?.AttendanceMarkedBy || user?.UserName,
                                AttendanceMarkedAt: data.data?.AttendanceMarkedAt || new Date().toISOString()
                            }
                            : g
                    )
                )
            }
        } catch (error) {
            console.error('Error toggling attendance:', error)
        } finally {
            setTogglingIds(prev => {
                const next = new Set(prev)
                next.delete(groupId)
                return next
            })
        }
    }

    const handleBulkAction = async (markPresent) => {
        setBulkProcessing(true)
        const token = localStorage.getItem('frolic_token')
        const targetGroups = filteredGroups.filter(g => g.IsPresent !== markPresent)

        for (const group of targetGroups) {
            try {
                const res = await fetch(`/api/groups/${group._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ IsPresent: markPresent })
                })
                if (res.ok) {
                    setGroups(prev =>
                        prev.map(g =>
                            g._id === group._id
                                ? {
                                    ...g,
                                    IsPresent: markPresent,
                                    AttendanceMarkedAt: new Date().toISOString()
                                }
                                : g
                        )
                    )
                }
            } catch (error) {
                console.error(`Bulk update failed for group ${group._id}:`, error)
            }
        }
        setBulkProcessing(false)
        setConfirmModal(null)
    }

    // Derived data
    const eventFilteredGroups = selectedEventId === 'all'
        ? groups
        : groups.filter(g => (g.EventID?._id || g.EventID) === selectedEventId)

    const filteredGroups = eventFilteredGroups.filter(group => {
        const term = searchTerm.toLowerCase()
        if (!term) return true
        const groupName = (group.GroupName || '').toLowerCase()
        const eventName = (group.EventID?.EventName || '').toLowerCase()
        const creatorName = (group.CreatedBy?.UserName || '').toLowerCase()
        return groupName.includes(term) || eventName.includes(term) || creatorName.includes(term)
    })

    const stats = {
        total: filteredGroups.length,
        present: filteredGroups.filter(g => g.IsPresent).length,
        absent: filteredGroups.filter(g => !g.IsPresent).length,
        paymentVerified: filteredGroups.filter(g => g.IsPaymentDone).length
    }

    const selectedEventName = selectedEventId === 'all'
        ? 'All Events'
        : events.find(e => e._id === selectedEventId)?.EventName || 'Unknown Event'

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const formatTimestamp = (dateStr) => {
        if (!dateStr) return null
        const d = new Date(dateStr)
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center">
                            <HiOutlineClipboardCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Attendance Management</h1>
                            <p className="text-white/60 text-sm">Track and manage group attendance across all events</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Event Filter + Search Row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                {/* Event Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors w-full sm:w-64"
                    >
                        <HiOutlineFilter className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        <span className="flex-1 text-left truncate text-sm">{selectedEventName}</span>
                        <HiOutlineChevronDown className={`w-4 h-4 text-white/40 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {filterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-midnight-950 border border-white/10 rounded-xl shadow-2xl z-40 max-h-64 overflow-y-auto"
                            >
                                <button
                                    onClick={() => { setSelectedEventId('all'); setFilterOpen(false) }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedEventId === 'all' ? 'bg-accent-500/20 text-accent-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                >
                                    All Events
                                </button>
                                {events.map(event => (
                                    <button
                                        key={event._id}
                                        onClick={() => { setSelectedEventId(event._id); setFilterOpen(false) }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedEventId === event._id ? 'bg-accent-500/20 text-accent-400' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {event.EventName}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by group, event, or creator name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-accent-500 transition-colors"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <HiOutlineX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Summary Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <HiOutlineUsers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Total Groups</p>
                        <p className="text-xl font-bold text-white">{loading ? '—' : stats.total}</p>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Present</p>
                        <p className="text-xl font-bold text-emerald-400">{loading ? '—' : stats.present}</p>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                        <HiOutlineXCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Absent</p>
                        <p className="text-xl font-bold text-gray-400">{loading ? '—' : stats.absent}</p>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <HiOutlineLockClosed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Payment Verified</p>
                        <p className="text-xl font-bold text-blue-400">{loading ? '—' : stats.paymentVerified}</p>
                    </div>
                </div>
            </motion.div>

            {/* Bulk Actions Bar — only when a specific event is selected */}
            <AnimatePresence>
                {selectedEventId !== 'all' && filteredGroups.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <HiOutlineClipboardCheck className="w-4 h-4" />
                                <span>Bulk actions for <span className="text-accent-400 font-medium">{selectedEventName}</span> — {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setConfirmModal({ type: 'present' })}
                                    className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <HiOutlineCheck className="w-4 h-4" />
                                        Mark All Present
                                    </span>
                                </button>
                                <button
                                    onClick={() => setConfirmModal({ type: 'absent' })}
                                    className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-600/50 text-white hover:bg-gray-600/70 transition-all border border-white/10"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <HiOutlineX className="w-4 h-4" />
                                        Mark All Absent
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Group List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-white/60 text-sm">Loading attendance data...</p>
                </div>
            ) : filteredGroups.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                >
                    <HiOutlineClipboardCheck className="w-16 h-16 text-white/10 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Groups Found</h3>
                    <p className="text-white/50 text-sm max-w-md mx-auto">
                        {searchTerm
                            ? `No groups match "${searchTerm}". Try adjusting your search or filter.`
                            : selectedEventId !== 'all'
                                ? 'No groups have registered for this event yet.'
                                : 'No groups have been created in the system yet.'}
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {filteredGroups.map((group) => {
                        const isExpanded = expandedGroupId === group._id
                        const isToggling = togglingIds.has(group._id)
                        const participantCount = group.participants?.length || 0

                        return (
                            <motion.div
                                key={group._id}
                                variants={itemVariants}
                                layout
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        {/* Group Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                <h3 className="text-lg font-bold text-white truncate">{group.GroupName}</h3>
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-accent-500/20 text-accent-400 whitespace-nowrap">
                                                    {group.EventID?.EventName || 'Unknown Event'}
                                                </span>
                                                {group.IsPaymentDone && (
                                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-400 whitespace-nowrap flex items-center gap-1">
                                                        <HiOutlineLockClosed className="w-3 h-3" />
                                                        Paid
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/50 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <HiOutlineUsers className="w-3.5 h-3.5" />
                                                    {group.CreatedBy?.UserName || 'Unknown'}
                                                </span>
                                                <span className="text-white/20">•</span>
                                                <span className="flex items-center gap-1">
                                                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                                                    {formatDate(group.createdAt)}
                                                </span>
                                                <span className="text-white/20">•</span>
                                                <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 border border-white/10">
                                                    {participantCount} member{participantCount !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Attendance Toggle + Expand */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            {/* Attendance Timestamp */}
                                            {group.AttendanceMarkedAt && (
                                                <div className="hidden md:block text-right">
                                                    <p className="text-[11px] text-white/30 uppercase tracking-wider">Marked</p>
                                                    <p className="text-xs text-white/50">{formatTimestamp(group.AttendanceMarkedAt)}</p>
                                                </div>
                                            )}

                                            {/* Attendance Toggle Button */}
                                            <button
                                                onClick={() => toggleAttendance(group._id, !group.IsPresent)}
                                                disabled={isToggling}
                                                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                    isToggling
                                                        ? 'opacity-60 cursor-wait'
                                                        : group.IsPresent
                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                                                            : 'bg-gray-600/30 text-gray-400 border border-gray-500/30 hover:bg-gray-600/50 hover:text-gray-300'
                                                }`}
                                            >
                                                {isToggling ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : group.IsPresent ? (
                                                    <HiOutlineCheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <HiOutlineXCircle className="w-4 h-4" />
                                                )}
                                                {group.IsPresent ? 'Present' : 'Absent'}
                                            </button>

                                            {/* Expand / Collapse Participants */}
                                            <button
                                                onClick={() => setExpandedGroupId(isExpanded ? null : group._id)}
                                                className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                                                title={isExpanded ? 'Collapse participants' : 'View participants'}
                                            >
                                                {isExpanded
                                                    ? <HiOutlineChevronUp className="w-5 h-5" />
                                                    : <HiOutlineChevronDown className="w-5 h-5" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Participant Section */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 border-t border-white/5">
                                                <div className="pt-4">
                                                    <h4 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                                                        <HiOutlineUsers className="w-4 h-4" />
                                                        Participants ({participantCount})
                                                    </h4>
                                                    {group.participants && group.participants.length > 0 ? (
                                                        <div className="grid gap-2">
                                                            {group.participants.map((p, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                                                                            <span className="text-xs font-semibold text-accent-400">
                                                                                {p.Name?.charAt(0) || '?'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className="text-sm text-white font-medium truncate flex items-center gap-2">
                                                                                {p.Name}
                                                                                {p.IsGroupLeader && (
                                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                                                                                        Leader
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                            <p className="text-xs text-white/40 truncate">
                                                                                {p.EnrollmentNum}{p.InstituteName ? ` • ${p.InstituteName}` : ''}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right flex-shrink-0 text-xs text-white/40 sm:ml-4">
                                                                        <p className="truncate max-w-[200px]" title={p.Email}>{p.Email}</p>
                                                                        <p>{p.Phone}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-center text-white/30 text-sm py-4">No participants found</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    confirmModal.type === 'present'
                                        ? 'bg-emerald-500/20'
                                        : 'bg-gray-500/20'
                                }`}>
                                    <HiOutlineExclamation className={`w-5 h-5 ${
                                        confirmModal.type === 'present'
                                            ? 'text-emerald-400'
                                            : 'text-gray-400'
                                    }`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Confirm Bulk Action</h3>
                                    <p className="text-sm text-white/50">This action cannot be undone easily</p>
                                </div>
                            </div>

                            <p className="text-white/70 text-sm mb-6">
                                Are you sure you want to mark <span className="text-white font-semibold">all {filteredGroups.length} groups</span> in{' '}
                                <span className="text-accent-400 font-semibold">{selectedEventName}</span> as{' '}
                                <span className={`font-semibold ${confirmModal.type === 'present' ? 'text-emerald-400' : 'text-gray-400'}`}>
                                    {confirmModal.type === 'present' ? 'Present' : 'Absent'}
                                </span>?
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    disabled={bulkProcessing}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleBulkAction(confirmModal.type === 'present')}
                                    disabled={bulkProcessing}
                                    className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 ${
                                        confirmModal.type === 'present'
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20'
                                            : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                                >
                                    {bulkProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {confirmModal.type === 'present' ? <HiOutlineCheck className="w-4 h-4" /> : <HiOutlineX className="w-4 h-4" />}
                                            Confirm
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
