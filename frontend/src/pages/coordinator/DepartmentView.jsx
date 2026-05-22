import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineOfficeBuilding,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineLocationMarker,
    HiOutlineClipboardList
} from 'react-icons/hi'

export default function DepartmentView() {
    const { user } = useAuth()
    const [department, setDepartment] = useState(null)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch my department
                const deptRes = await fetch(`/api/departments?DepartmentCoordinatorID=${user?.id || user?._id}`)
                const deptData = await deptRes.json()

                if (deptData.data && deptData.data.length > 0) {
                    const myDept = deptData.data[0]
                    setDepartment(myDept)

                    // Fetch events for this department
                    const eventRes = await fetch(`/api/events?DepartmentID=${myDept._id}`)
                    const eventData = await eventRes.json()
                    setEvents(eventData.data || [])
                }
            } catch (error) {
                console.error('Error fetching department data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id || user?._id) {
            fetchData()
        }
    }, [user])

    if (loading) return <div className="text-white/60">Loading...</div>

    if (!department) {
        return (
            <div className="glass-card p-12 text-center">
                <HiOutlineOfficeBuilding className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No Department Assigned</h2>
                <p className="text-white/60">You have not been assigned to any department yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Department Header */}
            <div className="glass-card p-8 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/20">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <span className="text-3xl font-bold text-white">
                            {department.DepartmentName.charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-2">{department.DepartmentName}</h1>
                        <p className="text-white/60">
                            Institute: <span className="text-white">{department.InstituteID?.InstituteName}</span>
                        </p>
                        <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                                <HiOutlineCalendar className="w-5 h-5 text-purple-400" />
                                <span className="text-white">{events.length} Events Managed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Department Events</h2>
                    <Link to="/coordinator/events" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                        Manage Events
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                        <p className="text-white/60">No events found for this department.</p>
                        <Link to="/coordinator/events" className="text-purple-400 mt-2 inline-block hover:underline">Create one now</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card-hover p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                        <HiOutlineCalendar className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${event.IsActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {event.IsActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-white mb-1">{event.EventName}</h3>
                                <p className="text-sm text-white/40 mb-4 line-clamp-2">{event.Description}</p>

                                <div className="space-y-2 text-sm text-white/60">
                                    <div className="flex items-center gap-2">
                                        <HiOutlineLocationMarker className="w-4 h-4" />
                                        <span>{event.Location || 'TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HiOutlineUsers className="w-4 h-4" />
                                        <span>Coordinator: {event.EventCoordinatorID?.UserName || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
