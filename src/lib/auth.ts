import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  email: string
  name: string
  companyId?: string
  roles: string[]
  permissions: string[]
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Get user with roles and permissions
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    // Extract permissions from all roles
    const permissions = user.roles.reduce((acc: string[], userRole) => {
      const rolePermissions = Array.isArray(userRole.role.permissions) 
        ? userRole.role.permissions 
        : []
      return [...acc, ...rolePermissions]
    }, [])

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      companyId: user.companyId || undefined,
      roles: user.roles.map(ur => ur.role.name),
      permissions
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false
  return user.permissions.includes(permission) || user.permissions.includes('*')
}

export function hasRole(user: AuthUser | null, role: string): boolean {
  if (!user) return false
  return user.roles.includes(role) || user.roles.includes('SUPER_ADMIN')
}

export function createAuthMiddleware(requiredPermissions?: string[], requiredRoles?: string[]) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check roles
    if (requiredRoles && !requiredRoles.some(role => hasRole(user, role))) {
      return NextResponse.json(
        { error: 'Insufficient role permissions' },
        { status: 403 }
      )
    }

    // Check permissions
    if (requiredPermissions && !requiredPermissions.some(permission => hasPermission(user, permission))) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Add user to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.id)
    requestHeaders.set('x-user-email', user.email)
    requestHeaders.set('x-user-company', user.companyId || '')

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
}