import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineCalendar,
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineLocationMarker,
    HiOutlineUsers,
    HiOutlineCurrencyRupee,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineX
} from 'react-icons/hi'

export default function CoordinatorEvents() {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        EventName: '',
        Tagline: '',
        Description: '',
        DepartmentID: '',
        GroupMinParticipants: 1,
        GroupMaxParticipants: 5,
        Fees: 0,
        Prizes: '',
        Location: '',
        EventDate: '',
        EventTime: ''
    })

    const [availableDepartments, setAvailableDepartments] = useState([])

    useEffect(() => {
        fetchEvents()
        if (showModal) {
            fetchDepartments()
        }
    }, [user, showModal])

    const fetchEvents = async () => {
        try {
            let url = '/api/events'

            // Logic to fetch events based on role
            if (user.role === 'institute_coordinator') {
                const instRes = await fetch(`/api/institutes?InstituteCoordinatorID=${user?.id || user?._id}`)
                const instData = await instRes.json()
                if (instData.data && instData.data.length > 0) {
                    // We fetch all for simplicity
                }
            } else if (user.role === 'department_coordinator') {
                const deptRes = await fetch(`/api/departments?DepartmentCoordinatorID=${user?.id || user?._id}`)
                const deptData = await deptRes.json()
                if (deptData.data && deptData.data.length > 0) {
                    url = `/api/events?DepartmentID=${deptData.data[0]._id}`
                    // Also set default department for form
                    setFormData(prev => ({ ...prev, DepartmentID: deptData.data[0]._id }))
                }
            } else if (user.role === 'event_coordinator') {
                url = `/api/events?EventCoordinatorID=${user?.id || user?._id}`
            }

            const response = await fetch(url)
            const data = await response.json()
            let fetchedEvents = data.data || []

            // Client-side filtering for Institute Coordinator 
            if (user.role === 'institute_coordinator') {
                const instRes = await fetch(`/api/institutes?InstituteCoordinatorID=${user?.id || user?._id}`)
                const instData = await instRes.json()
                if (instData.data && instData.data.length > 0) {
                    const instId = instData.data[0]._id
                    const deptRes = await fetch(`/api/departments?InstituteID=${instId}`)
                    const deptData = await deptRes.json()
                    const deptIds = (deptData.data || []).map(d => d._id)
                    fetchedEvents = fetchedEvents.filter(e => deptIds.includes(e.DepartmentID?._id || e.DepartmentID))
                }
            }

            setEvents(fetchedEvents)
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchDepartments = async () => {
        try {
            let url = '/api/departments'
            if (user.role === 'institute_coordinator') {
                const instRes = await fetch(`/api/institutes?InstituteCoordinatorID=${user?.id || user?._id}`)
                const instData = await instRes.json()
                if (instData.data && instData.data.length > 0) {
                    url = `/api/departments?InstituteID=${instData.data[0]._id}`
                }
            }
            // For Dept Coordinator, we already set the ID.

            const response = await fetch(url)
            const data = await response.json()
            setAvailableDepartments(data.data || [])
        } catch (error) {
            console.error('Error fetching departments:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitLoading(true)
        try {
            const token = localStorage.getItem('frolic_token')
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (data.success) {
                setShowModal(false)
                fetchEvents()
                // Reset form
                setFormData({
                    EventName: '',
                    Tagline: '',
                    Description: '',
                    DepartmentID: formData.DepartmentID, // Keep dept if fixed
                    GroupMinParticipants: 1,
                    GroupMaxParticipants: 5,
                    Fees: 0,
                    Prizes: '',
                    Location: '',
                    EventDate: '',
                    EventTime: ''
                })
            } else {
                alert(data.message || 'Failed to create event')
            }
        } catch (error) {
            console.error('Create event error:', error)
            alert('Error creating event')
        } finally {
            setSubmitLoading(false)
        }
    }

    const filteredEvents = events.filter(event =>
        event.EventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const canCreateEvent = ['institute_coordinator', 'department_coordinator'].includes(user?.role)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Events Management</h1>
                    <p className="text-white/60">
                        {user.role === 'event_coordinator' ? 'Your Assigned Events' : 'Manage Events'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 w-full md:w-64"
                        />
                    </div>

                    {canCreateEvent && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-glow flex items-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Event</span>
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading events...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineCalendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Events Found</h2>
                    <p className="text-white/60">
                        {searchTerm ? 'Try adjusting your search terms' : 'No events are currently listed.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card-hover p-6 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center">
                                    <HiOutlineCalendar className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.EventName}</h3>
                            <p className="text-sm text-accent-400 mb-4">{event.DepartmentID?.DepartmentName}</p>

                            <div className="space-y-2 text-sm text-white/60 mb-4">
                                <div className="flex items-center gap-2">
                                    <HiOutlineLocationMarker className="w-4 h-4" />
                                    <span>{event.Location || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineUsers className="w-4 h-4" />
                                    <span>{event.GroupMaxParticipants} participants / group</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className={`text-xs px-2 py-1 rounded-full ${event.IsActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {event.IsActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-sm font-medium text-white">
                                    ₹{event.Fees}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Add New Event</h3>
                                <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white">
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Event Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.EventName}
                                            onChange={(e) => setFormData({ ...formData, EventName: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Tagline</label>
                                        <input
                                            type="text"
                                            value={formData.Tagline}
                                            onChange={(e) => setFormData({ ...formData, Tagline: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-1 block">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.Description}
                                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Department</label>
                                        <select
                                            required
                                            disabled={user.role === 'department_coordinator'}
                                            value={formData.DepartmentID}
                                            onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900"
                                        >
                                            <option value="">Select Department</option>
                                            {availableDepartments.map(dept => (
                                                <option key={dept._id} value={dept._id}>{dept.DepartmentName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Location</label>
                                        <input
                                            type="text"
                                            value={formData.Location}
                                            onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Min Participants</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.GroupMinParticipants}
                                            onChange={(e) => setFormData({ ...formData, GroupMinParticipants: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Max Participants</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.GroupMaxParticipants}
                                            onChange={(e) => setFormData({ ...formData, GroupMaxParticipants: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm text-white/60 mb-1 block">Registration Fee (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.Fees}
                                            onChange={(e) => setFormData({ ...formData, Fees: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Event Date</label>
                                        <input
                                            type="date"
                                            value={formData.EventDate?.split('T')[0]}
                                            onChange={(e) => setFormData({ ...formData, EventDate: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Time</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 10:00 AM"
                                            value={formData.EventTime}
                                            onChange={(e) => setFormData({ ...formData, EventTime: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitLoading}
                                        className="px-6 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {submitLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Creating...</span>
                                            </>
                                        ) : (
                                            <span>Create Event</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
