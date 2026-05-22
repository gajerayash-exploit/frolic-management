import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineOfficeBuilding,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlinePlus,
    HiOutlineLocationMarker
} from 'react-icons/hi'

export default function InstituteView() {
    const { user } = useAuth()
    const [institute, setInstitute] = useState(null)
    const [departments, setDepartments] = useState([])
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch my institute
                const instRes = await fetch(`/api/institutes?InstituteCoordinatorID=${user?.id || user?._id}`)
                const instData = await instRes.json()

                if (instData.data && instData.data.length > 0) {
                    const myInstitute = instData.data[0]
                    setInstitute(myInstitute)

                    // Fetch departments for this institute
                    const deptRes = await fetch(`/api/departments?InstituteID=${myInstitute._id}`)
                    const deptData = await deptRes.json()
                    setDepartments(deptData.data || [])

                    // Fetch events for this institute's departments? 
                    // Or maybe just fetch all events and filter?
                    // Better verify if we can get events by institute. 
                    // Current API doesn't support getEventsByInstitute directly properly without loop.
                    // But we can fetch all events and filter in frontend for now or add backend support.
                    // For now, let's fetch all events and filter by department IDs we found.
                    const deptIds = (deptData.data || []).map(d => d._id)
                    const eventRes = await fetch('/api/events')
                    const eventData = await eventRes.json()
                    const myEvents = (eventData.data || []).filter(e => deptIds.includes(e.DepartmentID?._id))
                    setEvents(myEvents)
                }
            } catch (error) {
                console.error('Error fetching institute data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id || user?._id) {
            fetchData()
        }
    }, [user])

    if (loading) return <div className="text-white/60">Loading...</div>

    if (!institute) {
        return (
            <div className="glass-card p-12 text-center">
                <HiOutlineOfficeBuilding className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No Institute Assigned</h2>
                <p className="text-white/60">You have not been assigned to any institute yet.</p>
                <p className="text-sm text-white/40 mt-2">Please contact an administrator.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Institute Header */}
            <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <HiOutlineOfficeBuilding className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    {institute.InstituteImage ? (
                        <img
                            src={institute.InstituteImage}
                            alt={institute.InstituteName}
                            className="w-32 h-32 rounded-2xl object-cover bg-white/5"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">
                                {institute.InstituteName.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{institute.InstituteName}</h1>
                        <p className="text-white/60 max-w-2xl">{institute.InstituteDescription}</p>
                        <div className="flex items-center gap-4 mt-6">
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                                <HiOutlineUsers className="w-5 h-5 text-accent-400" />
                                <span className="text-white">{departments.length} Departments</span>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                                <HiOutlineCalendar className="w-5 h-5 text-emerald-400" />
                                <span className="text-white">{events.length} Events</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Departments Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Departments</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept, index) => (
                        <motion.div
                            key={dept._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card-hover p-6 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
                                    <HiOutlineUsers className="w-6 h-6 text-accent-400" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{dept.DepartmentName}</h3>
                            <p className="text-sm text-white/40 mb-4">
                                Coordinator: {dept.DepartmentCoordinatorID?.UserName || 'Unassigned'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Events */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Latest Events</h2>
                    <Link to="/coordinator/events" className="text-accent-400 hover:text-accent-300 text-sm">
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.slice(0, 4).map((event, index) => (
                        <div key={event._id} className="glass-card p-4 flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center">
                                <HiOutlineCalendar className="w-8 h-8 text-white/40" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{event.EventName}</h4>
                                <p className="text-sm text-white/60">{event.DepartmentID?.DepartmentName}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                                    <HiOutlineLocationMarker className="w-3 h-3" />
                                    <span>{event.Location || 'TBD'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
