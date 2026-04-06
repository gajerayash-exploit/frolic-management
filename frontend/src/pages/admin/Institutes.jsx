import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSearch,
    HiOutlineX,
    HiOutlineOfficeBuilding,
    HiOutlineRefresh
} from 'react-icons/hi'

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('frolic_token')
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    }
}

export default function Institutes() {
    const [institutes, setInstitutes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
    const [selectedInstitute, setSelectedInstitute] = useState(null)
    const [formData, setFormData] = useState({
        InstituteName: '',
        InstituteDescription: '',
        InstituteImage: ''
    })
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    // Fetch institutes
    const fetchInstitutes = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch('/api/institutes')
            const data = await response.json()
            if (data.success) {
                setInstitutes(data.data || [])
            } else {
                setError(data.message || 'Failed to fetch institutes')
            }
        } catch (err) {
            console.error('Fetch error:', err)
            setError('Failed to connect to server')
        }
        setLoading(false)
    }

    const [coordinators, setCoordinators] = useState([])

    // Fetch coordinators
    const fetchCoordinators = async () => {
        try {
            const response = await fetch('/api/users?Role=institute_coordinator', {
                headers: getAuthHeaders()
            })
            const data = await response.json()
            setCoordinators(data || [])
        } catch (err) {
            console.error('Fetch coordinators error:', err)
        }
    }

    useEffect(() => {
        fetchInstitutes()
        fetchCoordinators()
    }, [])

    // Filter institutes by search
    const filteredInstitutes = institutes.filter(inst =>
        inst.InstituteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.InstituteDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Open modal for add
    const handleAdd = () => {
        setModalMode('add')
        setFormData({
            InstituteName: '',
            InstituteDescription: '',
            InstituteImage: '',
            InstituteCoordinatorID: ''
        })
        setFormError('')
        setShowModal(true)
    }

    // Open modal for edit
    const handleEdit = (institute) => {
        setModalMode('edit')
        setSelectedInstitute(institute)
        setFormData({
            InstituteName: institute.InstituteName || '',
            InstituteDescription: institute.InstituteDescription || '',
            InstituteImage: institute.InstituteImage || '',
            InstituteCoordinatorID: institute.InstituteCoordinatorID?._id || ''
        })
        setFormError('')
        setShowModal(true)
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')

        try {
            const url = modalMode === 'add'
                ? '/api/institutes'
                : `/api/institutes/${selectedInstitute._id}`

            const method = modalMode === 'add' ? 'POST' : 'PUT'

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                setShowModal(false)
                fetchInstitutes() // Refresh list
            } else {
                setFormError(data.message || 'Operation failed')
            }
        } catch (err) {
            console.error('Submit error:', err)
            setFormError('Failed to save institute')
        }
        setFormLoading(false)
    }

    // Handle delete
    const handleDelete = async () => {
        if (!deleteTarget) return

        try {
            const response = await fetch(`/api/institutes/${deleteTarget._id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            })
            const data = await response.json()

            if (data.success) {
                setShowDeleteConfirm(false)
                setDeleteTarget(null)
                fetchInstitutes()
            } else {
                alert(data.message || 'Failed to delete')
            }
        } catch (err) {
            console.error('Delete error:', err)
            alert('Failed to delete institute')
        }
    }

    const confirmDelete = (institute) => {
        setDeleteTarget(institute)
        setShowDeleteConfirm(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Institutes</h1>
                    <p className="text-white/60">Manage all institutes in the system</p>
                </div>
                <button onClick={handleAdd} className="btn-glow flex items-center gap-2">
                    <span className="relative z-10 flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Institute</span>
                </button>
            </div>

            {/* Search & Refresh */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search institutes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                    />
                </div>
                <button
                    onClick={fetchInstitutes}
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
                    <p className="text-white/60">Loading institutes...</p>
                </div>
            ) : filteredInstitutes.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <HiOutlineOfficeBuilding className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No institutes found</p>
                    <button onClick={handleAdd} className="mt-4 text-accent-400 hover:text-accent-300">
                        Add your first institute
                    </button>
                </div>
            ) : (
                /* Institutes Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInstitutes.map((institute, index) => (
                        <motion.div
                            key={institute._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card-hover p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <HiOutlineOfficeBuilding className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(institute)}
                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(institute)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{institute.InstituteName}</h3>
                            <p className="text-sm text-white/50 line-clamp-2">
                                {institute.InstituteDescription || 'No description available'}
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-xs text-white/40">
                                    Created: {new Date(institute.createdAt).toLocaleDateString()}
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
                                    {modalMode === 'add' ? 'Add Institute' : 'Edit Institute'}
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
                                    <label className="text-sm text-white/60 mb-2 block">Institute Name *</label>
                                    <input
                                        type="text"
                                        value={formData.InstituteName}
                                        onChange={(e) => setFormData({ ...formData, InstituteName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="Enter institute name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Description</label>
                                    <textarea
                                        value={formData.InstituteDescription}
                                        onChange={(e) => setFormData({ ...formData, InstituteDescription: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50 resize-none"
                                        placeholder="Enter description"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="url"
                                        value={formData.InstituteImage}
                                        onChange={(e) => setFormData({ ...formData, InstituteImage: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Institute Coordinator</label>
                                    <select
                                        value={formData.InstituteCoordinatorID}
                                        onChange={(e) => setFormData({ ...formData, InstituteCoordinatorID: e.target.value })}
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
                                        {formLoading ? 'Saving...' : (modalMode === 'add' ? 'Add Institute' : 'Save Changes')}
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
                            <h3 className="text-xl font-bold text-white mb-2">Delete Institute?</h3>
                            <p className="text-white/60 mb-6">
                                Are you sure you want to delete "{deleteTarget?.InstituteName}"? This action cannot be undone.
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