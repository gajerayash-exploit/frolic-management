import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSearch,
    HiOutlineX,
    HiOutlineCollection,
    HiOutlineRefresh,
    HiOutlineFilter
} from 'react-icons/hi'

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('frolic_token')
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

export default function Departments() {
    const [departments, setDepartments] = useState([])
    const [institutes, setInstitutes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterInstitute, setFilterInstitute] = useState('')

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('add')
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [formData, setFormData] = useState({
        DepartmentName: '',
        DepartmentImage: '',
        InstituteID: ''
    })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    // Fetch departments
    const fetchDepartments = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch('/api/departments')
            const data = await response.json()
            if (data.success) {
                setDepartments(data.data || [])
            } else {
                setError(data.message || 'Failed to fetch departments')
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setError('Failed to connect to server')
        }
        setLoading(false)
    }

    // Fetch institutes for dropdown
    const fetchInstitutes = async () => {
        try {
            const response = await fetch('/api/institutes')
            const data = await response.json()
            if (data.success) {
                setInstitutes(data.data || [])
            }
        } catch (err) {
            console.error('Fetch institutes error:', err)
        }
    }

    const [coordinators, setCoordinators] = useState([])

    // Fetch coordinators
    const fetchCoordinators = async () => {
        try {
            const response = await fetch('/api/users?Role=department_coordinator', {
                headers: getAuthHeaders()
            })
            const data = await response.json()
            setCoordinators(data || [])
        } catch (err) {
            console.error('Fetch coordinators error:', err)
        }
    }

    useEffect(() => {
        fetchDepartments()
        fetchInstitutes()
        fetchCoordinators()
    }, [])

    // Filter departments
    const filteredDepartments = departments.filter(dept => {
        const matchesSearch = dept.DepartmentName?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesInstitute = !filterInstitute || dept.InstituteID?._id === filterInstitute
        return matchesSearch && matchesInstitute
    })

    // Open modal for add
    const handleAdd = () => {
        setModalMode('add')
        setFormData({
            DepartmentName: '',
            DepartmentImage: '',
            InstituteID: '',
            DepartmentCoordinatorID: ''
        })
        setFormError('')
        setShowModal(true)
    }

    // Open modal for edit
    const handleEdit = (department) => {
        setModalMode('edit')
        setSelectedDepartment(department)
        setFormData({
            DepartmentName: department.DepartmentName || '',
            DepartmentImage: department.DepartmentImage || '',
            InstituteID: department.InstituteID?._id || '',
            DepartmentCoordinatorID: department.DepartmentCoordinatorID?._id || ''
        })
        setFormError('')
        setShowModal(true)
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')

        if (!formData.InstituteID) {
            setFormError('Please select an institute')
            setFormLoading(false)
            return
        }

        try {
            const url = modalMode === 'add'
                ? '/api/departments'
                : `/api/departments/${selectedDepartment._id}`

            const method = modalMode === 'add' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                setShowModal(false)
                fetchDepartments()
            } else {
                setFormError(data.message || 'Operation failed')
            }
        } catch (err) {
            console.error('Submit error:', err)
            setFormError('Failed to save department')
        }
        setFormLoading(false)
    }

    // Handle delete
    const handleDelete = async () => {
        if (!deleteTarget) return

        try {
            const response = await fetch(`/api/departments/${deleteTarget._id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
            const data = await response.json()

            if (data.success) {
                setShowDeleteConfirm(false)
                setDeleteTarget(null)
                fetchDepartments()
            } else {
                alert(data.message || 'Failed to delete')
            }
        } catch (err) {
            console.error('Delete error:', err)
            alert('Failed to delete department')
        }
    }

    const confirmDelete = (department) => {
        setDeleteTarget(department)
        setShowDeleteConfirm(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Departments</h1>
                    <p className="text-white/60">Manage departments across institutes</p>
                </div>
                <button onClick={handleAdd} className="btn-glow flex items-center gap-2">
                    <span className="relative z-10 flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Department</span>
                </button>
            </div>

            {/* Search, Filter & Refresh */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                    />
                </div>
                <div className="relative">
                    <HiOutlineFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <select
                        value={filterInstitute}
                        onChange={(e) => setFilterInstitute(e.target.value)}
                        className="pl-12 pr-8 py-3 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 appearance-none cursor-pointer min-w-[200px] [&>option]:bg-midnight-900 [&>option]:text-white"
                    >
                        <option value="">All Institutes</option>
                        {institutes.map(inst => (
                            <option key={inst._id} value={inst._id}>{inst.InstituteName}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={fetchDepartments}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                    <HiOutlineRefresh className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="glass-card p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/60">Loading departments...</p>
                </div>
            ) : filteredDepartments.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineCollection className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No departments found</p>
                    <button onClick={handleAdd} className="mt-4 text-accent-400 hover:text-accent-300">
                        Add your first department
                    </button>
                </div>
            ) : (
                /* Departments Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDepartments.map((department, index) => (
                        <motion.div
                            key={department._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card-hover p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <HiOutlineCollection className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(department)}
                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(department)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{department.DepartmentName}</h3>
                            <p className="text-sm text-accent-400 mb-4">
                                {department.InstituteID?.InstituteName || 'Unknown Institute'}
                            </p>
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-white/40">
                                    Created: {new Date(department.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {modalMode === 'add' ? 'Add Department' : 'Edit Department'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60"
                                >
                                    <HiOutlineX className="w-5 h-5" />
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Department Name *</label>
                                    <input
                                        type="text"
                                        value={formData.DepartmentName}
                                        onChange={(e) => setFormData({ ...formData, DepartmentName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="Enter department name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Institute *</label>
                                    <select
                                        value={formData.InstituteID}
                                        onChange={(e) => setFormData({ ...formData, InstituteID: e.target.value })}
                                        className="w-full px-4 py-3 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                        required
                                    >
                                        <option value="">Select Institute</option>
                                        {institutes.map(inst => (
                                            <option key={inst._id} value={inst._id}>{inst.InstituteName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="url"
                                        value={formData.DepartmentImage}
                                        onChange={(e) => setFormData({ ...formData, DepartmentImage: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Department Coordinator</label>
                                    <select
                                        value={formData.DepartmentCoordinatorID}
                                        onChange={(e) => setFormData({ ...formData, DepartmentCoordinatorID: e.target.value })}
                                        className="w-full px-4 py-3 bg-midnight-900 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-500 [&>option]:bg-midnight-900 [&>option]:text-white"
                                    >
                                        <option value="">Select Coordinator</option>
                                        {coordinators.map(coord => (
                                            <option key={coord._id} value={coord._id}>{coord.UserName} ({coord.EmailAddress})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 btn-glow disabled:opacity-50"
                                    >
                                        {formLoading ? 'Saving...' : (modalMode === 'add' ? 'Add Department' : 'Save Changes')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-midnight-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <HiOutlineTrash className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Department?</h3>
                            <p className="text-white/60 mb-6">
                                Are you sure you want to delete "{deleteTarget?.DepartmentName}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
