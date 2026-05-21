import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
    HiOutlineUserGroup,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineCalendar,
    HiOutlinePencilAlt,
    HiOutlineX,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineSave,
    HiOutlineLockClosed
} from 'react-icons/hi'

export default function StudentMyGroups() {
    const { user } = useAuth()
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    // Edit modal state
    const [editGroup, setEditGroup] = useState(null)
    const [editGroupName, setEditGroupName] = useState('')
    const [editParticipants, setEditParticipants] = useState([])
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState('')
    const [editSuccess, setEditSuccess] = useState('')
    const [eventLimits, setEventLimits] = useState({ min: 1, max: 10 })

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

    // Open edit modal
    const openEdit = async (group) => {
        setEditGroup(group)
        setEditGroupName(group.GroupName)
        setEditError('')
        setEditSuccess('')

        // Map existing participants
        const existing = (group.participants || []).map(p => ({
            Name: p.Name || '',
            EnrollmentNum: p.EnrollmentNum || '',
            InstituteName: p.InstituteName || '',
            City: p.City || '',
            Phone: p.Phone || '',
            Email: p.Email || '',
            IsGroupLeader: p.IsGroupLeader || false
        }))
        setEditParticipants(existing.length > 0 ? existing : [
            { Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: true }
        ])

        // Fetch event limits
        try {
            const eventId = group.EventID?._id || group.EventID
            const res = await fetch(`/api/events`)
            const data = await res.json()
            const event = (data.data || []).find(e => e._id === eventId)
            if (event) {
                setEventLimits({ min: event.GroupMinParticipants || 1, max: event.GroupMaxParticipants || 10 })
            }
        } catch (e) {
            // Fallback
        }
    }

    const addEditParticipant = () => {
        if (editParticipants.length >= eventLimits.max) return
        setEditParticipants([...editParticipants, { Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: false }])
    }

    const removeEditParticipant = (index) => {
        if (editParticipants.length <= 1) return
        const updated = editParticipants.filter((_, i) => i !== index)
        if (!updated.some(p => p.IsGroupLeader)) updated[0].IsGroupLeader = true
        setEditParticipants(updated)
    }

    const updateEditParticipant = (index, field, value) => {
        const updated = [...editParticipants]
        updated[index] = { ...updated[index], [field]: value }
        setEditParticipants(updated)
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault()
        setEditError('')
        setEditSuccess('')
        setEditLoading(true)

        try {
            const token = localStorage.getItem('frolic_token')
            const res = await fetch(`/api/groups/${editGroup._id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    GroupName: editGroupName,
                    Participants: editParticipants
                })
            })
            const data = await res.json()
            if (data.success) {
                setEditSuccess('Group updated successfully! ✅')
                // Update local state
                setGroups(prev => prev.map(g => g._id === editGroup._id ? data.data : g))
                setTimeout(() => {
                    setEditGroup(null)
                    setEditSuccess('')
                }, 1500)
            } else {
                setEditError(data.message || 'Failed to update group')
            }
        } catch (error) {
            setEditError('Server error. Please try again.')
        } finally {
            setEditLoading(false)
        }
    }

    const canEdit = (group) => !group.IsPresent

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
                                {canEdit(group) ? (
                                    <button
                                        onClick={() => openEdit(group)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 transition-colors"
                                    >
                                        <HiOutlinePencilAlt className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-500/15 text-gray-400">
                                        <HiOutlineLockClosed className="w-3.5 h-3.5" />
                                        Locked
                                    </span>
                                )}
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

            {/* Edit Group Modal */}
            <AnimatePresence>
                {editGroup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <HiOutlinePencilAlt className="w-5 h-5 text-indigo-400" />
                                        Edit Group
                                    </h3>
                                    <p className="text-sm text-white/50">
                                        {editGroup.EventID?.EventName} • {eventLimits.min}-{eventLimits.max} members allowed
                                    </p>
                                </div>
                                <button onClick={() => setEditGroup(null)} className="text-white/60 hover:text-white">
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                            </div>

                            {editSuccess && (
                                <div className="p-3 bg-green-500/10 text-green-400 rounded-lg text-sm mb-4">{editSuccess}</div>
                            )}
                            {editError && (
                                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm mb-4">{editError}</div>
                            )}

                            <form onSubmit={handleSaveEdit} className="space-y-6">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Group / Team Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editGroupName}
                                        onChange={(e) => setEditGroupName(e.target.value)}
                                        placeholder="e.g. Code Warriors"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                {/* Participants */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-white font-medium">Participants ({editParticipants.length})</h4>
                                        {editParticipants.length < eventLimits.max && (
                                            <button
                                                type="button"
                                                onClick={addEditParticipant}
                                                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                            >
                                                <HiOutlinePlus className="w-4 h-4" /> Add Member
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {editParticipants.map((p, i) => (
                                            <div key={i} className="p-4 bg-white/5 rounded-xl space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-white/60 font-medium">
                                                        Member {i + 1} {p.IsGroupLeader && <span className="text-amber-400">(Leader)</span>}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        {!p.IsGroupLeader && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = editParticipants.map((ep, ei) => ({ ...ep, IsGroupLeader: ei === i }))
                                                                    setEditParticipants(updated)
                                                                }}
                                                                className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors"
                                                            >
                                                                Make Leader
                                                            </button>
                                                        )}
                                                        {editParticipants.length > 1 && (
                                                            <button type="button" onClick={() => removeEditParticipant(i)} className="text-red-400 hover:text-red-300">
                                                                <HiOutlineTrash className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input type="text" required placeholder="Full Name" value={p.Name}
                                                        onChange={(e) => updateEditParticipant(i, 'Name', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
                                                    <input type="text" required placeholder="Enrollment Number" value={p.EnrollmentNum}
                                                        onChange={(e) => updateEditParticipant(i, 'EnrollmentNum', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
                                                    <input type="text" required placeholder="Institute Name" value={p.InstituteName}
                                                        onChange={(e) => updateEditParticipant(i, 'InstituteName', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
                                                    <input type="text" required placeholder="City" value={p.City}
                                                        onChange={(e) => updateEditParticipant(i, 'City', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
                                                    <input type="tel" required placeholder="Phone (10 digits)" value={p.Phone} pattern="[0-9]{10}"
                                                        onChange={(e) => updateEditParticipant(i, 'Phone', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
                                                    <input type="email" required placeholder="Email" value={p.Email}
                                                        onChange={(e) => updateEditParticipant(i, 'Email', e.target.value)}
                                                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Notice */}
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300/80 flex items-start gap-2">
                                    <HiOutlineLockClosed className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>Editing is only available before attendance is marked. Once the event starts, your group details will be locked.</span>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setEditGroup(null)} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editLoading || editParticipants.length < eventLimits.min}
                                        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {editLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <HiOutlineSave className="w-4 h-4" />
                                                Save Changes
                                            </>
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
