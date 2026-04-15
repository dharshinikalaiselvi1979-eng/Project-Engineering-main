# Security Decisions

## 1. Sensitive Fields

- salary → Restricted to Admin only  
Reason: Salary is confidential employee data and should not be visible to managers or normal users

---

## 2. Tenant Isolation

- Added tenant_id to employees table  
- All queries now include tenant_id filtering  

Example:
SELECT * FROM employees WHERE tenant_id = currentUser.tenant_id

Reason: Prevents data from one company being accessed by another

---

## 3. Role-Based Access Control (RBAC)

Roles implemented:
- Admin → Full access to all employee data including salary
- Manager → Can view employees but not salary
- User → Can only view their own profile

Reason: Ensures minimum necessary access for each role

---

## 4. API Response Security

- API responses are filtered before sending data
- Sensitive fields like salary are removed for non-admin roles

Reason: Prevents accidental data leaks through API responses

---

## 5. Indexing for Performance

- Added index on tenant_id

CREATE INDEX idx_employees_tenant ON employees(tenant_id);

Reason: Improves query performance for tenant-based filtering

---

## 6. Cross-Tenant Risk Prevention

- Foreign key ensures employee belongs to a tenant
- Queries always filtered by tenant_id

Risk Prevented:
- One tenant accessing another tenant’s data

---

## 7. Remaining Risks

- If tenant_id is not included in a query, data leak is still possible
- Requires strict enforcement in all API routes