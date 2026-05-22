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
    HiOutlineLockClosed
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
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

function SkeletonCard() {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-40 bg-white/10 rounded-lg" />
                    <div className="h-3 w-28 bg-white/5 rounded-lg" />
                </div>
                <div className="h-10 w-28 bg-white/10 rounded-xl" />
            </div>
            <div className="flex gap-3">
                <div className="h-6 w-20 bg-white/5 rounded-full" />
                <div className="h-6 w-20 bg-white/5 rounded-full" />
            </div>
        </div>
    )
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, groupNames, isLoading }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <HiOutlineExclamation className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{title}</h3>
                        </div>
                    </div>

                    <p className="text-white/70 text-sm mb-4">{message}</p>

                    {groupNames && groupNames.length > 0 && (
                        <div className="mb-4 max-h-32 overflow-y-auto">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Affected Groups</p>
                            <div className="space-y-1">
                                {groupNames.map((name, i) => (
                                    <div key={i} className="text-sm text-white/80 bg-white/5 px-3 py-1.5 rounded-lg">
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-5">
                        <HiOutlineLockClosed className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <p className="text-xs text-amber-300/90">
                            Marking present will lock group editing for students.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-primary-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-accent-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <HiOutlineCheck className="w-4 h-4" />
                            )}
                            {isLoading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default function CoordinatorAttendance() {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [selectedEventId, setSelectedEventId] = useState('')
    const [groups, setGroups] = useState([])
    const [allGroups, setAllGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [eventsLoading, setEventsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedGroupId, setExpandedGroupId] = useState(null)

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        groupNames: [],
        onConfirm: () => {},
        isLoading: false
    })

    useEffect(() => {
        if (user) fetchEvents()
    }, [user])

    useEffect(() => {
        if (selectedEventId && allGroups.length > 0) {
            const filtered = allGroups.filter(g => {
                const eventId = g.EventID?._id || g.EventID
                return eventId === selectedEventId
            })
            setGroups(filtered)
        } else if (!selectedEventId) {
            setGroups([])
        }
    }, [selectedEventId, allGroups])

    const fetchEvents = async () => {
        setEventsLoading(true)
        try {
            let eventUrl = '/api/events'
            if (user.role === 'event_coordinator') {
                eventUrl = `/api/events?EventCoordinatorID=${user?.id || user?._id}`
            } else if (user.role === 'department_coordinator') {
                const deptRes = await fetch(`/api/departments?DepartmentCoordinatorID=${user?.id || user?._id}`)
                const deptData = await deptRes.json()
                if (deptData.data && deptData.data.length > 0) {
                    eventUrl = `/api/events?DepartmentID=${deptData.data[0]._id}`
                }
            }

            const eventRes = await fetch(eventUrl)
            const eventData = await eventRes.json()
            const fetchedEvents = eventData.data || []
            setEvents(fetchedEvents)

            if (fetchedEvents.length > 0) {
                setSelectedEventId(fetchedEvents[0]._id)
            }

            await fetchGroups(fetchedEvents)
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setEventsLoading(false)
        }
    }

    const fetchGroups = async (eventsList) => {
        setLoading(true)
        try {
            const groupRes = await fetch('/api/groups')
            const groupData = await groupRes.json()
            const allFetchedGroups = groupData.data || []

            const myEventIds = (eventsList || events).map(e => e._id)
            const relevantGroups = allFetchedGroups.filter(g => {
                const eventId = g.EventID?._id || g.EventID
                return myEventIds.includes(eventId)
            })

            setAllGroups(relevantGroups)
        } catch (error) {
            console.error('Error fetching groups:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleAttendance = async (groupId, newValue) => {
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
                const responseData = await res.json()
                const updatedGroup = responseData.data || responseData

                setAllGroups(prev => prev.map(g =>
                    g._id === groupId
                        ? {
                            ...g,
                            IsPresent: newValue,
                            AttendanceMarkedBy: updatedGroup.AttendanceMarkedBy || user?._id,
                            AttendanceMarkedAt: updatedGroup.AttendanceMarkedAt || new Date().toISOString()
                        }
                        : g
                ))
            }
        } catch (error) {
            console.error('Toggle attendance error:', error)
        }
    }

    const handleToggleClick = (group) => {
        const newValue = !group.IsPresent
        setConfirmModal({
            isOpen: true,
            title: newValue ? 'Mark as Present' : 'Mark as Absent',
            message: newValue
                ? `Are you sure you want to mark "${group.GroupName}" as present?`
                : `Are you sure you want to mark "${group.GroupName}" as absent?`,
            groupNames: [group.GroupName],
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }))
                await toggleAttendance(group._id, newValue)
                setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }))
            }
        })
    }

    const handleBulkAction = (markPresent) => {
        const targetGroups = filteredGroups.filter(g => g.IsPresent !== markPresent)
        if (targetGroups.length === 0) return

        setConfirmModal({
            isOpen: true,
            title: markPresent ? 'Mark All Present' : 'Mark All Absent',
            message: markPresent
                ? `This will mark ${targetGroups.length} group(s) as present.`
                : `This will mark ${targetGroups.length} group(s) as absent.`,
            groupNames: targetGroups.map(g => g.GroupName),
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, isLoading: true }))
                for (const group of targetGroups) {
                    await toggleAttendance(group._id, markPresent)
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }))
            }
        })
    }

    const filteredGroups = groups.filter(group => {
        const term = searchTerm.toLowerCase()
        const groupName = (group.GroupName || '').toLowerCase()
        const creatorName = (group.CreatedBy?.UserName || '').toLowerCase()
        return groupName.includes(term) || creatorName.includes(term)
    })

    const presentCount = groups.filter(g => g.IsPresent).length
    const absentCount = groups.filter(g => !g.IsPresent).length
    const paymentVerifiedCount = groups.filter(g => g.IsPaymentDone).length

    const formatTimestamp = (dateStr) => {
        if (!dateStr) return null
        const d = new Date(dateStr)
        return d.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const selectedEvent = events.find(e => e._id === selectedEventId)

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center">
                            <HiOutlineClipboardCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Attendance Management</h1>
                            <p className="text-white/60 text-sm">Track and manage group attendance for your events</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
            >
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">
                    Select Event
                </label>
                {eventsLoading ? (
                    <div className="h-11 bg-white/5 rounded-xl animate-pulse" />
                ) : events.length === 0 ? (
                    <p className="text-white/50 text-sm py-2">No events found for your role.</p>
                ) : (
                    <div className="relative">
                        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 appearance-none cursor-pointer transition-colors hover:bg-white/[0.08]"
                        >
                            {events.map(event => (
                                <option key={event._id} value={event._id} className="bg-midnight-950 text-white">
                                    {event.EventName}
                                </option>
                            ))}
                        </select>
                        <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
                    </div>
                )}
            </motion.div>

            {selectedEventId && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                <HiOutlineUsers className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Total Groups</p>
                                <p className="text-2xl font-bold text-white">{groups.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Present</p>
                                <p className="text-2xl font-bold text-emerald-400">{presentCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-500/10 to-transparent rounded-bl-full" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                                <HiOutlineXCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Absent</p>
                                <p className="text-2xl font-bold text-gray-400">{absentCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <HiOutlineClipboardCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-wider">Payment Verified</p>
                                <p className="text-2xl font-bold text-purple-400">{paymentVerifiedCount}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {selectedEventId && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by group name or creator..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-500 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkAction(true)}
                            disabled={groups.length === 0}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            <HiOutlineCheck className="w-4 h-4" />
                            Mark All Present
                        </button>
                        <button
                            onClick={() => handleBulkAction(false)}
                            disabled={groups.length === 0}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white/70 font-medium text-sm hover:bg-white/15 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            <HiOutlineX className="w-4 h-4" />
                            Mark All Absent
                        </button>
                    </div>
                </motion.div>
            )}

            {loading ? (
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : !selectedEventId ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                >
                    <HiOutlineCalendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Select an Event</h2>
                    <p className="text-white/60">Choose an event from the dropdown above to manage attendance.</p>
                </motion.div>
            ) : filteredGroups.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                >
                    <HiOutlineUsers className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Groups Found</h2>
                    <p className="text-white/60">
                        {searchTerm
                            ? 'No groups match your search. Try a different keyword.'
                            : `No groups have registered for "${selectedEvent?.EventName || 'this event'}" yet.`}
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {filteredGroups.map((group) => (
                        <motion.div
                            key={group._id}
                            variants={itemVariants}
                            layout
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
                        >
                            <div className="p-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="text-lg font-bold text-white truncate">{group.GroupName}</h3>
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent-500/20 text-accent-400 font-medium whitespace-nowrap">
                                                <HiOutlineUsers className="w-3 h-3 inline mr-1" />
                                                {group.participants?.length || 0} members
                                            </span>
                                            {group.IsPaymentDone ? (
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium whitespace-nowrap">
                                                    <HiOutlineCheckCircle className="w-3 h-3 inline mr-1" />
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium whitespace-nowrap">
                                                    <HiOutlineXCircle className="w-3 h-3 inline mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-white/50">
                                            Created by <span className="text-white/70">{group.CreatedBy?.UserName || 'Unknown'}</span>
                                            {group.createdAt && (
                                                <span className="text-white/30"> • {new Date(group.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            )}
                                        </p>
                                        {group.AttendanceMarkedAt && (
                                            <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                                                <HiOutlineCalendar className="w-3 h-3" />
                                                Marked at: {formatTimestamp(group.AttendanceMarkedAt)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button
                                            onClick={() => handleToggleClick(group)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                                group.IsPresent
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                                                    : 'bg-white/10 border border-white/10 text-white/50 hover:bg-white/15 hover:text-white/70'
                                            }`}
                                        >
                                            {group.IsPresent ? (
                                                <>
                                                    <HiOutlineCheckCircle className="w-5 h-5" />
                                                    Present
                                                </>
                                            ) : (
                                                <>
                                                    <HiOutlineXCircle className="w-5 h-5" />
                                                    Absent
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setExpandedGroupId(expandedGroupId === group._id ? null : group._id)}
                                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                                            title="View Participants"
                                        >
                                            {expandedGroupId === group._id ? (
                                                <HiOutlineChevronUp className="w-5 h-5" />
                                            ) : (
                                                <HiOutlineChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedGroupId === group._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-white/10 p-5 bg-white/[0.02]">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                                                    Participants
                                                </h4>
                                                <span className="text-xs text-white/40">
                                                    {group.participants?.length || 0} members
                                                </span>
                                            </div>

                                            {group.participants && group.participants.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {group.participants.map((p, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="p-3.5 bg-white/5 rounded-xl border border-white/5"
                                                        >
                                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                                <h5 className="font-medium text-white text-sm truncate flex-1">
                                                                    {p.Name}
                                                                </h5>
                                                                {p.IsGroupLeader && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold whitespace-nowrap flex-shrink-0">
                                                                        Leader
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="space-y-0.5 text-xs text-white/40">
                                                                <p className="truncate" title={p.EnrollmentNum}>
                                                                    <span className="text-white/25">Enrollment:</span> {p.EnrollmentNum}
                                                                </p>
                                                                <p className="truncate" title={p.InstituteName}>
                                                                    <span className="text-white/25">Institute:</span> {p.InstituteName}
                                                                </p>
                                                                <p className="truncate" title={p.Phone}>
                                                                    <span className="text-white/25">Phone:</span> {p.Phone}
                                                                </p>
                                                                <p className="truncate" title={p.Email}>
                                                                    <span className="text-white/25">Email:</span> {p.Email}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-white/40 text-center py-4">No participants found.</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                groupNames={confirmModal.groupNames}
                isLoading={confirmModal.isLoading}
            />
        </div>
    )
}
