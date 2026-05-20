import { useState, useEffect, useCallback } from 'react'

/**
 * useDashboardData — Central hook for all dashboard analytics.
 *
 * Fetches data from existing APIs and computes derived metrics
 * for stat cards and chart components.
 *
 * @param {'admin'|'coordinator'|'student'} role
 * @param {string|null} userId - Current user ID (for student filtering)
 * @returns {{ stats, charts, loading, error, refetch }}
 */
export default function useDashboardData(role = 'admin', userId = null) {
    const [data, setData] = useState({
        stats: {},
        charts: {},
        loading: true,
        error: null,
    })

    const fetchData = useCallback(async () => {
        setData(prev => ({ ...prev, loading: true, error: null }))

        try {
            const token = localStorage.getItem('frolic_token')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            // Parallel fetch all required endpoints
            const endpoints = [
                fetch('/api/events'),
                fetch('/api/groups'),
                fetch('/api/institutes'),
                fetch('/api/departments'),
                fetch('/api/users', { headers }),
                fetch('/api/winners'),
            ]

            const responses = await Promise.all(endpoints)
            const [evtRes, grpRes, instRes, deptRes, usrRes, winRes] = responses

            const [evtData, grpData, instData, deptData, usrData, winData] = await Promise.all(
                responses.map(r => r.json())
            )

            const events = evtData.data || []
            const groups = grpData.data || []
            const institutes = instData.data || []
            const departments = deptData.data || []
            const users = Array.isArray(usrData) ? usrData : (usrData.data || [])
            const winners = winData.data || []

            // ─── Compute Stats ───────────────────────────────────
            const now = new Date()
            const activeEvents = events.filter(e => e.IsActive)
            const upcomingEvents = events.filter(e => e.EventDate && new Date(e.EventDate) > now && e.IsActive)
            const completedEvents = events.filter(e => e.EventDate && new Date(e.EventDate) <= now)
            const paidGroups = groups.filter(g => g.IsPaymentDone)
            const presentGroups = groups.filter(g => g.IsPresent)
            const totalFees = events.reduce((sum, e) => sum + (e.Fees || 0), 0)
            const collectedRevenue = paidGroups.reduce((sum, g) => {
                const evt = events.find(e => (e._id === (g.EventID?._id || g.EventID)))
                return sum + (evt?.Fees || 0)
            }, 0)

            // Events with winners declared
            const eventIdsWithWinners = new Set(winners.map(w => w.EventID?._id || w.EventID))

            const stats = {
                totalEvents: events.length,
                activeEvents: activeEvents.length,
                upcomingEvents: upcomingEvents.length,
                completedEvents: completedEvents.length,
                totalGroups: groups.length,
                totalUsers: users.length,
                totalInstitutes: institutes.length,
                totalDepartments: departments.length,
                paidGroups: paidGroups.length,
                pendingPayments: groups.length - paidGroups.length,
                attendancePresent: presentGroups.length,
                attendanceAbsent: groups.length - presentGroups.length,
                attendanceRate: groups.length > 0 ? Math.round((presentGroups.length / groups.length) * 100) : 0,
                paymentRate: groups.length > 0 ? Math.round((paidGroups.length / groups.length) * 100) : 0,
                winnersDecl: eventIdsWithWinners.size,
                winnersPending: events.length - eventIdsWithWinners.size,
                collectedRevenue,
                // Student-specific
                ...(role === 'student' && userId ? computeStudentStats(groups, winners, userId) : {}),
            }

            // ─── Compute Chart Data ─────────────────────────────
            const charts = {
                eventStatus: computeEventStatus(events, now),
                registrationTrend: computeRegistrationTrend(groups),
                departmentDistribution: computeDeptDistribution(events, departments),
                paymentStatus: computePaymentStatus(groups),
                attendanceData: computeAttendanceData(events, groups),
                instituteActivity: computeInstituteActivity(institutes, departments, events),
                resultPublication: computeResultPublication(events, eventIdsWithWinners),
                groupParticipation: computeGroupParticipation(groups),
            }

            setData({ stats, charts, loading: false, error: null })
        } catch (err) {
            console.error('Dashboard data fetch error:', err)
            setData(prev => ({ ...prev, loading: false, error: err.message }))
        }
    }, [role, userId])

    useEffect(() => { fetchData() }, [fetchData])

    return { ...data, refetch: fetchData }
}

// ─── Helper Functions ────────────────────────────────────────────

