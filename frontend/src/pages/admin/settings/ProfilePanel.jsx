import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCheck } from 'react-icons/hi'
import SettingSection from './components/SettingSection'

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('frolic_token')
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

export default function ProfilePanel({ user, onUserUpdate }) {
    const [form, setForm] = useState({
        UserName: user?.UserName || '',
        EmailAddress: user?.EmailAddress || '',
        PhoneNumber: user?.PhoneNumber || '',
    })
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSaved(false)

        try {
            const response = await fetch('/api/settings/profile', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(form)
            })
            const data = await response.json()

            if (data.success) {
                // Update localStorage so the sidebar and header reflect changes
                const storedUser = JSON.parse(localStorage.getItem('frolic_user') || '{}')
                const updated = { ...storedUser, ...data.user }
                localStorage.setItem('frolic_user', JSON.stringify(updated))

                if (onUserUpdate) onUserUpdate(updated)

                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            } else {
                setError(data.message || 'Failed to update profile')
            }
        } catch (err) {
            console.error('Profile update error:', err)
            setError('Failed to connect to server')
        }
        setLoading(false)
    }

    return (
        <SettingSection
            title="Personal Information"
            description="Update your profile details used across the platform"
        >
            <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
                {/* Avatar + Role Badge */}
                <div className="flex items-center gap-5 pb-5 border-b border-white/5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-glow-sm">
                        <span className="text-3xl font-bold text-white">
                            {form.UserName?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                    </div>
                    <div>
                        <p className="text-white font-semibold text-lg">{form.UserName || 'Admin User'}</p>
                        <span className="inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full bg-accent-500/20 text-accent-400 border border-accent-500/30">
                            {user?.Role || user?.role || 'admin'}
                        </span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Fields */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="settings-name" className="text-sm text-white/60 mb-2 block">Full Name</label>
                        <input
                            id="settings-name"
                            type="text"
                            value={form.UserName}
                            onChange={(e) => setForm({ ...form, UserName: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 transition-colors"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="settings-email" className="text-sm text-white/60 mb-2 block">Email Address</label>
                            <input
                                id="settings-email"
                                type="email"
                                value={form.EmailAddress}
                                onChange={(e) => setForm({ ...form, EmailAddress: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 transition-colors"
                                placeholder="admin@frolic.com"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-phone" className="text-sm text-white/60 mb-2 block">Phone Number</label>
                            <input
                                id="settings-phone"
                                type="tel"
                                value={form.PhoneNumber}
                                onChange={(e) => setForm({ ...form, PhoneNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 transition-colors"
                                placeholder="9999999999"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4 pt-2">
                    <button type="submit" disabled={loading} className="btn-glow disabled:opacity-50">
                        <span className="relative z-10 flex items-center gap-2">
                            {saved && <HiOutlineCheck className="w-4 h-4" />}
                            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                        </span>
                    </button>
                    {saved && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-emerald-400"
                        >
                            Profile updated successfully
                        </motion.span>
                    )}
                </div>
            </form>
        </SettingSection>
    )
}
