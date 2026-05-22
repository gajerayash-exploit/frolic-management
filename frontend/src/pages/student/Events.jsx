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
    HiOutlineTrash,
    HiOutlineCreditCard,
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineLightningBolt
} from 'react-icons/hi'

// ─── Mock Payment Gateway Component ─────────────────────────────
function MockPaymentGateway({ amount, eventName, onSuccess, onCancel }) {
    const [payMethod, setPayMethod] = useState('card') // 'card' | 'upi'
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
    const [upiId, setUpiId] = useState('')

    const fillTestCard = () => {
        setCard({ number: '4242 4242 4242 4242', expiry: '12/28', cvv: '123', name: 'Test Student' })
    }

    const fillTestUpi = () => {
        setUpiId('teststudent@upi')
    }

    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 16)
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    }

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4)
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
        return digits
    }

    const canSubmit = payMethod === 'card'
        ? card.number.replace(/\s/g, '').length === 16 && card.expiry.length >= 4 && card.cvv.length === 3 && card.name.trim()
        : upiId.includes('@')

    const handlePay = () => {
        if (!canSubmit) return
        setProcessing(true)
        // Simulate processing delay
        setTimeout(() => {
            setProcessing(false)
            setSuccess(true)
            // After showing success, call onSuccess
            setTimeout(() => {
                onSuccess()
            }, 1800)
        }, 2500)
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-md"
            >
                {/* Success Screen */}
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-emerald-900/90 to-teal-900/90 border border-emerald-500/30 rounded-3xl p-8 text-center backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                        >
                            <HiOutlineCheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
                        </motion.div>
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl font-bold text-white mb-2"
                        >
                            Payment Successful!
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-emerald-300 text-sm"
                        >
                            ₹{amount} paid for {eventName}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-white/50 text-xs mt-2"
                        >
                            Completing registration...
                        </motion.p>
                    </motion.div>
                ) : (
                    /* Payment Form */
                    <div className="bg-gradient-to-br from-midnight-950 to-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/70 text-xs font-medium">FROLIC PAY</p>
                                        <p className="text-white font-bold text-lg">₹{amount}</p>
                                    </div>
                                </div>
                                <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors p-1">
                                    <HiOutlineX className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-white/60 text-xs mt-2">Registration fee for {eventName}</p>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Method Toggle */}
                            <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                                <button
                                    onClick={() => setPayMethod('card')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        payMethod === 'card'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    <HiOutlineCreditCard className="w-4 h-4" />
                                    Credit Card
                                </button>
                                <button
                                    onClick={() => setPayMethod('upi')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        payMethod === 'upi'
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    <HiOutlineLightningBolt className="w-4 h-4" />
                                    UPI
                                </button>
                            </div>

                            {payMethod === 'card' ? (
                                <div className="space-y-4">
                                    {/* Card Number */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={card.number}
                                                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                className="input-glass font-mono tracking-wider"
                                            />
                                            <HiOutlineCreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                        </div>
                                    </div>

                                    {/* Expiry + CVV */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Expiry</label>
                                            <input
                                                type="text"
                                                value={card.expiry}
                                                onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="input-glass font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">CVV</label>
                                            <input
                                                type="password"
                                                value={card.cvv}
                                                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                                                placeholder="•••"
                                                maxLength={3}
                                                className="input-glass font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Cardholder Name */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={card.name}
                                            onChange={(e) => setCard({ ...card, name: e.target.value })}
                                            placeholder="Name on card"
                                            className="input-glass"
                                        />
                                    </div>

                                    {/* Test Card Button */}
                                    <button
                                        type="button"
                                        onClick={fillTestCard}
                                        className="w-full py-2 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                                        Use Test Card (Auto-fill)
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Fake QR Code */}
                                    <div className="flex flex-col items-center py-4">
                                        <div className="w-40 h-40 bg-white rounded-2xl p-2 mb-4 shadow-lg overflow-hidden flex items-center justify-center">
                                            <img src="/qr.png" alt="Payment QR Code" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-white/40 text-xs">Scan QR code or enter UPI ID below</p>
                                    </div>

                                    {/* UPI ID Input */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">UPI ID</label>
                                        <input
                                            type="text"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="yourname@upi"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>

                                    {/* Test UPI Button */}
                                    <button
                                        type="button"
                                        onClick={fillTestUpi}
                                        className="w-full py-2 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <HiOutlineLightningBolt className="w-3.5 h-3.5" />
                                        Use Test UPI (Auto-fill)
                                    </button>
                                </div>
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handlePay}
                                disabled={!canSubmit || processing}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineShieldCheck className="w-5 h-5" />
                                        Pay ₹{amount}
                                    </>
                                )}
                            </button>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 text-white/30 text-[10px]">
                                <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                                <span>Secured by Frolic Pay • Mock Gateway for Demo</span>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

// ─── Main Student Events Component ──────────────────────────────
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
    const [showPayment, setShowPayment] = useState(false)

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

    const submitRegistration = async (paymentDone = false) => {
        setRegisterError('')
        setRegisterSuccess('')
        setRegisterLoading(true)

        try {
            const token = localStorage.getItem('frolic_token')
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    GroupName: groupName,
                    EventID: selectedEvent._id,
                    Participants: participants,
                    IsPaymentDone: paymentDone
                })
            })
            const data = await res.json()
            if (data.success) {
                setRegisterSuccess(paymentDone ? 'Payment received & group registered successfully! 🎉' : 'Group registered successfully!')
                setGroupName('')
                setParticipants([{ Name: '', EnrollmentNum: '', InstituteName: '', City: '', Phone: '', Email: '', IsGroupLeader: true }])
                setTimeout(() => {
                    setShowRegister(false)
                    setShowPayment(false)
                    setRegisterSuccess('')
                }, 2500)
            } else {
                setRegisterError(data.message || 'Registration failed')
            }
        } catch (error) {
            setRegisterError('Server error. Please try again.')
        } finally {
            setRegisterLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setRegisterError('')

        // Pre-check: validate group name uniqueness before proceeding
        try {
            const res = await fetch('/api/groups')
            const data = await res.json()
            const existingGroups = data.data || []
            const duplicate = existingGroups.find(g =>
                g.GroupName.toLowerCase() === groupName.trim().toLowerCase() &&
                (g.EventID?._id || g.EventID) === selectedEvent._id
            )
            if (duplicate) {
                setRegisterError(`Group name "${groupName}" is already taken for this event. Please choose a different name.`)
                return
            }
        } catch (err) {
            // If pre-check fails, let the backend handle it
        }

        // If the event has fees, show mock payment gateway first
        if (selectedEvent.Fees > 0) {
            setShowPayment(true)
        } else {
            // Free event — register directly
            submitRegistration(false)
        }
    }

    const handlePaymentSuccess = () => {
        // Payment "succeeded" — now submit registration with payment done
        setShowPayment(false)
        submitRegistration(true)
    }

    const openRegister = (event) => {
        setSelectedEvent(event)
        setShowRegister(true)
        setShowPayment(false)
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
                                        {selectedEvent.Fees > 0 && <span className="text-indigo-400 ml-2">• Fee: ₹{selectedEvent.Fees}</span>}
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

                                {/* Fee Notice */}
                                {selectedEvent.Fees > 0 && (
                                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
                                        <HiOutlineCurrencyRupee className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-white font-medium">Registration Fee: ₹{selectedEvent.Fees}</p>
                                            <p className="text-xs text-white/50">You will be redirected to Frolic Pay to complete your payment</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowRegister(false)} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={registerLoading || participants.length < selectedEvent.GroupMinParticipants}
                                        className={`px-6 py-2 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            selectedEvent.Fees > 0
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {registerLoading ? 'Registering...' : selectedEvent.Fees > 0 ? `Proceed to Pay ₹${selectedEvent.Fees}` : 'Register Group'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mock Payment Gateway */}
            <AnimatePresence>
                {showPayment && selectedEvent && (
                    <MockPaymentGateway
                        amount={selectedEvent.Fees}
                        eventName={selectedEvent.EventName}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setShowPayment(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
