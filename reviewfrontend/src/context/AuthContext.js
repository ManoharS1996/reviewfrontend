import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const res = await api.get('/auth/me')
          setUser(res.data.data)
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('Auth check error:', err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      console.error('Login Error:', err.response?.data)
      return {
        success: false,
        message: err.response?.data?.error || 'Login failed'
      }
    }
  }

  const register = async (fullName, username, password) => {
    try {
      // ✅ Debug log to confirm payload
      console.log('Register Payload:', { fullName, username, password })

      const res = await api.post('/auth/register', {
        fullName,
        username,
        password
      })

      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      console.error('Register Error:', err.response?.data)
      return {
        success: false,
        message: err.response?.data?.error || 'Registration failed'
      }
    }
  }

  const logout = async () => {
    try {
      await api.get('/auth/logout')
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
