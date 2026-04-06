import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'
import {
    HiOutlineUser,
    HiOutlineShieldCheck,
    HiOutlineBell,
    HiOutlineColorSwatch,
    HiOutlineServer,
    HiOutlineChevronRight
} from 'react-icons/hi'

// Panel components
import ProfilePanel from './ProfilePanel'
import SecurityPanel from './SecurityPanel'
import NotificationsPanel from './NotificationsPanel'
import AppearancePanel from './AppearancePanel'
import SystemPanel from './SystemPanel'

// ─── Tab config ──────────────────────────────────────────────────
const tabs = [
    { id: 'profile',       icon: HiOutlineUser,         label: 'Profile' },
    { id: 'security',      icon: HiOutlineShieldCheck,  label: 'Security' },
    { id: 'notifications', icon: HiOutlineBell,         label: 'Notifications' },
    { id: 'appearance',    icon: HiOutlineColorSwatch,  label: 'Appearance' },
    { id: 'system',        icon: HiOutlineServer,       label: 'System' },
]

// ═════════════════════════════════════════════════════════════════
// Main Settings Page
// ═════════════════════════════════════════════════════════════════
export default function Settings() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')

    const panels = {
        profile:       <ProfilePanel user={user} />,
        security:      <SecurityPanel />,
        notifications: <NotificationsPanel />,
        appearance:    <AppearancePanel />,
        system:        <SystemPanel />,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-white/60">Manage your account preferences and system configuration</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tab Navigation */}
                <nav className="lg:w-56 shrink-0">
                    <div className="glass-card p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    id={`settings-tab-${tab.id}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                        isActive
                                            ? 'bg-accent-500/15 text-accent-400'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="settings-tab-indicator"
                                            className="absolute inset-0 rounded-xl bg-accent-500/15 border border-accent-500/30"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    <tab.icon className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                                    {isActive && (
                                        <HiOutlineChevronRight className="w-4 h-4 ml-auto relative z-10 hidden lg:block" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </nav>

                {/* Panel Content */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                            {panels[activeTab]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
