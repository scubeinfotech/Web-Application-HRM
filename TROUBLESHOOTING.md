# 🔧 Troubleshooting Guide

## 📋 Overview

This comprehensive troubleshooting guide covers common issues, their solutions, and preventive measures for the HRM system.

## 🚨 Common Issues & Solutions

### **1. Database Connection Issues**

#### **Problem**: Cannot connect to PostgreSQL database
```bash
# Error: Connection refused or timeout
```

#### **Solutions**:
```bash
# Check if PostgreSQL is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Check connection string
echo $DATABASE_URL

# Test connection manually
docker-compose exec db psql -U postgres -d hrm_db -c "SELECT 1;"
```

#### **Prevention**:
- Monitor database health regularly
- Set up connection pooling
- Implement retry logic in application
- Use proper connection strings

### **2. Authentication Issues**

#### **Problem**: Users cannot login or sessions expire
```typescript
// Error: Invalid credentials or session timeout
```

#### **Solutions**:
```typescript
// Check NextAuth configuration
// src/lib/auth.ts

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  }
}
```

#### **Prevention**:
- Implement proper session management
- Use secure cookie settings
- Monitor authentication logs
- Regular password policy updates

### **3. Performance Issues**

#### **Problem**: Slow page loads or API responses
```bash
# Error: Request timeout or slow response
```

#### **Solutions**:
```typescript
// Optimize database queries
// src/lib/employee-service.ts

export async function getEmployeesWithPagination(
  page: number = 1,
  limit: number = 10,
  companyId?: string
) {
  const skip = (page - 1) * limit
  
  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where: companyId ? { companyId } : {},
      skip,
      take: limit,
      include: {
        user: {
          select: { email: true, role: true }
        },
        company: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.employee.count({
      where: companyId ? { companyId } : {}
    })
  ])

  return {
    employees,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}
```

#### **Prevention**:
- Implement database indexing
- Use query optimization
- Add caching layers
- Monitor performance metrics

### **4. Docker Issues**

#### **Problem**: Container fails to start or crashes
```bash
# Error: Container exit code 1 or health check failed
```

#### **Solutions**:
```bash
# Check container status
docker-compose ps

# Check container logs
docker-compose logs app

# Check resource usage
docker stats

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check disk space
df -h
```

#### **Prevention**:
- Monitor container health
- Set resource limits
- Use proper logging
- Regular maintenance

### **5. Memory Issues**

#### **Problem**: Out of memory errors
```bash
# Error: JavaScript heap out of memory
```

#### **Solutions**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Optimize memory usage in code
// src/lib/memory-optimization.ts

export function processLargeDataset(data: any[]) {
  const batchSize = 1000
  const results = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const processedBatch = batch.map(item => processItem(item))
    results.push(...processedBatch)
    
    // Force garbage collection
    if (global.gc) {
      global.gc()
    }
  }
  
  return results
}
```

#### **Prevention**:
- Monitor memory usage
- Implement streaming for large datasets
- Use pagination
- Optimize data structures

## 🔍 Debugging Tools & Techniques

### **1. Logging Strategy**
```typescript
// src/lib/logger.ts

import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

// Usage in API routes
logger.info('User login attempt', { userId, email })
logger.error('Database connection failed', { error: error.message })
```

### **2. Error Handling**
```typescript
// src/lib/error-handler.ts

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode
    }
  }
  
  logger.error('Unexpected error', { error })
  
  return {
    error: 'Internal server error',
    statusCode: 500
  }
}
```

### **3. Health Monitoring**
```typescript
// src/app/api/health/route.ts

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      redis: 'unknown',
      memory: 'unknown'
    }
  }

  try {
    // Database health check
    await db.$queryRaw`SELECT 1`
    health.checks.database = 'healthy'
  } catch (error) {
    health.checks.database = 'unhealthy'
    health.status = 'unhealthy'
  }

  try {
    // Redis health check
    // await redis.ping()
    health.checks.redis = 'healthy'
  } catch (error) {
    health.checks.redis = 'unhealthy'
    health.status = 'unhealthy'
  }

  // Memory check
  const memUsage = process.memoryUsage()
  health.checks.memory = `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503
  })
}
```

## 🛠️ Maintenance Procedures

### **1. Database Maintenance**
```bash
# Regular database maintenance
docker-compose exec db psql -U postgres -d hrm_db -c "
-- Update statistics
ANALYZE;

-- Reindex tables
REINDEX DATABASE hrm_db;

-- Clean up old sessions
DELETE FROM sessions WHERE expires_at < NOW();

-- Vacuum database
VACUUM ANALYZE;
"
```

### **2. Log Rotation**
```bash
# Setup log rotation
# /etc/logrotate.d/hrm-app

/var/log/hrm-app/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart app
    endscript
}
```

### **3. Backup Procedures**
```bash
#!/bin/bash
# backup.sh

# Database backup
docker-compose exec db pg_dump -U postgres hrm_db > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/

# Upload to cloud storage (optional)
# aws s3 cp backup_$(date +%Y%m%d_%H%M%S).sql s3://your-backup-bucket/

# Clean old backups (keep last 30 days)
find . -name "backup_*.sql" -mtime +30 -delete
find . -name "files_backup_*.tar.gz" -mtime +30 -delete
```

## 📊 Performance Monitoring

### **1. Application Metrics**
```typescript
// src/lib/metrics.ts

export function trackApiCall(endpoint: string, duration: number) {
  // Send metrics to monitoring service
  console.log(`API Call: ${endpoint} - ${duration}ms`)
}

export function trackDatabaseQuery(query: string, duration: number) {
  console.log(`DB Query: ${query} - ${duration}ms`)
}

// Middleware to track API performance
export function withPerformanceTracking(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const start = Date.now()
    const result = await handler(req, ...args)
    const duration = Date.now() - start
    
    trackApiCall(req.url, duration)
    return result
  }
}
```

### **2. Database Performance**
```sql
-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor connections
SELECT 
    state,
    count(*) as connections
FROM pg_stat_activity
GROUP BY state;
```

## 🚨 Emergency Procedures

### **1. System Down**
```bash
# Immediate response
1. Check all services: docker-compose ps
2. Check logs: docker-compose logs
3. Restart services: docker-compose restart
4. Check resources: docker stats
5. Verify health: curl http://localhost:3000/api/health
```

### **2. Database Corruption**
```bash
# Emergency recovery
1. Stop application: docker-compose stop app
2. Create backup: docker-compose exec db pg_dump -U postgres hrm_db > emergency_backup.sql
3. Check consistency: docker-compose exec db pg_dump -U postgres hrm_db > /dev/null
4. Restore from backup if needed: docker-compose exec -T db psql -U postgres hrm_db < backup.sql
5. Restart application: docker-compose start app
```

### **3. Security Incident**
```bash
# Security response
1. Change all passwords
2. Review access logs
3. Update dependencies
4. Scan for vulnerabilities
5. Implement additional security measures
```

## 📞 Support Contacts

### **Internal Support**
- **Development Team**: dev-team@company.com
- **System Administrator**: admin@company.com
- **Database Administrator**: dba@company.com

### **External Support**
- **Docker Support**: https://support.docker.com
- **PostgreSQL Community**: https://www.postgresql.org/support/
- **Next.js Documentation**: https://nextjs.org/docs

---

*Last Updated: January 2025*
*Version: 1.0.0*
*Maintained by: Scube Infotech Team*