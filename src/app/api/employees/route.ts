import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const companyId = searchParams.get('companyId')

    const skip = (page - 1) * limit

    const where = {
      ...(companyId && { companyId }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { employeeCode: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [employees, total] = await Promise.all([
      db.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: {
            select: { name: true }
          },
          user: {
            select: { email: true, isActive: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.employee.count({ where })
    ])

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      firstName,
      lastName,
      email,
      phone,
      nric,
      workPassType,
      workPassNumber,
      dateOfBirth,
      gender,
      nationality,
      maritalStatus,
      joinDate,
      basicSalary,
      bankName,
      bankAccount,
      employmentType,
      department,
      position,
      companyId
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !nric || !dateOfBirth || !gender || !nationality || !joinDate || !basicSalary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if employee already exists
    const existingEmployee = await db.employee.findFirst({
      where: {
        OR: [
          { email },
          { nric }
        ]
      }
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email or NRIC already exists' },
        { status: 400 }
      )
    }

    // Generate employee code
    const employeeCount = await db.employee.count()
    const employeeCode = `EMP${String(employeeCount + 1).padStart(4, '0')}`

    // Calculate hourly rate (Basic Salary × 12 / 2288)
    const hourlyRate = (Number(basicSalary) * 12) / 2288

    // Create employee
    const employee = await db.employee.create({
      data: {
        employeeCode,
        firstName,
        lastName,
        email,
        phone,
        nric,
        workPassType,
        workPassNumber,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        nationality,
        maritalStatus,
        joinDate: new Date(joinDate),
        basicSalary: Number(basicSalary),
        hourlyRate: Number(hourlyRate.toFixed(2)),
        bankName,
        bankAccount,
        employmentType,
        department,
        position,
        companyId: companyId || null
      },
      include: {
        company: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}