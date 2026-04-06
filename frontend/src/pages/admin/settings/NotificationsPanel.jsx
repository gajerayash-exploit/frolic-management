import { useState } from 'react'
import SettingSection from './components/SettingSection'
import SettingRow from './components/SettingRow'
import ToggleSwitch from './components/ToggleSwitch'

const DEFAULT_PREFS = {
    emailNewEvent: true,
    emailRegistration: true,
    emailWinner: false,
    pushNewEvent: true,
    pushGroupUpdate: true,
    pushDeadline: true,
    inAppAll: true,
    inAppSounds: false,
}

export default function NotificationsPanel() {
    const [prefs, setPrefs] = useState(() => {
        try {
            const stored = localStorage.getItem('frolic_notif_prefs')
            return stored ? JSON.parse(stored) : DEFAULT_PREFS
        } catch {
            return DEFAULT_PREFS
        }
    })

    const toggle = (key) => {
        const updated = { ...prefs, [key]: !prefs[key] }
        setPrefs(updated)
        localStorage.setItem('frolic_notif_prefs', JSON.stringify(updated))
    }

    return (
        <>
            <SettingSection title="Email Notifications" description="Choose which emails you'd like to receive">
                <div className="glass-card p-6">
                    <SettingRow label="New Event Created" description="Get notified when a new event is added">
                        <ToggleSwitch id="toggle-email-newevent" enabled={prefs.emailNewEvent} onToggle={() => toggle('emailNewEvent')} />
                    </SettingRow>
                    <SettingRow label="Group Registrations" description="Email alerts for new group sign-ups">
                        <ToggleSwitch id="toggle-email-registration" enabled={prefs.emailRegistration} onToggle={() => toggle('emailRegistration')} />
                    </SettingRow>
                    <SettingRow label="Winner Announcements" description="Receive emails when winners are declared" noBorder>
                        <ToggleSwitch id="toggle-email-winner" enabled={prefs.emailWinner} onToggle={() => toggle('emailWinner')} />
                    </SettingRow>
                </div>
            </SettingSection>

            <SettingSection title="Push Notifications" description="Real-time browser push notifications">
                <div className="glass-card p-6">
                    <SettingRow label="New Events" description="Push alert for newly created events">
                        <ToggleSwitch id="toggle-push-newevent" enabled={prefs.pushNewEvent} onToggle={() => toggle('pushNewEvent')} />
                    </SettingRow>
                    <SettingRow label="Group Updates" description="Notify on group member changes">
                        <ToggleSwitch id="toggle-push-group" enabled={prefs.pushGroupUpdate} onToggle={() => toggle('pushGroupUpdate')} />
                    </SettingRow>
                    <SettingRow label="Deadline Reminders" description="Get reminders before event deadlines" noBorder>
                        <ToggleSwitch id="toggle-push-deadline" enabled={prefs.pushDeadline} onToggle={() => toggle('pushDeadline')} />
                    </SettingRow>
                </div>
            </SettingSection>

            <SettingSection title="In-App Preferences" description="Configure in-app notification behaviour">
                <div className="glass-card p-6">
                    <SettingRow label="Show In-App Notifications" description="Display toast popups inside the app">
                        <ToggleSwitch id="toggle-inapp-all" enabled={prefs.inAppAll} onToggle={() => toggle('inAppAll')} />
                    </SettingRow>
                    <SettingRow label="Notification Sounds" description="Play a sound with each notification" noBorder>
                        <ToggleSwitch id="toggle-inapp-sounds" enabled={prefs.inAppSounds} onToggle={() => toggle('inAppSounds')} />
                    </SettingRow>
                </div>
            </SettingSection>
        </>
    )
}
