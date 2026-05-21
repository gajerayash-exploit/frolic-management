import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlineUsers,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineCalendar
} from 'react-icons/hi'

export default function AdminGroups() {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGroup, setSelectedGroup] = useState(null)

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        try {
            const res = await fetch('/api/groups')
            const data = await res.json()
            setGroups(data.data || [])
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ [field]: value })
            })
            if (res.ok) {
                setGroups(groups.map(g => g._id === groupId ? { ...g, [field]: value } : g))
            }
        } catch (error) {
            console.error('Update status error:', error)
        }
    }

    const filteredGroups = groups.filter(g =>
        g.GroupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.EventID?.EventName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Groups</h1>
                    <p className="text-white/60">All registered groups across events</p>
                </div>
                <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search groups or events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 w-full md:w-72"
                    />
                </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Groups', value: groups.length, color: 'blue' },
                    { label: 'Payments Done', value: groups.filter(g => g.IsPaymentDone).length, color: 'emerald' },
                    { label: 'Present', value: groups.filter(g => g.IsPresent).length, color: 'cyan' },
                    { label: 'Pending Payment', value: groups.filter(g => !g.IsPaymentDone).length, color: 'amber' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                        <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                        <p className="text-sm text-white/60">{stat.label}</p>
                    </motion.div>
                ))}
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
                    <p className="text-white/60">No groups have been registered yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredGroups.map((group, index) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{group.GroupName}</h3>
                                <p className="text-sm text-accent-400 flex items-center gap-1">
                                    <HiOutlineCalendar className="w-4 h-4" />
                                    {group.EventID?.EventName || 'Unknown Event'}
                                </p>
                                <p className="text-sm text-white/50 mt-1">By: {group.CreatedBy?.UserName || 'Unknown'}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-white/40 uppercase tracking-wider">Payment</span>
                                    <button
                                        onClick={() => handleUpdateStatus(group._id, 'IsPaymentDone', !group.IsPaymentDone)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${group.IsPaymentDone
                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
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
                                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}
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
                                    <p className="text-sm text-white">{selectedGroup.CreatedBy?.UserName || 'Unknown'}</p>
                                    <p className="text-xs text-white/60">{selectedGroup.CreatedBy?.EmailAddress}</p>
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
                            <div className="space-y-3">
                                {selectedGroup.participants && selectedGroup.participants.length > 0 ? (
                                    selectedGroup.participants.map((p, i) => (
                                        <div key={i} className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium text-white flex items-center gap-2">
                                                    {p.Name} 
                                                    {p.IsGroupLeader && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Leader</span>}
                                                </h4>
                                                <p className="text-sm text-white/50">{p.EnrollmentNum} • {p.InstituteName}</p>
                                            </div>
                                            <div className="text-right text-sm text-white/50">
                                                <p>{p.Email}</p>
                                                <p>{p.Phone}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-white/50 py-4">No participants found</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
