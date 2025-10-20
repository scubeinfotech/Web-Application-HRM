import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, hasPermission } from '@/lib/auth'

// Singapore overtime calculation rules
function calculateOvertime(clockIn: Date, clockOut: Date, hourlyRate: number) {
  const totalMs = clockOut.getTime() - clockIn.getTime()
  const totalHours = totalMs / (1000 * 60 * 60)
  
  let normalHours = 0
  let ot1_5Hours = 0
  let ot2Hours = 0

  // Standard working hours: 8 AM - 5 PM (8 hours)
  const standardStart = new Date(clockIn)
  standardStart.setHours(8, 0, 0, 0)
  const standardEnd = new Date(clockIn)
  standardEnd.setHours(17, 0, 0, 0)

  // 1.5x rate: 5 PM - 11:59 PM
  const ot1_5Start = new Date(clockIn)
  ot1_5Start.setHours(17, 0, 0, 0)
  const ot1_5End = new Date(clockIn)
  ot1_5End.setHours(23, 59, 59, 999)

  // 2x rate: 12 AM - 8 AM
  const ot2Start = new Date(clockIn)
  ot2Start.setHours(0, 0, 0, 0)
  const ot2End = new Date(clockIn)
  ot2End.setHours(8, 0, 0, 0)

  // Calculate hours for each period
  const periods = [
    { start: standardStart, end: standardEnd, rate: 1, type: 'normal' },
    { start: ot1_5Start, end: ot1_5End, rate: 1.5, type: 'ot1_5' },
    { start: ot2Start, end: ot2End, rate: 2, type: 'ot2' }
  ]

  periods.forEach(period => {
    const periodStart = new Date(Math.max(clockIn.getTime(), period.start.getTime()))
    const periodEnd = new Date(Math.min(clockOut.getTime(), period.end.getTime()))
    
    if (periodEnd > periodStart) {
      const hoursInPeriod = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60)
      
      switch (period.type) {
        case 'normal':
          normalHours = Math.min(hoursInPeriod, 8) // Max 8 normal hours
          break
        case 'ot1_5':
          ot1_5Hours += hoursInPeriod
          break
        case 'ot2':
          ot2Hours += hoursInPeriod
          break
      }
    }
  })

  return {
    normalHours: Math.max(0, normalHours),
    ot1_5Hours: Math.max(0, ot1_5Hours),
    ot2Hours: Math.max(0, ot2Hours),
    totalHours: Math.max(0, totalHours),
    overtimePay: (ot1_5Hours * hourlyRate * 1.5) + (ot2Hours * hourlyRate * 2)
  }
}

// GET /api/timesheets - List timesheets
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !hasPermission(user, 'timesheets.read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      ...(user.companyId && {
        employee: { companyId: user.companyId }
      }),
      ...(employeeId && { employeeId }),
      ...(status && { status: status as any }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    }

    const [timesheets, total] = await Promise.all([
      db.timesheet.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeCode: true,
              hourlyRate: true
            }
          },
          project: {
            include: {
              project: {
                select: { id: true, name: true }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.timesheet.count({ where })
    ])

    return NextResponse.json({
      timesheets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Timesheets fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/timesheets - Create or update timesheet
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !hasPermission(user, 'timesheets.create')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { employeeId, date, clockIn, clockOut, breakMinutes = 0, projectAssignmentId } = data

    // Get employee details
    const employee = await db.employee.findUnique({
      where: { id: employeeId },
      select: { hourlyRate: true, companyId: true }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Check company access
    if (user.companyId && employee.companyId !== user.companyId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const clockInTime = new Date(clockIn)
    const clockOutTime = clockOut ? new Date(clockOut) : new Date()

    // Calculate overtime
    const overtimeCalculation = calculateOvertime(
      clockInTime,
      clockOutTime,
      Number(employee.hourlyRate)
    )

    // Adjust for break time
    const breakHours = breakMinutes / 60
    overtimeCalculation.normalHours = Math.max(0, overtimeCalculation.normalHours - breakHours)
    overtimeCalculation.totalHours = Math.max(0, overtimeCalculation.totalHours - breakHours)

    // Create or update timesheet
    const timesheet = await db.timesheet.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(date)
        }
      },
      update: {
        clockIn: clockInTime,
        clockOut: clockOutTime,
        breakMinutes,
        normalHours: overtimeCalculation.normalHours,
        ot1_5Hours: overtimeCalculation.ot1_5Hours,
        ot2Hours: overtimeCalculation.ot2Hours,
        totalHours: overtimeCalculation.totalHours,
        projectAssignmentId,
        status: 'PENDING'
      },
      create: {
        employeeId,
        date: new Date(date),
        clockIn: clockInTime,
        clockOut: clockOutTime,
        breakMinutes,
        normalHours: overtimeCalculation.normalHours,
        ot1_5Hours: overtimeCalculation.ot1_5Hours,
        ot2Hours: overtimeCalculation.ot2Hours,
        totalHours: overtimeCalculation.totalHours,
        projectAssignmentId,
        status: 'PENDING'
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeCode: true,
            hourlyRate: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Timesheet saved successfully',
      timesheet: {
        ...timesheet,
        overtimePay: overtimeCalculation.overtimePay
      }
    })

  } catch (error) {
    console.error('Timesheet creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}