'use server'

import { cookies } from 'next/headers'

const API_URL = 'http://65.1.209.37:8080/api'

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    // Check if the response status is successful (2xx)
    if (response.ok) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: 'token',
        value: 'logged-in', // Since we're just checking for authentication presence
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      cookieStore.set({
        name: 'userEmail',
        value: email,
        httpOnly: false, // Allow client-side access
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      return { success: true }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function signup(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    // Check if the response status is successful (2xx)
    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    // Check if the response status is successful (2xx)
    if (response.ok) {
      return { success: true }
    } else {
      return { success: false, error: 'Failed to send reset email. Please try again.' }
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
