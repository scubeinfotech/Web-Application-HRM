# 🔄 Change Management & Modification Guide

## 📋 Overview

This document outlines the procedures for managing changes, modifications, and updates to the HRM system. It ensures systematic approach to code changes, testing, and deployment.

## 🏗️ Change Management Process

### **1. Change Request Workflow**
```
Request → Analysis → Planning → Development → Testing → Review → Deployment → Monitoring
```

### **2. Change Categories**
- **Critical**: Security patches, production bugs (24-48 hours)
- **High**: Feature enhancements, performance improvements (1-2 weeks)
- **Medium**: UI improvements, minor features (2-4 weeks)
- **Low**: Documentation, code refactoring (4-8 weeks)

## 🔧 Common Change Scenarios & Solutions

### **Scenario 1: Database Schema Changes**
```bash
# Step 1: Create migration
npx prisma migrate dev --name "add_new_field"

# Step 2: Update Prisma schema
# Edit prisma/schema.prisma

# Step 3: Generate new client
npx prisma generate

# Step 4: Test in development
npm run dev

# Step 5: Deploy to staging
docker-compose -f docker-compose.staging.yml up -d

# Step 6: Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### **Scenario 2: Adding New API Endpoints**
```typescript
// 1. Create new API route
// src/app/api/employees/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employee = await db.employee.findUnique({
      where: { id: params.id },
      include: { user: true, company: true }
    })

    return NextResponse.json(employee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### **Scenario 3: UI Component Updates**
```typescript
// 1. Update existing component
// src/components/employees/EmployeeCard.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Employee } from '@/types'

interface EmployeeCardProps {
  employee: Employee
  onUpdate?: (employee: Employee) => void
}

export function EmployeeCard({ employee, onUpdate }: EmployeeCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {employee.fullName}
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
            {employee.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Component content */}
      </CardContent>
    </Card>
  )
}
```

### **Scenario 4: Environment Configuration Changes**
```bash
# 1. Update environment variables
# .env.local

DATABASE_URL="postgresql://user:password@localhost:5432/hrm_db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# 2. Update Docker environment
# docker-compose.yml

environment:
  - DATABASE_URL=${DATABASE_URL}
  - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
  - REDIS_URL=${REDIS_URL}
```

## 🐛 Bug Fixing Process

### **1. Bug Identification**
```bash
# Check logs
docker-compose logs -f app

# Monitor database queries
npx prisma studio

# Check performance
npm run build
npm run start
```

### **2. Bug Fix Template**
```typescript
// Example: Fix timesheet calculation bug
// src/lib/timesheet-calculator.ts

export function calculateOvertime(hours: number, rate: number): {
  normalPay: number
  overtimePay: number
  totalPay: number
} {
  // Fix: Ensure proper overtime calculation
  const normalHours = Math.min(hours, 8)
  const overtimeHours = Math.max(0, hours - 8)
  
  // Singapore overtime rules
  const overtimeRate = overtimeHours > 0 ? 1.5 : 1
  
  return {
    normalPay: normalHours * rate,
    overtimePay: overtimeHours * rate * overtimeRate,
    totalPay: (normalHours * rate) + (overtimeHours * rate * overtimeRate)
  }
}
```

### **3. Testing Bug Fixes**
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Manual testing checklist
- [ ] Functionality works as expected
- [ ] No regression in other features
- [ ] Performance impact is minimal
- [ ] Security is not compromised
```

## 🚀 Deployment Process

### **1. Development Deployment**
```bash
# Local development
npm run dev

# Docker development
docker-compose up -d
```

### **2. Staging Deployment**
```bash
# Build for staging
npm run build:staging

# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d

# Run smoke tests
npm run test:smoke
```

### **3. Production Deployment**
```bash
# Create backup
docker-compose exec db pg_dump -U postgres hrm_db > backup.sql

# Deploy to production
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Health check
curl -f http://localhost:3000/api/health || exit 1
```

## 📝 Change Documentation

### **1. Changelog Format**
```markdown
## [1.1.0] - 2025-01-XX

### Added
- Enhanced employee search functionality
- New dashboard analytics
- Mobile responsive improvements

### Changed
- Updated CPF calculation formulas
- Improved API response times
- Enhanced security headers

### Fixed
- Fixed timesheet overtime calculation bug
- Resolved login session timeout issue
- Fixed UI alignment on mobile devices

### Security
- Updated dependencies for security patches
- Enhanced input validation
- Improved rate limiting
```

### **2. Release Notes Template**
```markdown
# Release Notes v1.1.0

## 🎉 New Features
- Feature 1 description
- Feature 2 description

## 🔧 Improvements
- Performance improvement details
- UI/UX enhancements

## 🐛 Bug Fixes
- Critical bug fixes
- Minor bug fixes

## 📋 Breaking Changes
- Any breaking changes and migration steps

## 🚀 Upgrade Instructions
- Step-by-step upgrade guide
```

## 🔍 Code Review Process

### **1. Pre-commit Checklist**
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Format code
npm run format
```

### **2. Code Review Criteria**
- **Functionality**: Does the code work as intended?
- **Performance**: Is the code efficient?
- **Security**: Are there any security vulnerabilities?
- **Maintainability**: Is the code readable and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is the code well-documented?

## 🚨 Emergency Changes

### **1. Hotfix Process**
```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug-fix

# 2. Implement fix
# Make necessary changes

# 3. Quick test
npm run test:critical

# 4. Deploy hotfix
git add .
git commit -m "hotfix: critical security fix"
git push origin hotfix/critical-bug-fix

# 5. Merge to main
git checkout main
git merge hotfix/critical-bug-fix
git push origin main
```

### **2. Rollback Procedure**
```bash
# 1. Identify last stable version
git log --oneline

# 2. Rollback to stable version
git checkout <stable-commit-hash>

# 3. Deploy rollback
docker-compose down
docker-compose up -d

# 4. Verify rollback
curl -f http://localhost:3000/api/health
```

## 📊 Monitoring & Alerting

### **1. Health Checks**
```typescript
// src/app/api/health/route.ts

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    // Check Redis connection
    // await redis.ping()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    )
  }
}
```

### **2. Performance Monitoring**
```bash
# Monitor application performance
docker stats

# Check database performance
docker-compose exec db psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Monitor logs
docker-compose logs -f --tail=100
```

## 📚 Best Practices

### **1. Code Quality**
- Follow TypeScript best practices
- Use meaningful variable names
- Write self-documenting code
- Keep functions small and focused
- Use consistent code style

### **2. Security**
- Never commit secrets
- Use environment variables for sensitive data
- Implement proper input validation
- Follow principle of least privilege
- Regular security audits

### **3. Performance**
- Optimize database queries
- Use caching appropriately
- Monitor bundle size
- Implement lazy loading
- Regular performance audits

---

*Last Updated: January 2025*
*Version: 1.0.0*
*Maintained by: Scube Infotech Team*