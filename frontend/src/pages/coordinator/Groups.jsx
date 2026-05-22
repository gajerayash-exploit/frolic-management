import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineUsers,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineCalendar,
    HiOutlineSearch,
    HiOutlineEye
} from 'react-icons/hi'

export default function CoordinatorGroups() {
    const { user } = useAuth()
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGroup, setSelectedGroup] = useState(null)

    useEffect(() => {
        fetchGroups()
    }, [user])

    const fetchGroups = async () => {
        try {
            // Fetch groups relevant to this coordinator
            // Since getAllGroups filters are generic, we might need to filter by events first.
            // But checking the backend groupController, it returns all groups if no query.
            // Ideally we need: /api/groups?CoordinatorID=... or filter frontend.
            // For now, let's fetch all and filter by the events I manage (which might be heavy but functional).
            // A better backend approach: /api/groups?MyGroups=true

            // For this demo: Fetch all groups, and we can filter if we strongly enforced read access.
            // But let's assume the user just wants to see groups for their events.

            // 1. Get My Events
            let eventUrl = '/api/events'
            if (user.role === 'institute_coordinator') {
                // ... (simpler logic: get all groups for now, in real app filter by Institute)
            } else if (user.role === 'department_coordinator') {
                const deptRes = await fetch(`/api/departments?DepartmentCoordinatorID=${user?.id || user?._id}`)
                const deptData = await deptRes.json()
                if (deptData.data && deptData.data.length > 0) {
                    eventUrl = `/api/events?DepartmentID=${deptData.data[0]._id}`
                }
            } else if (user.role === 'event_coordinator') {
                eventUrl = `/api/events?EventCoordinatorID=${user?.id || user?._id}`
            }

            const eventRes = await fetch(eventUrl)
            const eventData = await eventRes.json()
            const myEventIds = (eventData.data || []).map(e => e._id)

            // 2. Get Groups for these events
            const groupRes = await fetch('/api/groups')
            const groupData = await groupRes.json()

            const filteredGroups = (groupData.data || []).filter(g => myEventIds.includes(g.EventID?._id || g.EventID))
            setGroups(filteredGroups)
        } catch (error) {
            console.error('Error fetching groups:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (groupId, field, value) => {
        try {
            const token = localStorage.getItem('frolic_token')
            const res = await fetch(`/api/groups/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            })

            if (res.ok) {
                // Update local state
                setGroups(groups.map(g =>
                    g._id === groupId ? { ...g, [field]: value } : g
                ))
            }
        } catch (error) {
            console.error('Update status error:', error)
        }
    }

    const filteredGroups = groups.filter(group =>
        group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.EventID?.EventName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Group Management</h1>
                    <p className="text-white/60">Manage teams, attendance, and payments</p>
                </div>

                <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 w-full md:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading groups...</p>
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineUsers className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Groups Found</h2>
                    <p className="text-white/60">No groups have registered for your events yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredGroups.map((group, index) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{group.GroupName}</h3>
                                <p className="text-sm text-accent-400 mb-2">{group.EventID?.EventName}</p>
                                <p className="text-sm text-white/60">
                                    Registered by: {group.CreatedBy?.UserName || 'Unknown'} •
                                    {/* {group.participantCount} members */}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-white/40 uppercase tracking-wider">Payment</span>
                                    <button
                                        onClick={() => handleUpdateStatus(group._id, 'IsPaymentDone', !group.IsPaymentDone)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${group.IsPaymentDone
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                            }`}
                                    >
                                        {group.IsPaymentDone ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                                        {group.IsPaymentDone ? 'Paid' : 'Pending'}
                                    </button>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-white/40 uppercase tracking-wider">Attendance</span>
                                    <button
                                        onClick={() => handleUpdateStatus(group._id, 'IsPresent', !group.IsPresent)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${group.IsPresent
                                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                            }`}
                                    >
                                        {group.IsPresent ? <HiOutlineCheckCircle /> : <HiOutlineUsers />}
                                        {group.IsPresent ? 'Present' : 'Absent'}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setSelectedGroup(group)}
                                    className="p-2 bg-white/5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    title="View Participants"
                                >
                                    <HiOutlineEye className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Details & Participants Modal */}
            <AnimatePresence>
                {selectedGroup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedGroup.GroupName}</h3>
                                    <p className="text-accent-400 text-sm">{selectedGroup.EventID?.EventName}</p>
                                </div>
                                <button onClick={() => setSelectedGroup(null)} className="text-white/60 hover:text-white">
                                    <HiOutlineXCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <p className="text-xs text-white/40 mb-1">Registered By</p>
                                    <p className="text-sm text-white truncate" title={selectedGroup.CreatedBy?.UserName || 'Unknown'}>{selectedGroup.CreatedBy?.UserName || 'Unknown'}</p>
                                    <p className="text-xs text-white/60 break-all">{selectedGroup.CreatedBy?.EmailAddress}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <p className="text-xs text-white/40 mb-1">Status</p>
                                    <p className="text-sm text-white flex items-center gap-2">
                                        Payment: <span className={selectedGroup.IsPaymentDone ? 'text-green-400' : 'text-red-400'}>{selectedGroup.IsPaymentDone ? 'Done' : 'Pending'}</span>
                                    </p>
                                    <p className="text-sm text-white flex items-center gap-2">
                                        Attendance: <span className={selectedGroup.IsPresent ? 'text-blue-400' : 'text-gray-400'}>{selectedGroup.IsPresent ? 'Present' : 'Absent'}</span>
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
                                <span>Participants</span>
                                <span className="text-sm font-normal text-white/50">{selectedGroup.participants?.length || 0} members</span>
                            </h4>
                            <div className="space-y-4">
                                {selectedGroup.participants && selectedGroup.participants.length > 0 ? (
                                    selectedGroup.participants.map((p, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-white flex items-center gap-2 flex-wrap">
                                                    <span className="truncate">{p.Name}</span>
                                                    {p.IsGroupLeader && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 whitespace-nowrap">Leader</span>}
                                                </h4>
                                                <p className="text-sm text-white/50 truncate">{p.EnrollmentNum} • {p.InstituteName}</p>
                                            </div>
                                            <div className="sm:text-right text-sm text-white/50 flex-shrink-0 max-w-full">
                                                <p className="break-all sm:break-normal truncate sm:max-w-[200px]" title={p.Email}>{p.Email}</p>
                                                <p>{p.Phone}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-white/50 py-4">No participants found (or not loaded)</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
