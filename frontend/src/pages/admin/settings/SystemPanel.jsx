import { useState, useEffect } from 'react'
import {
    HiOutlineDatabase,
    HiOutlineCheck,
    HiOutlineTrash,
    HiOutlineRefresh,
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

export default function SystemPanel() {
    const [systemInfo, setSystemInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cleared, setCleared] = useState(false)

    // Fetch live system info from backend
    useEffect(() => {
        const fetchSystem = async () => {
            setLoading(true)
            setError('')
            try {
                const response = await fetch('/api/settings/system', {
                    headers: getAuthHeaders()
                })
                const data = await response.json()
                if (data.success) {
                    setSystemInfo(data.data)
                } else {
                    setError(data.message || 'Failed to load system info')
                }
            } catch (err) {
                console.error('System info error:', err)
                setError('Failed to connect to server')
            }
            setLoading(false)
        }

        fetchSystem()
    }, [])

    const handleClearCache = () => {
        const keysToKeep = ['frolic_token', 'frolic_user']
        const allKeys = Object.keys(localStorage)
        allKeys.forEach((key) => {
            if (!keysToKeep.includes(key)) localStorage.removeItem(key)
        })
        setCleared(true)
        setTimeout(() => setCleared(false), 3000)
    }

    // Format uptime seconds to human-readable
    const formatUptime = (seconds) => {
        if (!seconds) return 'N/A'
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        if (h > 0) return `${h}h ${m}m ${s}s`
        if (m > 0) return `${m}m ${s}s`
        return `${s}s`
    }

    if (loading) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-white/60">Loading system information...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 text-red-400">
                    <HiOutlineExclamation className="w-6 h-6" />
                    <div>
                        <p className="font-medium">Could not load system info</p>
                        <p className="text-sm text-white/40">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    const { app, database, server } = systemInfo || {}

    return (
        <>
            {/* Application Info */}
            <SettingSection title="Application Info" description="Technical details about this build">
                <div className="glass-card p-6">
                    <SettingRow label="Application" description={app?.name}>
                        <span className="text-sm text-white/70 font-medium">v{app?.version}</span>
                    </SettingRow>
                    <SettingRow label="Frontend" description="UI technology stack">
                        <span className="text-sm text-white/70">{app?.framework}</span>
                    </SettingRow>
                    <SettingRow label="Backend" description="Server technology stack">
                        <span className="text-sm text-white/70">{app?.backend}</span>
                    </SettingRow>
                    <SettingRow label="Node.js" description="Server runtime version">
                        <span className="text-xs text-white/40 font-mono">{server?.nodeVersion}</span>
                    </SettingRow>
                    <SettingRow label="Server Uptime" description="Time since last restart">
                        <span className="text-sm text-white/70">{formatUptime(server?.uptime)}</span>
                    </SettingRow>
                    <SettingRow label="Environment" description="Current running mode" noBorder>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {app?.environment || 'development'}
                        </span>
                    </SettingRow>
                </div>
            </SettingSection>

            {/* Database */}
            <SettingSection title="Database" description="Live MongoDB connection and collection stats">
                <div className="glass-card p-6">
                    <SettingRow label="Connection" description={`Host: ${database?.host || 'N/A'}`}>
                        <span className="flex items-center gap-2 text-sm">
                            <HiOutlineDatabase className="w-4 h-4 text-accent-400" />
                            <span className={database?.connected ? 'text-emerald-400' : 'text-red-400'}>
                                {database?.status}
                            </span>
                        </span>
                    </SettingRow>
                    <SettingRow label="Database Name" description="Active MongoDB database">
                        <span className="text-xs text-white/40 font-mono">{database?.name}</span>
                    </SettingRow>
                    <SettingRow label="Seed Command" description="Populate sample data">
                        <code className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-accent-400 font-mono">
                            npm run seed
                        </code>
                    </SettingRow>
                    <SettingRow label="Collections" description="Document counts per collection" noBorder>
                        <div className="flex flex-wrap gap-1.5">
                            {database?.collections && Object.entries(database.collections).map(([name, count]) => (
                                <span key={name} className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-white/50 border border-white/10">
                                    {name}: {count}
                                </span>
                            ))}
                        </div>
                    </SettingRow>
                </div>
            </SettingSection>

            {/* Danger Zone */}
            <SettingSection title="Danger Zone" description="Irreversible actions — proceed with caution">
                <div className="glass-card p-6 border-red-500/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-white flex items-center gap-2">
                                <HiOutlineTrash className="w-4 h-4 text-red-400" />
                                Clear Local Cache
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">
                                Remove saved preferences (theme, notifications). Your login session is preserved.
                            </p>
                        </div>
                        <button
                            onClick={handleClearCache}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200 flex items-center gap-2 shrink-0"
                        >
                            {cleared ? (
                                <>
                                    <HiOutlineCheck className="w-4 h-4" />
                                    Cleared!
                                </>
                            ) : (
                                <>
                                    <HiOutlineRefresh className="w-4 h-4" />
                                    Clear Cache
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </SettingSection>
        </>
    )
}
