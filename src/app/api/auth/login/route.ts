import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user with roles
    const user = await db.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true
          }
        },
        company: true
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Extract permissions
    const permissions = user.roles.reduce((acc: string[], userRole) => {
      const rolePermissions = Array.isArray(userRole.role.permissions) 
        ? userRole.role.permissions 
        : []
      return [...acc, ...rolePermissions]
    }, [])

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        companyId: user.companyId
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Create session
    const session = await db.userSession.create({
      data: {
        userId: user.id,
        token,
        refreshToken: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    return NextResponse.json({
      message: 'Login successful',
      token,
      refreshToken: session.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        company: user.company ? {
          id: user.company.id,
          name: user.company.name
        } : null,
        roles: user.roles.map(ur => ur.role.name),
        permissions
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}