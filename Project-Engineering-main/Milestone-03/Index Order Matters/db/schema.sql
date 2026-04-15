CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    
    department VARCHAR(50),
    salary NUMERIC,
    hire_date DATE,
    tenant_id INT NOT NULL,
    role VARCHAR(20) DEFAULT 'User'
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX idx_salary_department ON employees(salary, department);
CREATE INDEX idx_employees_tenant ON employees(tenant_id);