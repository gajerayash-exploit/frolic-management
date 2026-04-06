import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineX,
    HiOutlineCheck
} from 'react-icons/hi'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [formData, setFormData] = useState({
        UserName: '',
        EmailAddress: '',
        PhoneNumber: '',
        UserPassword: '',
        Role: 'student',
        IsAdmin: false
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/users')
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (currentUser) {
                await axios.put(`/api/users/${currentUser._id}`, formData)
            } else {
                await axios.post('/api/users', formData)
            }
            fetchUsers()
            setIsModalOpen(false)
            resetForm()
        } catch (error) {
            console.error('Error saving user:', error)
            alert(error.response?.data?.message || 'Error saving user')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${id}`)
                fetchUsers()
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
    }

    const openModal = (user = null) => {
        if (user) {
            setCurrentUser(user)
            setFormData({
                UserName: user.UserName,
                EmailAddress: user.EmailAddress,
                PhoneNumber: user.PhoneNumber || '',
                UserPassword: '', // Don't show password
                Role: user.Role,
                IsAdmin: user.IsAdmin
            })
        } else {
            resetForm()
        }
        setIsModalOpen(true)
    }

    const resetForm = () => {
        setCurrentUser(null)
        setFormData({
            UserName: '',
            EmailAddress: '',
            PhoneNumber: '',
            UserPassword: '',
            Role: 'student',
            IsAdmin: false
        })
    }

    const filteredUsers = users.filter(user =>
        user.UserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.EmailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-white/60">Manage students, coordinators, and admins</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-glow flex items-center gap-2"
                >
                    <span className="relative z-10 flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add User</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                />
            </div>

            {/* Users List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12 text-white/40">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-white/40">No users found</div>
                ) : (
                    filteredUsers.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-4 flex flex-col sm:flex-row items-center gap-4"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${user.Role === 'admin' ? 'bg-gradient-to-br from-rose-500 to-red-600' :
                                    user.Role.includes('coordinator') ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                                        'bg-gradient-to-br from-blue-500 to-cyan-600'
                                }`}>
                                {user.UserName.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-white font-medium">{user.UserName}</h3>
                                <p className="text-sm text-white/40">{user.EmailAddress}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.Role === 'admin' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                        user.Role.includes('coordinator') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}>
                                    {user.Role.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openModal(user)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <HiOutlinePencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                                >
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-midnight-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">
                                    {currentUser ? 'Edit User' : 'Add User'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
                                >
                                    <HiOutlineX className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.UserName}
                                        onChange={e => setFormData({ ...formData, UserName: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-accent-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.EmailAddress}
                                        onChange={e => setFormData({ ...formData, EmailAddress: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-accent-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.PhoneNumber}
                                        onChange={e => setFormData({ ...formData, PhoneNumber: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-accent-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1">
                                        Password {currentUser && '(Leave blank to keep current)'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!currentUser}
                                        value={formData.UserPassword}
                                        onChange={e => setFormData({ ...formData, UserPassword: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-accent-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-1">Role</label>
                                    <select
                                        value={formData.Role}
                                        onChange={e => setFormData({ ...formData, Role: e.target.value })}
                                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white focus:border-accent-500 focus:outline-none"
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                        <option value="institute_coordinator">Institute Coordinator</option>
                                        <option value="department_coordinator">Department Coordinator</option>
                                        <option value="event_coordinator">Event Coordinator</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isAdmin"
                                        checked={formData.IsAdmin}
                                        onChange={e => setFormData({ ...formData, IsAdmin: e.target.checked })}
                                        className="rounded border-white/10 bg-black/20 text-accent-500 focus:ring-accent-500"
                                    />
                                    <label htmlFor="isAdmin" className="text-sm text-white/60">
                                        Grant Admin Privileges
                                    </label>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-medium transition-colors"
                                    >
                                        {currentUser ? 'Update User' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
