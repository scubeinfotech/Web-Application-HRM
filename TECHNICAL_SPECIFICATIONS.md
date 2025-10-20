# 📋 Technical Specifications - HRM System

## 🛠️ Technology Stack Overview

### **Core Framework & Language**
- **Next.js 15** with App Router (Latest React framework)
- **TypeScript 5** (Type-safe JavaScript)
- **Node.js** (Runtime environment)

### **Frontend Technologies**
- **Tailwind CSS 4** (Utility-first CSS framework)
- **shadcn/ui** (Modern UI component library)
- **Framer Motion** (Animation library)
- **Lucide React** (Icon library)
- **React Hook Form** (Form handling)
- **Zod** (Schema validation)

### **Backend & Database**
- **PostgreSQL** (Primary database)
- **Prisma ORM** (Database toolkit)
- **JWT** (JSON Web Tokens for authentication)
- **bcrypt** (Password hashing)

### **Deployment & Infrastructure**
- **Docker** (Containerization)
- **Docker Compose** (Multi-container orchestration)
- **Nginx** (Web server & reverse proxy)
- **Redis** (Caching & session storage)
- **Proxmox VM** (Virtualization platform)

## 🗄️ Database Architecture

### **Primary Database: PostgreSQL**
```sql
-- Core Tables Structure
Users (Authentication & IAM)
├── Employees (HR Data)
├── Companies (Multi-company support)
├── Timesheets (Attendance records)
├── Leaves (Leave management)
├── Clients (Customer management)
├── Projects (Project tracking)
├── Salaries (Payroll processing)
└── AuditLogs (Activity tracking)
```

### **Database Schema Highlights**
- **Multi-tenant architecture** with company-based segregation
- **Singapore-specific fields** (NRIC, work passes, CPF calculations)
- **Role-based permissions** with granular access control
- **Audit trails** for compliance and tracking
- **Optimized indexes** for performance

### **Key Database Tables**
```sql
-- Users Table (Authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employees Table (HR Data)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  nric VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  work_pass_type work_pass_enum NOT NULL,
  basic_salary DECIMAL(10,2) NOT NULL,
  -- Additional Singapore-specific fields
  created_at TIMESTAMP DEFAULT NOW()
);

-- Companies Table (Multi-company support)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(50) UNIQUE,
  address TEXT,
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📊 Component Architecture

### **Total Components Created: 95-115**

#### **UI Components (shadcn/ui based) - ~25-30**
```
Core UI Components:
├── Form components (Input, Select, etc.)
├── Data display (Table, Card, Badge)
├── Navigation (Menu, Breadcrumb, Tabs)
├── Feedback (Dialog, Alert, Toast)
└── Layout (Sidebar, Header, Footer)
```

#### **Business Logic Components - ~40-50**
```
Feature Components:
├── Employee Management (8-10)
├── Timesheet System (6-8)
├── Leave Management (5-7)
├── Client & Projects (6-8)
├── Salary Processing (5-7)
├── IAM & Security (4-6)
└── Dashboard & Reports (6-8)
```

#### **Backend Components - ~30-35**
```
Server Components:
├── API Routes (15-20)
├── Database Models (8-10)
├── Middleware (3-5)
├── Utilities (4-6)
└── Configuration (2-4)
```

## 🚀 Performance & Security Features

### **Performance Optimizations**
- **Database indexing** for frequently queried fields
- **Connection pooling** for database efficiency
- **Redis caching** for session management
- **Query optimization** with Prisma
- **Lazy loading** for heavy components
- **Code splitting** for better bundle management

### **Security Features**
- **JWT authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **SQL injection prevention** via Prisma ORM
- **XSS protection** with content security policy
- **Password hashing** with bcrypt
- **Audit logging** for compliance

## 📈 Enhancement Roadmap

### **Phase 1: Immediate Improvements (Next 3 months)**
1. **Mobile responsiveness enhancement**
2. **Performance monitoring implementation**
3. **Advanced search and filtering**
4. **Bulk operations for data management**
5. **Enhanced reporting capabilities**

### **Phase 2: Medium-term Enhancements (3-6 months)**
1. **AI-powered analytics**
2. **Integration with Singapore government APIs**
3. **Mobile application development (React Native)**
4. **Advanced workflow automation**
5. **Multi-language support**

### **Phase 3: Long-term Enhancements (6-12 months)**
1. **Machine learning for predictive analytics**
2. **Blockchain for secure record keeping**
3. **Advanced BI dashboard**
4. **Third-party integrations (Payroll, Banking)**
5. **Cloud-native architecture migration**

## 🔧 Technical Debt & Maintenance

### **Areas Requiring Attention**
1. **Database optimization** for large datasets
2. **API rate limiting** implementation
3. **Error handling** standardization
4. **Testing coverage** improvement
5. **Documentation** enhancement

### **Maintenance Strategy**
- **Regular security updates** (monthly)
- **Performance monitoring** (continuous)
- **Database maintenance** (quarterly)
- **Dependency updates** (bi-weekly)
- **Code refactoring** (as needed)

## 📋 Singapore Compliance Features

### **MOM Standards Implementation**
- **Work Pass Management**: EP, S Pass, WP tracking
- **CPF Calculations**: Automated computation based on age and salary
- **SDL Contributions**: Skills Development Levy calculations
- **FWL Calculations**: Foreign Worker Levy management
- **Working Hours**: Compliance with Singapore Employment Act

### **Leave Management (Singapore Employment Act)**
- **Annual Leave**: Minimum 7 days (first year), progressive increase
- **Sick Leave**: 14 days + 60 days hospitalization
- **Maternity Leave**: 16 weeks (Singapore citizens)
- **Paternity Leave**: 2 weeks (Singapore citizens)
- **Childcare Leave**: 6 days per year
- **Annual Leave**: Progressive based on years of service

## 🎯 System Capabilities

### **Multi-Company Support**
- **Independent company management**
- **Shared user pool with company segregation**
- **Role-based permissions per company**
- **Consolidated reporting across companies**

### **Scalability Features**
- **Horizontal scaling** with Docker containers
- **Database sharding** support for large datasets
- **Load balancing** ready architecture
- **CDN integration** for static assets

### **Integration Capabilities**
- **RESTful API** for third-party integrations
- **Webhook support** for real-time updates
- **Import/Export** functionality
- **API rate limiting** for controlled access

---

*Last Updated: January 2025*
*Version: 1.0.0*
*Maintained by: Scube Infotech Team*