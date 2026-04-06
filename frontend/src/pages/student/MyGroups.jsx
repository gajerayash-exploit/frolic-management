import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineUserGroup,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineCalendar
} from 'react-icons/hi'

export default function StudentMyGroups() {
    const { user } = useAuth()
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMyGroups()
    }, [user])

    const fetchMyGroups = async () => {
        try {
            const res = await fetch('/api/groups')
            const data = await res.json()
            // Filter groups created by this user
            const myGroups = (data.data || []).filter(g =>
                (g.CreatedBy?._id || g.CreatedBy) === user?._id
            )
            setGroups(myGroups)
        } catch (error) {
            console.error('Error fetching groups:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">My Groups</h1>
                <p className="text-white/60">Groups you have registered</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading your groups...</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineUserGroup className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Groups Yet</h2>
                    <p className="text-white/60">You haven't registered for any events yet. Browse events to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map((group, index) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{group.GroupName}</h3>
                                    <p className="text-sm text-blue-400 flex items-center gap-1 mt-1">
                                        <HiOutlineCalendar className="w-4 h-4" />
                                        {group.EventID?.EventName || 'Unknown Event'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${group.IsPaymentDone
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {group.IsPaymentDone ? <HiOutlineCheckCircle className="w-3.5 h-3.5" /> : <HiOutlineXCircle className="w-3.5 h-3.5" />}
                                    {group.IsPaymentDone ? 'Payment Done' : 'Payment Pending'}
                                </span>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${group.IsPresent
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {group.IsPresent ? 'Present' : 'Attendance Pending'}
                                </span>
                            </div>

                            {group.participants && group.participants.length > 0 && (
                                <div className="border-t border-white/10 pt-3">
                                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Members ({group.participants.length})</p>
                                    <div className="space-y-1.5">
                                        {group.participants.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="text-white/70">
                                                    {p.Name}
                                                    {p.IsGroupLeader && <span className="text-amber-400 text-xs ml-1">(Leader)</span>}
                                                </span>
                                                <span className="text-white/40 text-xs">{p.EnrollmentNum}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
