import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineCalendar,
    HiOutlineUsers,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineCurrencyRupee,
    HiOutlineClipboardCheck
} from 'react-icons/hi'

export default function EventView() {
    const { user } = useAuth()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch my events
                const eventRes = await fetch(`/api/events?EventCoordinatorID=${user._id}`)
                const eventData = await eventRes.json()
                setEvents(eventData.data || [])
            } catch (error) {
                console.error('Error fetching event data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?._id) {
            fetchData()
        }
    }, [user])

    if (loading) return <div className="text-white/60">Loading...</div>

    if (events.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <HiOutlineCalendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No Assigned Events</h2>
                <p className="text-white/60">You have not been assigned to coordinate any events yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white mb-6">My Assigned Events</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event, index) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-0 overflow-hidden group"
                    >
                        <div className="h-32 bg-gradient-to-r from-orange-500 to-pink-600 relative">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 left-6">
                                <h2 className="text-2xl font-bold text-white shadow-sm">{event.EventName}</h2>
                                <p className="text-white/80 text-sm shadow-sm">{event.Tagline}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 text-white/70">
                                    <HiOutlineLocationMarker className="w-5 h-5 text-orange-400" />
                                    <span>{event.Location || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/70">
                                    <HiOutlineClock className="w-5 h-5 text-orange-400" />
                                    <span>{event.EventTime || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/70">
                                    <HiOutlineUsers className="w-5 h-5 text-orange-400" />
                                    <span>{event.GroupMaxParticipants} Max / Group</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/70">
                                    <HiOutlineCurrencyRupee className="w-5 h-5 text-orange-400" />
                                    <span>Fees: ₹{event.Fees}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 border-t border-white/10 pt-4">
                                <Link
                                    to={`/coordinator/events/${event._id}/participants`}
                                    className="flex-1 py-2 text-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
                                >
                                    Manage Participants
                                </Link>
                                <Link
                                    to="/coordinator/attendance"
                                    className="flex-1 py-2 text-center rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <HiOutlineClipboardCheck className="w-4 h-4" />
                                    Attendance
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
