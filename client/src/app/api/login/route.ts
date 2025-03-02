import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  try {
    const response = await fetch('http://65.1.209.37:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      const responseData = { success: true, token: data.token }
      return NextResponse.json(responseData, { status: 200 })
    } else {
      return NextResponse.json({ success: false, error: data.message || 'Login failed' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 })
  }
}

