import axios from 'axios'

const trimTrailingSlash = (value) => value.replace(/\/+$/, '')

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL?.trim() || '')

const hasApiPrefix = (value) => value === '/api' || value.startsWith('/api/')

export const apiUrl = (value) => {
    if (typeof value !== 'string') {
        return value
    }

    if (!value.startsWith('/') || !API_BASE_URL || !hasApiPrefix(value)) {
        return value
    }

    return `${API_BASE_URL}${value}`
}

export const initApiClient = () => {
    if (API_BASE_URL) {
        axios.defaults.baseURL = API_BASE_URL
    }

    if (typeof window === 'undefined' || window.__frolicApiPatched) {
        return
    }

    const nativeFetch = window.fetch.bind(window)

    window.fetch = (input, init) => {
        if (typeof input === 'string') {
            return nativeFetch(apiUrl(input), init)
        }

        return nativeFetch(input, init)
    }

    window.__frolicApiPatched = true
}
