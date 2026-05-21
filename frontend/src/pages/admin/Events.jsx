import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSearch,
    HiOutlineX,
    HiOutlineCalendar,
    HiOutlineRefresh,
    HiOutlineFilter,
    HiOutlineLocationMarker,
    HiOutlineCurrencyRupee,
    HiOutlineUserGroup
} from 'react-icons/hi'

// Helper to get auth headers
// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('frolic_token')
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

export default function Events() {
    const [events, setEvents] = useState([])
    const [departments, setDepartments] = useState([])
    const [coordinators, setCoordinators] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterDepartment, setFilterDepartment] = useState('')

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('add')
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [formData, setFormData] = useState({
        EventName: '',
        Tagline: '',
        Description: '',
        DepartmentID: '',
        EventCoordinatorID: '',
        Location: '',
        GroupMinParticipants: 1,
        GroupMaxParticipants: 5,
        MaxGroupsAllowed: 50,
        Fees: 0,
        EventDate: '',
        EventTime: ''
    })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    // Fetch events
    const fetchEvents = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch('/api/events')
            const data = await response.json()
            if (data.success) {
                setEvents(data.data || [])
            } else {
                setError(data.message || 'Failed to fetch events')
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setError('Failed to connect to server')
        }
        setLoading(false)
    }

    // Fetch departments for dropdown
    const fetchDepartments = async () => {
        try {
            const response = await fetch('/api/departments')
            const data = await response.json()
            if (data.success) {
                setDepartments(data.data || [])
            }
        } catch (err) {
            console.error('Fetch departments error:', err)
        }
    }

    // Fetch coordinators
    const fetchCoordinators = async () => {
        try {
            const response = await fetch('/api/users?Role=event_coordinator', {
                headers: getAuthHeaders()
            })
            const data = await response.json()
            if (Array.isArray(data)) {
                setCoordinators(data)
            } else if (data && Array.isArray(data.data)) {
                setCoordinators(data.data)
            } else {
                setCoordinators([])
            }
        } catch (err) {
            console.error('Fetch coordinators error:', err)
        }
    }

    useEffect(() => {
        fetchEvents()
        fetchDepartments()
        fetchCoordinators()
    }, [])

    // Filter events
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.EventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.Description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDepartment = !filterDepartment || event.DepartmentID?._id === filterDepartment
        return matchesSearch && matchesDepartment
    })

    // Open modal for add
    const handleAdd = () => {
        setModalMode('add')
        setFormData({
            EventName: '',
            Tagline: '',
            Description: '',
            DepartmentID: '',
            EventCoordinatorID: '',
            Location: '',
            GroupMinParticipants: 1,
            GroupMaxParticipants: 5,
            MaxGroupsAllowed: 50,
            Fees: 0,
            EventDate: '',
            EventTime: ''
        })
        setFormError('')
        setShowModal(true)
    }

    // Open modal for edit
    const handleEdit = (event) => {
        setModalMode('edit')
        setSelectedEvent(event)
        setFormData({
            EventName: event.EventName || '',
            Tagline: event.Tagline || '',
            Description: event.Description || '',
            DepartmentID: event.DepartmentID?._id || '',
            EventCoordinatorID: event.EventCoordinatorID?._id || '',
            Location: event.Location || '',
            GroupMinParticipants: event.GroupMinParticipants || 1,
            GroupMaxParticipants: event.GroupMaxParticipants || 5,
            MaxGroupsAllowed: event.MaxGroupsAllowed || 50,
            Fees: event.Fees || 0,
            EventDate: event.EventDate ? event.EventDate.split('T')[0] : '',
            EventTime: event.EventTime || ''
        })
        setFormError('')
        setShowModal(true)
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')

        if (!formData.DepartmentID) {
            setFormError('Please select a department')
            setFormLoading(false)
            return
        }

        if (formData.GroupMinParticipants > formData.GroupMaxParticipants) {
            setFormError('Min participants cannot be greater than max')
            setFormLoading(false)
            return
        }

        try {
            const url = modalMode === 'add'
                ? '/api/events'
                : `/api/events/${selectedEvent._id}`

            const method = modalMode === 'add' ? 'POST' : 'PUT'

            const submitData = { ...formData }
            if (submitData.EventCoordinatorID === '') {
                submitData.EventCoordinatorID = null
            }

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(submitData)
            })

            const data = await response.json()

            if (data.success) {
                setShowModal(false)
                fetchEvents()
            } else {
                setFormError(data.message || 'Operation failed')
            }
        } catch (err) {
            console.error('Submit error:', err)
            setFormError('Failed to save event')
        }
        setFormLoading(false)
    }

    // Handle delete
    const handleDelete = async () => {
        if (!deleteTarget) return

        try {
            const response = await fetch(`/api/events/${deleteTarget._id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
            const data = await response.json()

            if (data.success) {
                setShowDeleteConfirm(false)
                setDeleteTarget(null)
                fetchEvents()
            } else {
                alert(data.message || 'Failed to delete')
            }
        } catch (err) {
            console.error('Delete error:', err)
            alert('Failed to delete event')
        }
    }

    const confirmDelete = (event) => {
        setDeleteTarget(event)
        setShowDeleteConfirm(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Events</h1>
                    <p className="text-white/60">Manage all events and competitions</p>
                </div>
                <button onClick={handleAdd} className="btn-glow flex items-center gap-2">
                    <span className="relative z-10 flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Event</span>
                </button>
            </div>

            {/* Search, Filter & Refresh */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                    />
                </div>
                <div className="relative">
                    <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="pl-12 pr-8 py-3 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 appearance-none cursor-pointer min-w-[200px] [&>option]:bg-midnight-900 [&>option]:text-white"
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept._id} value={dept._id}>{dept.DepartmentName}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={fetchEvents}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                    <HiOutlineRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="glass-card p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading events...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineCalendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No events found</p>
                    <button onClick={handleAdd} className="mt-4 text-accent-400 hover:text-accent-300">
                        Add your first event
                    </button>
                </div>
            ) : (
                /* Events Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card-hover p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                    <HiOutlineCalendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(event)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{event.EventName}</h3>
                            {event.Tagline && (
                                <p className="text-sm text-white/60 mb-2 italic">{event.Tagline}</p>
                            )}
                            <p className="text-sm text-accent-400 mb-4">
                                {event.DepartmentID?.DepartmentName || 'Unknown Department'}
                            </p>

                            <div className="space-y-2 text-sm">
                                {event.Location && (
                                    <div className="flex items-center gap-2 text-white/50">
                                        <HiOutlineLocationMarker className="w-4 h-4" />
                                        <span>{event.Location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-white/50">
                                    <HiOutlineUserGroup className="w-4 h-4" />
                                    <span>{event.GroupMinParticipants}-{event.GroupMaxParticipants} per group</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/50">
                                    <HiOutlineCurrencyRupee className="w-4 h-4" />
                                    <span>₹{event.Fees || 0}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                <p className="text-xs text-white/40">
                                    {event.EventDate ? new Date(event.EventDate).toLocaleDateString() : 'Date TBD'}
                                </p>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                    {event.MaxGroupsAllowed} spots
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-lg my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {modalMode === 'add' ? 'Add Event' : 'Edit Event'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60"
                                >
                                    <HiOutlineX className="w-5 h-5" />
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Event Name *</label>
                                    <input
                                        type="text"
                                        value={formData.EventName}
                                        onChange={(e) => setFormData({ ...formData, EventName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="Enter event name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Tagline</label>
                                    <input
                                        type="text"
                                        value={formData.Tagline}
                                        onChange={(e) => setFormData({ ...formData, Tagline: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="Short catchy tagline"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Department *</label>
                                    <select
                                        value={formData.DepartmentID}
                                        onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })}
                                        className="w-full px-4 py-3 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>{dept.DepartmentName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Event Coordinator</label>
                                    <select
                                        value={formData.EventCoordinatorID}
                                        onChange={(e) => setFormData({ ...formData, EventCoordinatorID: e.target.value })}
                                        className="w-full px-4 py-3 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                    >
                                        <option value="">Select Coordinator</option>
                                        {coordinators.map(coord => (
                                            <option key={coord._id} value={coord._id}>{coord.UserName} ({coord.EmailAddress})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Description</label>
                                    <textarea
                                        value={formData.Description}
                                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 resize-none"
                                        placeholder="Event description"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Location</label>
                                    <input
                                        type="text"
                                        value={formData.Location}
                                        onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="Event venue"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">Min Participants</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.GroupMinParticipants}
                                            onChange={(e) => setFormData({ ...formData, GroupMinParticipants: e.target.value === '' ? '' : parseInt(e.target.value) || 1 })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">Max Participants</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.GroupMaxParticipants}
                                            onChange={(e) => setFormData({ ...formData, GroupMaxParticipants: e.target.value === '' ? '' : parseInt(e.target.value) || 5 })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">Max Groups</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.MaxGroupsAllowed}
                                            onChange={(e) => setFormData({ ...formData, MaxGroupsAllowed: e.target.value === '' ? '' : parseInt(e.target.value) || 50 })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">Fees (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.Fees}
                                            onChange={(e) => setFormData({ ...formData, Fees: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">Event Date</label>
                                        <input
                                            type="date"
                                            value={formData.EventDate}
                                            onChange={(e) => setFormData({ ...formData, EventDate: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">Event Time</label>
                                        <input
                                            type="time"
                                            value={formData.EventTime}
                                            onChange={(e) => setFormData({ ...formData, EventTime: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 btn-glow disabled:opacity-50"
                                    >
                                        {formLoading ? 'Saving...' : (modalMode === 'add' ? 'Add Event' : 'Save Changes')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <HiOutlineTrash className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
                            <p className="text-white/60 mb-6">
                                Are you sure you want to delete "{deleteTarget?.EventName}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
