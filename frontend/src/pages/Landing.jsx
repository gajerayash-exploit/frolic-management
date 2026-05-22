import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import duLogo from '../assets/du-logo.png'

// Technical Events
const technicalEvents = [
    { name: 'Seismo-Struct', emoji: '🏗️', color: 'from-blue-500 to-indigo-600', description: 'Participants build a three storey model with reinforced joints, testing its stability against simulated earthquake forces using a Shake Table.' },
    { name: 'Code-A-Thon', emoji: '💻', color: 'from-indigo-500 to-purple-600', description: 'App-A-Thon is a competition where students showcase design and development skills by creating engaging mobile or web applications.' },
    { name: 'WebArtisan Clash', emoji: '🌐', color: 'from-cyan-500 to-blue-600', description: 'WebArtisan Clash is a three-round HTML/CSS competition testing technical knowledge, problem-solving abilities, and creativity in web design.' },
    { name: 'CADxplore', emoji: '📐', color: 'from-blue-600 to-cyan-500', description: 'Students demonstrate 3D drafting and assembly skills using AutoCAD, a standard software used by engineers for various design processes.' },
    { name: 'Robo Race', emoji: '🤖', color: 'from-indigo-600 to-violet-600', description: 'Participants navigate their robots through a three-round obstacle course within a set time limit to successfully complete the race.' },
    { name: 'Stick Mania', emoji: '🌉', color: 'from-teal-500 to-emerald-600', description: 'Teams compete to build the strongest frame structure using provided materials, aiming for the highest weight-bearing capacity to win.' },
    { name: 'Startup-Sutradhar', emoji: '🚀', color: 'from-violet-500 to-fuchsia-600', description: 'Startup Sutradhar is a national business plan competition featuring video and live rounds for student entrepreneurs to showcase creativity.' },
    { name: 'WebFrontier', emoji: '⚡', color: 'from-cyan-400 to-blue-500', description: 'Web Frontier challenges participants to design themed static websites using HTML and CSS, showcasing their creative and technical design skills.' }
]

// Non-Technical Events
const nonTechnicalEvents = [
    { name: 'Brand COP', emoji: '🎯', color: 'from-pink-500 to-rose-600', description: 'Identify famous brands using gestures and postures to test your marketing knowledge and brand association in this interactive challenge.' },
    { name: 'Secret Hitler', emoji: '🕵️', color: 'from-red-500 to-orange-600', description: 'Identify the hidden leader using bluffing and intuition in this intense strategy game of secret roles and misplaced trust.' },
    { name: 'Filmy Paglu', emoji: '🎬', color: 'from-fuchsia-500 to-pink-600', description: 'Filmy Paglu is a high-energy quiz and hunt event involving emoji decoding and clues about cinema, music, and literature.' },
    { name: 'Ex-Quiz-It', emoji: '🧠', color: 'from-orange-500 to-amber-600', description: 'Ex-Quiz-It features audio-video and buzzer rounds, challenging teams to use knowledge and teamwork in an intense, interactive quiz competition.' },
    { name: 'Gully Cricket', emoji: '🏏', color: 'from-rose-500 to-red-600', description: 'Gully cricket fosters a lifelong passion for the sport, symbolizing its raw spirit regardless of limited resources or space.' },
    { name: 'Talent Show', emoji: '🎭', color: 'from-pink-600 to-rose-500', description: 'Showcase your dancing, singing, acting, or comedy skills at Frolic 2025’s Talent Show, celebrating raw creativity and confident performance.' },
    { name: 'Biz-Quiz', emoji: '💼', color: 'from-amber-500 to-orange-500', description: 'Business Quiz tests students knowledge through identifying personalities, logos, and taglines, providing a platform to showcase their business expertise.' },
    { name: 'Shape Master', emoji: '🧩', color: 'from-red-400 to-pink-500', description: 'Groups of three compete in Shape Master, identifying and counting shapes to sharpen observation, memory, and quick decision-making skills.' }
]

