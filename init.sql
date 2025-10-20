-- HRM System Database Initialization
-- Singapore Standards HR Management

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hrm_system;

-- Use the database
\c hrm_system;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_nric ON employees(nric);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_timesheets_employee_id ON timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_date ON timesheets(date);
CREATE INDEX IF NOT EXISTS idx_timesheets_status ON timesheets(status);
CREATE INDEX IF NOT EXISTS idx_salary_slips_employee_month ON salary_slips(employee_id, month, year);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Insert default data
INSERT INTO companies (id, name, description, uen, address, phone, email, is_active, created_at, updated_at) VALUES
('default-company', 'Default Company', 'Default company for HRM system', '123456789X', '123 Business Street, Singapore', '+65-1234-5678', 'admin@company.com', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert default roles
INSERT INTO roles (id, name, description, permissions, is_active, created_at, updated_at) VALUES
('super-admin', 'Super Admin', 'Full system access', '["*"]', true, NOW(), NOW()),
('admin', 'Admin', 'Company administrator', '["employees.*", "timesheets.*", "payroll.*", "reports.*", "clients.*", "projects.*"]', true, NOW(), NOW()),
('hr-manager', 'HR Manager', 'HR operations manager', '["employees.read", "employees.create", "employees.update", "timesheets.*", "payroll.*", "leaves.*"]', true, NOW(), NOW()),
('project-manager', 'Project Manager', 'Project management', '["projects.*", "timesheets.read", "timesheets.approve", "reports.project"]', true, NOW(), NOW()),
('employee', 'Employee', 'Regular employee access', '["timesheets.create", "timesheets.read_own", "leaves.create", "leaves.read_own", "profile.read", "profile.update"]', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert default admin user (password: Admin@123456)
INSERT INTO users (id, email, password, name, company_id, is_active, created_at, updated_at) VALUES
('admin-user', 'admin@hrm.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'System Administrator', 'default-company', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (id, user_id, role_id) VALUES
('admin-role', 'admin-user', 'super-admin')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert default leave types
INSERT INTO leave_types (id, name, description, days_allowed, is_paid, is_active, created_at, updated_at) VALUES
('annual', 'Annual Leave', 'Paid annual leave as per Singapore Employment Act', 14, true, true, NOW(), NOW()),
('sick', 'Sick Leave', 'Paid sick leave with medical certificate', 14, true, true, NOW(), NOW()),
('hospitalization', 'Hospitalization Leave', 'Paid hospitalization leave', 60, true, true, NOW(), NOW()),
('maternity', 'Maternity Leave', 'Paid maternity leave', 16, true, true, NOW(), NOW()),
('paternity', 'Paternity Leave', 'Paid paternity leave', 2, true, true, NOW(), NOW()),
('childcare', 'Childcare Leave', 'Paid childcare leave', 6, true, true, NOW(), NOW()),
('unpaid', 'Unpaid Leave', 'Unpaid leave', 365, false, true, NOW(), NOW()),
('compassionate', 'Compassionate Leave', 'Compassionate leave for family matters', 3, true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, name, description, address, phone, email, contact_person, is_active, created_at, updated_at) VALUES
('client-1', 'Tech Solutions Pte Ltd', 'Technology consulting company', '1 Raffles Place, Singapore', '+65-6234-5678', 'contact@techsolutions.sg', 'John Tan', true, NOW(), NOW()),
('client-2', 'Global Innovations Inc', 'Software development company', '100 Beach Road, Singapore', '+65-6334-5678', 'info@globalinnovations.com', 'Sarah Lee', true, NOW(), NOW()),
('client-3', 'Digital Agency Asia', 'Digital marketing agency', '10 Marina Boulevard, Singapore', '+65-6534-5678', 'hello@digitalagency.asia', 'Mike Wong', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, client_id, name, description, start_date, end_date, estimated_cost, status, is_active, created_at, updated_at) VALUES
('project-1', 'client-1', 'HRM System Development', 'Complete HRM system for Singapore standards', '2024-01-01', '2024-06-30', 150000.00, 'IN_PROGRESS', true, NOW(), NOW()),
('project-2', 'client-2', 'Mobile App Development', 'iOS and Android mobile application', '2024-02-01', '2024-08-31', 200000.00, 'PLANNING', true, NOW(), NOW()),
('project-3', 'client-3', 'Website Redesign', 'Complete website redesign and optimization', '2024-03-01', '2024-05-31', 50000.00, 'IN_PROGRESS', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create view for employee statistics
CREATE OR REPLACE VIEW employee_stats AS
SELECT 
    c.id as company_id,
    c.name as company_name,
    COUNT(e.id) as total_employees,
    COUNT(CASE WHEN e.employment_status = 'ACTIVE' THEN 1 END) as active_employees,
    COUNT(CASE WHEN e.work_pass_type = 'SINGAPOREAN' THEN 1 END) as singaporean_count,
    COUNT(CASE WHEN e.work_pass_type = 'PR' THEN 1 END) as pr_count,
    COUNT(CASE WHEN e.work_pass_type = 'SPASS' THEN 1 END) as spass_count,
    COUNT(CASE WHEN e.work_pass_type = 'EPASS' THEN 1 END) as epass_count,
    COUNT(CASE WHEN e.work_pass_type = 'WPASS' THEN 1 END) as wpass_count,
    AVG(e.basic_salary) as avg_basic_salary,
    SUM(e.basic_salary) as total_monthly_payroll
FROM companies c
LEFT JOIN employees e ON c.id = e.company_id AND e.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name;

-- Create view for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    c.id as client_id,
    c.name as client_name,
    COUNT(p.id) as total_projects,
    COUNT(CASE WHEN p.status = 'IN_PROGRESS' THEN 1 END) as active_projects,
    COUNT(CASE WHEN p.status = 'COMPLETED' THEN 1 END) as completed_projects,
    SUM(p.estimated_cost) as total_estimated_cost,
    SUM(p.actual_cost) as total_actual_cost,
    AVG(p.estimated_cost) as avg_project_value
FROM clients c
LEFT JOIN projects p ON c.id = p.client_id AND p.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name;

-- Create function to calculate overtime pay
CREATE OR REPLACE FUNCTION calculate_overtime_pay(
    p_normal_hours DECIMAL,
    p_ot1_5_hours DECIMAL,
    p_ot2_hours DECIMAL,
    p_hourly_rate DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    RETURN (p_ot1_5_hours * p_hourly_rate * 1.5) + (p_ot2_hours * p_hourly_rate * 2);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update project actual cost when timesheets are approved
CREATE OR REPLACE FUNCTION update_project_actual_cost() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
        UPDATE projects 
        SET actual_cost = actual_cost + (
            (NEW.normal_hours * (SELECT hourly_rate FROM employees WHERE id = NEW.employee_id)) +
            calculate_overtime_pay(NEW.normal_hours, NEW.ot1_5_hours, NEW.ot2_hours, (SELECT hourly_rate FROM employees WHERE id = NEW.employee_id))
        )
        WHERE id = (
            SELECT project_id FROM project_assignments 
            WHERE id = NEW.project_assignment_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_project_actual_cost ON timesheets;
CREATE TRIGGER trigger_update_project_actual_cost
    AFTER UPDATE ON timesheets
    FOR EACH ROW
    EXECUTE FUNCTION update_project_actual_cost();

COMMIT;