function computeStudentStats(groups, winners, userId) {
    const myGroups = groups.filter(g => (g.CreatedBy?._id || g.CreatedBy) === userId)
    const myGroupIds = new Set(myGroups.map(g => g._id))
    const myWins = winners.filter(w => myGroupIds.has(w.GroupID?._id || w.GroupID))
    return {
        registeredEvents: myGroups.length,
        myGroups: myGroups.length,
        achievements: myWins.length,
        studentGroups: myGroups,
    }
}

function computeEventStatus(events, now) {
    const active = events.filter(e => e.IsActive && (!e.EventDate || new Date(e.EventDate) > now)).length
    const completed = events.filter(e => e.EventDate && new Date(e.EventDate) <= now).length
    const inactive = events.filter(e => !e.IsActive).length
    const upcoming = events.filter(e => {
        if (!e.EventDate) return false
        const diff = new Date(e.EventDate) - now
        return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000 // within 7 days
    }).length

    return [
        { name: 'Active', value: active, fill: '#10b981' },
        { name: 'Completed', value: completed, fill: '#3b82f6' },
        { name: 'Upcoming (7d)', value: upcoming, fill: '#f59e0b' },
        { name: 'Inactive', value: inactive, fill: '#6b7280' },
    ].filter(d => d.value > 0)
}

function computeRegistrationTrend(groups) {
    // Aggregate groups by month
    const months = {}
    const now = new Date()

    // Ensure we show at least 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        months[key] = { month: label, registrations: 0, groups: 0 }
    }

    groups.forEach(g => {
        if (!g.createdAt) return
        const d = new Date(g.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (months[key]) {
            months[key].registrations += 1
            months[key].groups += 1
        }
    })

    return Object.values(months)
}

function computeDeptDistribution(events, departments) {
    const deptMap = {}
    departments.forEach(d => {
        deptMap[d._id] = { name: d.DepartmentName || 'Unknown', events: 0 }
    })

    events.forEach(e => {
        const deptId = e.DepartmentID?._id || e.DepartmentID
        if (deptMap[deptId]) {
            deptMap[deptId].events += 1
        }
    })

    return Object.values(deptMap)
        .filter(d => d.events > 0)
        .sort((a, b) => b.events - a.events)
        .slice(0, 8) // top 8
}

function computePaymentStatus(groups) {
    const paid = groups.filter(g => g.IsPaymentDone).length
    const pending = groups.length - paid
    return [
        { name: 'Paid', value: paid, fill: '#10b981' },
        { name: 'Pending', value: pending, fill: '#f59e0b' },
    ].filter(d => d.value > 0)
}

function computeAttendanceData(events, groups) {
    // Group attendance by event
    const eventMap = {}
    events.forEach(e => {
        eventMap[e._id] = { name: e.EventName?.substring(0, 12) || 'Event', present: 0, absent: 0 }
    })

    groups.forEach(g => {
        const evtId = g.EventID?._id || g.EventID
        if (eventMap[evtId]) {
            if (g.IsPresent) eventMap[evtId].present += 1
            else eventMap[evtId].absent += 1
        }
    })

    return Object.values(eventMap)
        .filter(d => d.present + d.absent > 0)
        .slice(0, 8) // top 8
}

function computeInstituteActivity(institutes, departments, events) {
    return institutes.map(inst => {
        const instDepts = departments.filter(d => (d.InstituteID?._id || d.InstituteID) === inst._id)
        const deptIds = new Set(instDepts.map(d => d._id))
        const instEvents = events.filter(e => deptIds.has(e.DepartmentID?._id || e.DepartmentID))
        return {
            name: inst.InstituteName?.substring(0, 15) || 'Institute',
            departments: instDepts.length,
            events: instEvents.length,
        }
    }).filter(d => d.departments > 0 || d.events > 0)
}

function computeResultPublication(events, eventIdsWithWinners) {
    const declared = eventIdsWithWinners.size
    const pending = events.length - declared
    return [
        { name: 'Declared', value: declared, fill: '#a855f7' },
        { name: 'Pending', value: pending, fill: '#6b7280' },
    ].filter(d => d.value > 0)
}

function computeGroupParticipation(groups) {
    // Aggregate by month, showing cumulative group count
    const months = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        months[key] = { month: label, teams: 0, cumulative: 0 }
    }

    groups.forEach(g => {
        if (!g.createdAt) return
        const d = new Date(g.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (months[key]) {
            months[key].teams += 1
        }
    })

    // Cumulative
    let cum = 0
    const result = Object.values(months)
    result.forEach(m => {
        cum += m.teams
        m.cumulative = cum
    })

    return result
}
