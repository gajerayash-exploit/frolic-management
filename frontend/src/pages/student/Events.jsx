import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineCalendar,
    HiOutlineSearch,
    HiOutlineLocationMarker,
    HiOutlineUsers,
    HiOutlineCurrencyRupee,
    HiOutlineClock,
    HiOutlineX,
    HiOutlinePlus,
    HiOutlineTrash
} from 'react-icons/hi'

export default function StudentEvents() {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [showRegister, setShowRegister] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)
    const [registerError, setRegisterError] = useState('')
    const [registerSuccess, setRegisterSuccess] = useState('')

    const [groupName, setGroupName] = useState('')
    const [participants, setParticipants] = useState([
        { Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: true }
    ])

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events')
            const data = await res.json()
            setEvents((data.data || []).filter(e => e.IsActive))
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    const addParticipant = () => {
        if (selectedEvent && participants.length >= selectedEvent.GroupMaxParticipants) return
        setParticipants([...participants, { Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: false }])
    }

    const removeParticipant = (index) => {
        if (participants.length <= 1) return
        const updated = participants.filter((_, i) => i !== index)
        if (!updated.some(p => p.IsGroupLeader)) updated[0].IsGroupLeader = true
        setParticipants(updated)
    }

    const updateParticipant = (index, field, value) => {
        const updated = [...participants]
        updated[index] = { ...updated[index], [field]: value }
        setParticipants(updated)
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setRegisterError('')
        setRegisterSuccess('')
        setRegisterLoading(true)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    GroupName: groupName,
                    EventID: selectedEvent._id,
                    Participants: participants
                })
            })
            const data = await res.json()
            if (data.success) {
                setRegisterSuccess('Group registered successfully!')
                setGroupName('')
                setParticipants([{ Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: true }])
                setTimeout(() => {
                    setShowRegister(false)
                    setRegisterSuccess('')
                }, 2000)
            } else {
                setRegisterError(data.message || 'Registration failed')
            }
        } catch (error) {
            setRegisterError('Server error. Please try again.')
        } finally {
            setRegisterLoading(false)
        }
    }

    const openRegister = (event) => {
        setSelectedEvent(event)
        setShowRegister(true)
        setRegisterError('')
        setRegisterSuccess('')
        setGroupName('')
        setParticipants([{ Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: true }])
    }

    const filteredEvents = events.filter(event =>
        event.EventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.DepartmentID?.DepartmentName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Browse Events</h1>
                    <p className="text-white/60">Explore and register for upcoming events</p>
                </div>
                <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 w-full md:w-72"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading events...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineCalendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Events Found</h2>
                    <p className="text-white/60">Check back later for upcoming events.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card-hover p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <HiOutlineCalendar className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${event.RegistrationOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {event.RegistrationOpen ? 'Open' : 'Closed'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1">{event.EventName}</h3>
                            {event.Tagline && <p className="text-sm text-blue-400 mb-2">{event.Tagline}</p>}
                            <p className="text-sm text-white/50 mb-4 line-clamp-2">{event.Description || 'No description available'}</p>

                            <div className="space-y-2 text-sm text-white/60 mb-4 flex-1">
                                <div className="flex items-center gap-2">
                                    <HiOutlineLocationMarker className="w-4 h-4" />
                                    <span>{event.Location || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineUsers className="w-4 h-4" />
                                    <span>{event.GroupMinParticipants}-{event.GroupMaxParticipants} per group</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineCurrencyRupee className="w-4 h-4" />
                                    <span>{event.Fees > 0 ? `₹${event.Fees}` : 'Free'}</span>
                                </div>
                                {event.EventDate && (
                                    <div className="flex items-center gap-2">
                                        <HiOutlineClock className="w-4 h-4" />
                                        <span>{new Date(event.EventDate).toLocaleDateString()} {event.EventTime || ''}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => openRegister(event)}
                                disabled={!event.RegistrationOpen}
                                className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Register Group
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Registration Modal */}
            <AnimatePresence>
                {showRegister && selectedEvent && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Register for {selectedEvent.EventName}</h3>
                                    <p className="text-sm text-white/50">
                                        Team size: {selectedEvent.GroupMinParticipants}-{selectedEvent.GroupMaxParticipants} members
                                    </p>
                                </div>
                                <button onClick={() => setShowRegister(false)} className="text-white/60 hover:text-white">
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                            </div>

                            {registerSuccess && (
                                <div className="p-3 bg-green-500/10 text-green-400 rounded-lg text-sm mb-4">{registerSuccess}</div>
                            )}
                            {registerError && (
                                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm mb-4">{registerError}</div>
                            )}

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Group / Team Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="e.g. Code Warriors"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-white font-medium">Participants ({participants.length})</h4>
                                        {participants.length < selectedEvent.GroupMaxParticipants && (
                                            <button
                                                type="button"
                                                onClick={addParticipant}
                                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                            >
                                                <HiOutlinePlus className="w-4 h-4" /> Add Member
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {participants.map((p, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-xl space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-white/60 font-medium">
                                                        Member {i + 1} {p.IsGroupLeader && <span className="text-amber-400">(Leader)</span>}
                                                    </span>
                                                    {participants.length > 1 && (
                                                        <button type="button" onClick={() => removeParticipant(i)} className="text-red-400 hover:text-red-300">
                                                            <HiOutlineTrash className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input type="text" required placeholder="Full Name" value={p.Name}
                                                        onChange={(e) => updateParticipant(i, 'Name', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                                                    <input type="text" required placeholder="Enrollment Number" value={p.EnrollmentNum}
                                                        onChange={(e) => updateParticipant(i, 'EnrollmentNum', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                                                    <input type="text" required placeholder="Institute Name" value={p.InstituteName}
                                                        onChange={(e) => updateParticipant(i, 'InstituteName', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                                                    <input type="text" required placeholder="City" value={p.City}
                                                        onChange={(e) => updateParticipant(i, 'City', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                                                    <input type="tel" required placeholder="Phone (10 digits)" value={p.Phone} pattern="[0-9]{10}"
                                                        onChange={(e) => updateParticipant(i, 'Phone', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                                                    <input type="email" required placeholder="Email" value={p.Email}
                                                        onChange={(e) => updateParticipant(i, 'Email', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowRegister(false)} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={registerLoading || participants.length < selectedEvent.GroupMinParticipants}
                                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {registerLoading ? 'Registering...' : 'Register Group'}
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
