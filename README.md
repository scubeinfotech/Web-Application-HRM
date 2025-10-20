<<<<<<< HEAD
# 🚀 Singapore HRM System - Production Ready

A comprehensive, production-ready Human Resource Management system specifically designed for Singapore standards. Built with modern technologies and deployed using Docker containers for scalability and portability.

## ✨ Key Features

### 🏢 **Multi-Company Management**
- Support for multiple sister concerns
- Company-specific data isolation
- Centralized administration

### 👥 **Employee Management (Singapore Standards)**
- Complete employee profiles with Singapore-specific fields
- NRIC validation and management
- Work Pass types: Singaporean, PR, S Pass, Employment Pass, Work Permit
- CPF (Central Provident Fund) calculations
- SDL and FWL levy management
- Photo upload and document management

### ⏰ **Advanced Timesheet System**
- Daily time entry with overtime calculations
- Singapore overtime rules:
  - Standard hours: 8 AM - 5 PM
  - 1.5x rate: 5 PM - 11:59 PM
  - 2x rate: 12 AM - 8 AM
- Automatic hourly rate calculation (Basic × 12 / 2288)
- Project-based time tracking
- Approval workflows

### 💰 **Comprehensive Payroll System**
- Multi-company salary slip generation
- Automated overtime calculations
- Allowances and deductions management
- CPF calculations for Singapore compliance
- Company-specific payroll processing

### 🏗️ **Project & Client Management**
- Client database with contact information
- Project tracking with cost estimation
- Actual cost calculation from timesheets
- Project assignment management

### 📝 **Leave Management**
- Multiple leave types (Annual, Sick, Maternity, etc.)
- Leave balance tracking
- Approval workflows
- Singapore Employment Act compliance

### 🔐 **IAM (Identity & Access Management)**
- Role-based access control (RBAC)
- Granular permissions system
- User session management
- Audit trail for all activities
- Multi-level user roles:
  - Super Admin
  - Company Admin
  - HR Manager
  - Project Manager
  - Employee

## 🛠️ Technology Stack

### **Frontend**
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Modern utility-first styling
- **🧩 shadcn/ui** - Premium component library
- **🎯 Lucide React** - Beautiful icon system
- **📊 Recharts** - Data visualization
- **🔄 TanStack Query** - Server state management

### **Backend**
- **🗄️ PostgreSQL** - Robust open-source database
- **🔧 Prisma ORM** - Type-safe database operations
- **🔐 JWT Authentication** - Secure token-based auth
- **⚡ Redis** - Caching and session storage
- **🚀 Node.js** - High-performance runtime

### **Infrastructure**
- **🐳 Docker & Docker Compose** - Containerized deployment
- **🌐 Nginx** - Reverse proxy with load balancing
- **🔒 SSL/TLS** - Secure HTTPS deployment
- **📈 Health Checks** - System monitoring

## 🚀 Quick Start

### **Prerequisites**
- Docker and Docker Compose
- Git
- 4GB+ RAM recommended

### **1. Clone & Setup**
```bash
git clone https://github.com/scubeinfotech/Web-Application-HRM.git
cd Web-Application-HRM
```

### **2. Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### **3. Deploy with Docker**
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f hrm-app
```

### **4. Initialize Database**
```bash
# Access the application container
docker-compose exec hrm-app sh

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

### **5. Access the Application**
- **Application**: http://localhost:3000
- **Admin Login**: admin@hrm.com / Admin@123456
- **API Health**: http://localhost:3000/api/health
=======
<<<<<<< HEAD
# 🚀 Welcome to Z.ai Code Scaffold

