import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlineStar,
    HiOutlineSearch,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineX
} from 'react-icons/hi'

const sequenceLabels = { 1: '1st Place 🥇', 2: '2nd Place 🥈', 3: '3rd Place 🥉' }

export default function AdminWinners() {
    const [winners, setWinners] = useState([])
    const [events, setEvents] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ EventID: '', GroupID: '', Sequence: '1', Prize: '' })
    const [formError, setFormError] = useState('')
    const [eventGroups, setEventGroups] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [winRes, evtRes, grpRes] = await Promise.all([
                fetch('/api/winners'),
                fetch('/api/events'),
                fetch('/api/groups')
            ])
            const [winData, evtData, grpData] = await Promise.all([winRes.json(), evtRes.json(), grpRes.json()])
            setWinners(winData.data || [])
            setEvents(evtData.data || [])
            setGroups(grpData.data || [])
        } catch (err) {
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleEventChange = (eventId) => {
        setForm({ ...form, EventID: eventId, GroupID: '' })
        setEventGroups(groups.filter(g => (g.EventID?._id || g.EventID) === eventId))
    }

    const handleDeclare = async (e) => {
        e.preventDefault()
        setFormError('')
        try {
            const token = localStorage.getItem('frolic_token')
            const res = await fetch('/api/winners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...form, Sequence: Number(form.Sequence) })
            })
            const data = await res.json()
            if (!res.ok) {
                setFormError(data.message || 'Failed to declare winner')
                return
            }
            setShowForm(false)
            setForm({ EventID: '', GroupID: '', Sequence: '1', Prize: '' })
            fetchData()
        } catch (err) {
            setFormError('Server error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Remove this winner declaration?')) return
        try {
            const token = localStorage.getItem('frolic_token')
            await fetch(`/api/winners/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setWinners(winners.filter(w => w._id !== id))
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    const filteredWinners = winners.filter(w =>
        w.EventID?.EventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.GroupID?.GroupName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Winners</h1>
                    <p className="text-white/60">Declare and manage event winners</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full sm:w-auto">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500 w-full sm:w-56"
                        />
                    </div>
                    <button onClick={() => setShowForm(true)} className="btn-glow flex items-center justify-center gap-2 w-full sm:w-auto">
                        <span className="relative z-10 flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Declare Winner</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading winners...</p>
                </div>
            ) : filteredWinners.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineStar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Winners Declared</h2>
                    <p className="text-white/60">Click "Declare Winner" to add winners for events.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredWinners.map((winner, index) => (
                        <motion.div
                            key={winner._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${winner.Sequence === 1 ? 'bg-yellow-500/20 text-yellow-400' : winner.Sequence === 2 ? 'bg-gray-400/20 text-gray-300' : 'bg-amber-700/20 text-amber-600'}`}>
                                    #{winner.Sequence}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{winner.GroupID?.GroupName || 'Unknown Group'}</h3>
                                    <p className="text-sm text-accent-400">{winner.EventID?.EventName || 'Unknown Event'}</p>
                                    {winner.Prize && <p className="text-xs text-white/50 mt-1">Prize: {winner.Prize}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-white/60">{sequenceLabels[winner.Sequence]}</span>
                                <button
                                    onClick={() => handleDelete(winner._id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Remove"
                                >
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Declare Winner Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Declare Winner</h3>
                                <button onClick={() => { setShowForm(false); setFormError('') }} className="text-white/60 hover:text-white">
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                            </div>

                            {formError && <p className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg">{formError}</p>}

                            <form onSubmit={handleDeclare} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Event</label>
                                    <select
                                        value={form.EventID}
                                        onChange={(e) => handleEventChange(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                    >
                                        <option value="">Select Event</option>
                                        {events.map(ev => <option key={ev._id} value={ev._id}>{ev.EventName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Group</label>
                                    <select
                                        value={form.GroupID}
                                        onChange={(e) => setForm({ ...form, GroupID: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                    >
                                        <option value="">Select Group</option>
                                        {eventGroups.map(g => <option key={g._id} value={g._id}>{g.GroupName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Position</label>
                                    <select
                                        value={form.Sequence}
                                        onChange={(e) => setForm({ ...form, Sequence: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                    >
                                        <option value="1">1st Place</option>
                                        <option value="2">2nd Place</option>
                                        <option value="3">3rd Place</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Prize (optional)</label>
                                    <input
                                        type="text"
                                        value={form.Prize}
                                        onChange={(e) => setForm({ ...form, Prize: e.target.value })}
                                        placeholder="e.g. Trophy + ₹5000"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-500"
                                    />
                                </div>
                                <button type="submit" className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-medium transition-colors">
                                    Declare Winner
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
