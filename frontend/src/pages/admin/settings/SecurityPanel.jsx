import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineCheck,
    HiOutlineExclamation
} from 'react-icons/hi'
import SettingSection from './components/SettingSection'
import SettingRow from './components/SettingRow'

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('frolic_token')
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

function PasswordInput({ id, label, value, onChange, show, toggleShow, placeholder }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm text-white/60 mb-2 block">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 transition-colors"
                    placeholder={placeholder}
                    required
                />
                <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                    {show ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    )
}

export default function SecurityPanel() {
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSave = async (e) => {
        e.preventDefault()
        setError('')
        setSaved(false)

        if (form.newPass.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (form.newPass !== form.confirm) {
            setError('New passwords do not match')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/settings/password', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    currentPassword: form.current,
                    newPassword: form.newPass
                })
            })
            const data = await response.json()

            if (data.success) {
                setSaved(true)
                setForm({ current: '', newPass: '', confirm: '' })
                setTimeout(() => setSaved(false), 3000)
            } else {
                setError(data.message || 'Failed to change password')
            }
        } catch (err) {
            console.error('Password change error:', err)
            setError('Failed to connect to server')
        }
        setLoading(false)
    }

    return (
        <>
            <SettingSection
                title="Change Password"
                description="Ensure your account stays secure with a strong password"
            >
                <form onSubmit={handleSave} className="glass-card p-6 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            <HiOutlineExclamation className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <PasswordInput
                        id="settings-current-pass"
                        label="Current Password"
                        value={form.current}
                        onChange={(e) => setForm({ ...form, current: e.target.value })}
                        show={showCurrent}
                        toggleShow={() => setShowCurrent(!showCurrent)}
                        placeholder="Enter current password"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PasswordInput
                            id="settings-new-pass"
                            label="New Password"
                            value={form.newPass}
                            onChange={(e) => setForm({ ...form, newPass: e.target.value })}
                            show={showNew}
                            toggleShow={() => setShowNew(!showNew)}
                            placeholder="Min 6 characters"
                        />
                        <PasswordInput
                            id="settings-confirm-pass"
                            label="Confirm New Password"
                            value={form.confirm}
                            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                            show={showConfirm}
                            toggleShow={() => setShowConfirm(!showConfirm)}
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button type="submit" disabled={loading} className="btn-glow disabled:opacity-50">
                            <span className="relative z-10">
                                {loading ? 'Updating...' : 'Update Password'}
                            </span>
                        </button>
                        {saved && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm text-emerald-400 flex items-center gap-1"
                            >
                                <HiOutlineCheck className="w-4 h-4" /> Password updated
                            </motion.span>
                        )}
                    </div>
                </form>
            </SettingSection>

            <SettingSection
                title="Session Info"
                description="Details about your current login session"
            >
                <div className="glass-card p-6">
                    <SettingRow label="Login Status" description="Current authentication state">
                        <span className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-400 font-medium">Active</span>
                        </span>
                    </SettingRow>
                    <SettingRow label="Auth Token" description="JWT token stored in localStorage">
                        <span className="text-xs text-white/40 font-mono">
                            {localStorage.getItem('frolic_token')?.slice(0, 20)}...
                        </span>
                    </SettingRow>
                    <SettingRow label="Login Method" description="Authentication provider" noBorder>
                        <span className="text-sm text-white/70">Email & Password</span>
                    </SettingRow>
                </div>
            </SettingSection>
        </>
    )
}