A modern, production-ready web application scaffold powered by cutting-edge technologies, designed to accelerate your development with [Z.ai](https://chat.z.ai)'s AI-powered coding assistance.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!
>>>>>>> 978d9d138756189dac8b73219b8bb59e163e1c02

## 📁 Project Structure

```
<<<<<<< HEAD
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── employees/  # Employee management
│   │   │   ├── timesheets/ # Time tracking
│   │   │   ├── payroll/    # Salary processing
│   │   │   └── ...         # Other modules
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility libraries
│   │   ├── auth.ts        # Authentication logic
│   │   ├── db.ts          # Database connection
│   │   └── utils.ts       # Helper functions
│   └── types/             # TypeScript definitions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── docker-compose.yml     # Docker orchestration
├── Dockerfile            # Application container
├── nginx.conf            # Nginx configuration
└── init.sql              # Database initialization
```

## 🔧 Configuration

### **Database Setup**
The system uses PostgreSQL with the following key tables:
- `companies` - Multi-company support
- `users` - IAM system
- `employees` - Employee records
- `timesheets` - Time tracking
- `salary_slips` - Payroll records
- `projects` - Project management
- `clients` - Client information

### **Security Features**
- JWT-based authentication
- Role-based access control
- Rate limiting (Nginx)
- SQL injection prevention (Prisma)
- XSS protection headers
- CSRF protection

### **Performance Optimizations**
- Database indexing
- Redis caching
- Image optimization (Sharp)
- Gzip compression
- Lazy loading components

## 📊 API Documentation

### **Authentication**
```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### **Employees**
```http
GET    /api/employees          # List employees
POST   /api/employees          # Create employee
GET    /api/employees/:id      # Get employee
PUT    /api/employees/:id      # Update employee
DELETE /api/employees/:id      # Delete employee
```

### **Timesheets**
```http
GET    /api/timesheets         # List timesheets
POST   /api/timesheets         # Create/update timesheet
PUT    /api/timesheets/:id     # Approve timesheet
```

### **Payroll**
```http
GET    /api/payroll/slip       # Generate salary slip
POST   /api/payroll/process    # Process monthly payroll
```

## 🎯 Singapore Compliance

### **Employment Act Compliance**
- Standard working hours: 8 hours/day, 44 hours/week
- Overtime calculations as per MOM guidelines
- Leave entitlements (Annual, Sick, Maternity)
- CPF contribution calculations

### **Work Pass Management**
- Support for all Singapore work pass types
- Document tracking and expiry alerts
- Levy calculations (S Pass, Work Permit)

### **Payroll Standards**
- CPF contribution rates
- SDL levy calculations
- Itemized payslips
- IRAS compliance

## 🔒 Security Best Practices

1. **Change Default Passwords**: Update all default credentials
2. **Environment Variables**: Never commit secrets to Git
3. **Regular Updates**: Keep dependencies updated
4. **Backup Strategy**: Regular database backups
5. **Access Control**: Implement principle of least privilege
6. **Monitoring**: Set up log monitoring and alerts

## 📈 Monitoring & Maintenance

### **Health Checks**
```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker-compose exec postgres pg_isready -U hrm_user -d hrm_system

# Redis health
docker-compose exec redis redis-cli ping
```

### **Logs Management**
```bash
# Application logs
docker-compose logs -f hrm-app

# Database logs
docker-compose logs -f postgres

# Nginx logs
docker-compose logs -f nginx
```

### **Backup Commands**
```bash
# Database backup
docker-compose exec postgres pg_dump -U hrm_user hrm_system > backup.sql

# Volume backup
docker run --rm -v hrm_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/postgres_backup.tar.gz -C /data .
```

## 🚀 Deployment Options

### **Development**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### **Production**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Proxmox VM Setup**
1. Create Ubuntu VM (4GB+ RAM, 20GB+ storage)
2. Install Docker and Docker Compose
3. Clone repository and deploy
4. Configure reverse proxy and SSL
5. Set up monitoring and backups

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@scubeinfotech.com
- 🐛 Issues: [GitHub Issues](https://github.com/scubeinfotech/Web-Application-HRM/issues)
- 📖 Documentation: [Wiki](https://github.com/scubeinfotech/Web-Application-HRM/wiki)

## 🎉 Acknowledgments

- Built with ❤️ for Singapore businesses
- Powered by modern web technologies
- Optimized for Proxmox and Docker deployment
- Singapore MOM compliant

---

**🚀 Production Ready HRM System for Singapore Standards**

Built with cutting-edge technology and designed for scalability, security, and ease of use. Perfect for small to medium-sized businesses in Singapore looking for a comprehensive HR management solution.
=======
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🤝 Get Started with Z.ai

1. **Clone this scaffold** to jumpstart your project
2. **Visit [chat.z.ai](https://chat.z.ai)** to access your AI coding assistant
3. **Start building** with intelligent code generation and assistance
4. **Deploy with confidence** using the production-ready setup

---

Built with ❤️ for the developer community. Supercharged by [Z.ai](https://chat.z.ai) 🚀
=======
# Web-Application-HRM
Web-Application-HRM
>>>>>>> 286bf0089a91f83dfc5aba4aef2a189b766c28f2
>>>>>>> 978d9d138756189dac8b73219b8bb59e163e1c02
