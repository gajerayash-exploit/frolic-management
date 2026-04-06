import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('frolic_token'))
    const [loading, setLoading] = useState(true)

    // Set axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }, [token])

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('frolic_token')
            const storedUser = localStorage.getItem('frolic_user')

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken)
                    setUser(JSON.parse(storedUser))
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
                } catch (error) {
                    console.error('Auth init error:', error)
                    logout()
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            })

            const { token: newToken, user: userData } = response.data

            localStorage.setItem('frolic_token', newToken)
            localStorage.setItem('frolic_user', JSON.stringify(userData))

            setToken(newToken)
            setUser(userData)
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

            return { success: true, user: userData }
        } catch (error) {
            console.error('Login error:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.'
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData)
            const { token: newToken, user: newUser } = response.data

            if (newToken && newUser) {
                localStorage.setItem('frolic_token', newToken)
                localStorage.setItem('frolic_user', JSON.stringify(newUser))
                setToken(newToken)
                setUser(newUser)
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
            }

            return { success: true, data: response.data }
        } catch (error) {
            console.error('Register error:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('frolic_token')
        localStorage.removeItem('frolic_user')
        setToken(null)
        setUser(null)
        delete axios.defaults.headers.common['Authorization']
    }

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
