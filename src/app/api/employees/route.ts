import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, hasPermission } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// GET /api/employees - List all employees
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !hasPermission(user, 'employees.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const companyId = searchParams.get('companyId')

    const where: any = {
      ...(user.companyId && { companyId: user.companyId }),
      ...(companyId && { companyId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeCode: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const [employees, total] = await Promise.all([
      db.employee.findMany({
        where,
        include: {
          company: {
            select: { id: true, name: true }
          },
          allowances: {
            where: { isRecurring: true }
          },
          deductions: {
            where: { isRecurring: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.employee.count({ where })
    ])

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Employees fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !hasPermission(user, 'employees.create')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Calculate hourly rate (basic * 12 / 2288)
    const hourlyRate = Number(data.basicSalary) * 12 / 2288

    // Generate employee code if not provided
    if (!data.employeeCode) {
      const count = await db.employee.count({
        where: { companyId: user.companyId }
      })
      data.employeeCode = `EMP${String(count + 1).padStart(4, '0')}`
    }

    const employee = await db.employee.create({
      data: {
        ...data,
        hourlyRate,
        companyId: user.companyId || data.companyId
      },
      include: {
        company: {
          select: { id: true, name: true }
        }
      }
    })

    // Create user account if email is provided
    if (data.createUserAccount && data.email) {
      const defaultPassword = 'Temp@123456'
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)

      await db.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: `${data.firstName} ${data.lastName}`,
          companyId: user.companyId || data.companyId,
          employeeId: employee.id
        }
      })
    }

    return NextResponse.json({
      message: 'Employee created successfully',
      employee
    })

  } catch (error) {
    console.error('Employee creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}