export default function Landing() {
    const { login, register } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            if (isSignUp) {
                // Register the user via AuthContext (auto-logs in on success)
                const regResult = await register({
                    UserName: formData.name,
                    EmailAddress: formData.email,
                    UserPassword: formData.password,
                    PhoneNumber: formData.phone
                })

                if (!regResult.success) {
                    setError(regResult.error || 'Registration failed')
                }
                // If successful, AuthContext sets user/token and App.jsx redirects automatically
            } else {
                const result = await login(formData.email, formData.password)
                if (!result.success) {
                    setError(result.error || 'Login failed')
                }
            }
        } catch (err) {
            console.error('Auth error:', err)
            setError('An unexpected error occurred')
        }

        setLoading(false)
    }

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-midnight-950 relative overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-mesh" />
            <div className="fixed w-96 h-96 bg-accent-600 -top-48 -left-48 rounded-full blur-3xl opacity-30" />
            <div className="fixed w-80 h-80 bg-primary-600 top-1/4 -right-40 rounded-full blur-3xl opacity-30" />

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-8"
                >
                    <img src={duLogo} alt="Darshan University Logo" className="w-28 h-28 mx-auto mb-6 object-contain filter drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-110 transition-transform duration-300" />
                    <h1 className="text-6xl md:text-8xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 via-primary-400 to-accent-500">FROLIC</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-2">
                        University Sports & Cultural Fest
                    </p>
                    <p className="text-lg text-white/50 max-w-xl mx-auto">
                        Where Champions Are Made
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="grid grid-cols-3 gap-8 mb-12"
                >
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-primary-400">11+</div>
                        <div className="text-white/50 text-sm">Games</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-primary-400">500+</div>
                        <div className="text-white/50 text-sm">Participants</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-primary-400">₹50K</div>
                        <div className="text-white/50 text-sm">Prizes</div>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => scrollToSection('auth-section')}
                        className="px-8 py-3 font-semibold rounded-xl bg-gradient-to-r from-accent-500 to-primary-600 text-white hover:shadow-lg transition-all"
                    >
                        Join Now →
                    </button>
                    <button
                        onClick={() => scrollToSection('games-section')}
                        className="px-8 py-3 font-semibold rounded-xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"
                    >
                        Explore Games
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section id="about-section" className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-primary-400">About FROLIC</span>
                    </h2>
                    <p className="text-white/60 text-lg max-w-3xl mx-auto mb-10">
                        Frolic is National Level Technical Symposium where talent meets opportunity. Technical fests should be an essential part of course curriculum as it gives a platform to young brains to showcase their innovative ideas and compete with their peers. <br /> 

                        These technical fests are an amalgamation of fun and learning where spectacular ideas are displayed, and students learn and feel inspired. These events guide engineers, computer experts, researchers to dream bigger and achieve them. Frolic hosts technical competitions and events covering all areas of engineering are organized every year in the first week of September, where students participate enthusiastically to make the Tech-Fest a success.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl">📅</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Multi-Day Event</h3>
                            <p className="text-white/50 text-sm">3 days of non-stop action and entertainment</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl">👥</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Team Spirit</h3>
                            <p className="text-white/50 text-sm">Form groups and compete as a unified team</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl">🏆</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Win Big</h3>
                            <p className="text-white/50 text-sm">Exciting prizes and certificates for winners</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Games Section */}
            <section id="games-section" className="relative z-10 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-primary-400">Games & Events</span>
                        </h2>
                        <p className="text-white/60 text-lg">Choose your arena. Showcase your skills.</p>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 mt-12 text-white border-b-2 border-indigo-500/50 inline-block pb-2">Technical Events</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {technicalEvents.map((game, index) => (
                            <motion.div
                                key={game.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center cursor-pointer overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-2 h-48 flex flex-col justify-center items-center"
                            >
                                {/* Default State */}
                                <div className="z-10 transition-transform duration-300 group-hover:-translate-y-6">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {game.emoji}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">{game.name}</h3>
                                </div>

                                {/* Hover Description Overlay */}
                                <div className="absolute inset-0 bg-midnight-950/90 backdrop-blur-md p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <h3 className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${game.color} mb-2`}>{game.name}</h3>
                                    <p className="text-white/80 text-sm leading-relaxed">{game.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <h3 className="text-2xl font-bold mb-6 mt-16 text-white border-b-2 border-pink-500/50 inline-block pb-2">Non-Technical Events</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nonTechnicalEvents.map((game, index) => (
                            <motion.div
                                key={game.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center cursor-pointer overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-2 h-48 flex flex-col justify-center items-center"
                            >
                                {/* Default State */}
                                <div className="z-10 transition-transform duration-300 group-hover:-translate-y-6">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {game.emoji}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">{game.name}</h3>
                                </div>

                                {/* Hover Description Overlay */}
                                <div className="absolute inset-0 bg-midnight-950/90 backdrop-blur-md p-4 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                    <h3 className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${game.color} mb-2`}>{game.name}</h3>
                                    <p className="text-white/80 text-sm leading-relaxed">{game.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Auth Section */}
            <section id="auth-section" className="relative z-10 py-20 px-4">
                <div className="max-w-md mx-auto">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-2 text-center">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-white/50 text-center mb-6">
                            {isSignUp ? 'Join FROLIC today' : 'Sign in to continue'}
                        </p>

                        {/* Messages */}
                        {error && (
                            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                                <p className="text-green-400 text-sm">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name - only for signup */}
                            {isSignUp && (
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        required={isSignUp}
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    autoComplete="username"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                    required
                                />
                            </div>

                            {/* Phone - only for signup */}
                            {isSignUp && (
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="10-digit phone number"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                            )}

                            {/* Password */}
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-500/50"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-accent-500 to-primary-600 text-white mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'} transition-all`}
                            >
                                {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>
                        </form>

                        {/* Toggle */}
                        <div className="mt-6 pt-6 border-t border-white/10 text-center">
                            <p className="text-white/50 text-sm">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp)
                                        setError('')
                                        setSuccess('')
                                    }}
                                    className="ml-2 text-accent-400 hover:text-accent-300 font-medium"
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-8 px-4 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-white/40 text-sm">
                        © 2026 Frolic Event Management System by Yash Gajera. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
