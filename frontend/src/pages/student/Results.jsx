import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    HiOutlineStar,
    HiOutlineSearch
} from 'react-icons/hi'

const sequenceLabels = { 1: '1st Place 🥇', 2: '2nd Place 🥈', 3: '3rd Place 🥉' }
const sequenceColors = {
    1: 'from-yellow-500 to-amber-500',
    2: 'from-gray-300 to-gray-400',
    3: 'from-amber-600 to-orange-700'
}

export default function StudentResults() {
    const [winners, setWinners] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchResults()
    }, [])

    const fetchResults = async () => {
        try {
            const res = await fetch('/api/winners')
            const data = await res.json()
            setWinners(data.data || [])
        } catch (error) {
            console.error('Error fetching results:', error)
        } finally {
            setLoading(false)
        }
    }

    // Group winners by event
    const eventMap = {}
    winners.forEach(w => {
        const eventId = w.EventID?._id || w.EventID
        const eventName = w.EventID?.EventName || 'Unknown Event'
        if (!eventMap[eventId]) {
            eventMap[eventId] = { eventName, deptName: w.EventID?.DepartmentID?.DepartmentName || '', winners: [] }
        }
        eventMap[eventId].winners.push(w)
    })

    const eventEntries = Object.entries(eventMap).filter(([_, data]) =>
        data.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.winners.some(w => w.GroupID?.GroupName?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Results</h1>
                    <p className="text-white/60">Event winners and achievements</p>
                </div>
                <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search events or groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 w-full md:w-72"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading results...</p>
                </div>
            ) : eventEntries.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineStar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">No Results Yet</h2>
                    <p className="text-white/60">Winners will be announced after events are completed.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {eventEntries.map(([eventId, data], eIndex) => (
                        <motion.div
                            key={eventId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: eIndex * 0.1 }}
                            className="glass-card p-6"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white">{data.eventName}</h3>
                                {data.deptName && <p className="text-sm text-blue-400">{data.deptName}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {data.winners
                                    .sort((a, b) => a.Sequence - b.Sequence)
                                    .map((winner) => (
                                        <div
                                            key={winner._id}
                                            className="relative p-5 rounded-xl bg-white/5 border border-white/10 text-center"
                                        >
                                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${sequenceColors[winner.Sequence] || 'from-gray-500 to-gray-600'} flex items-center justify-center mx-auto mb-3`}>
                                                <span className="text-white text-lg font-bold">#{winner.Sequence}</span>
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-1">{winner.GroupID?.GroupName || 'Unknown'}</h4>
                                            <p className="text-sm text-white/50">{sequenceLabels[winner.Sequence]}</p>
                                            {winner.Prize && (
                                                <p className="text-xs text-amber-400 mt-2">Prize: {winner.Prize}</p>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
