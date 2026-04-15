# Pre-Refactor Audit

## Tenant Isolation Issues

1. users table has no tenant_id column  
→ Risk: Queries without filtering will return users from all organizations

2. projects table is not linked to tenants  
→ Risk: Projects from one company can be accessed by another

---

## Relationship Issues

3. projects.user_id does not enforce tenant consistency  
→ Risk: A project could reference a user from a different tenant

---

## Sensitive Data Exposure

4. users.salary is stored without restriction  
→ Risk: Any user can access salary data

5. billing_details.card_last4 is exposed  
→ Risk: Financial data leak

---

## Access Control Issues

6. No role-based access control exists  
→ Risk: All users have equal access to all data

---

## Query Issues

7. No tenant-based filtering in queries  
→ Risk: Missing WHERE clause exposes all data

---

## Performance Issues

8. No indexes on tenant-related queries  
→ Risk: Slow queries and scalability issues
# Pre-Refactor Audit

## Tenant Isolation Issues

1. employees table has no tenant_id column  
→ Risk: Employees from all companies are stored together with no separation

2. tenants table exists but is not linked to employees  
→ Risk: Tenant system is not actually enforced

---

## Sensitive Data Exposure

3. employees.salary is stored without access restriction  
→ Risk: Any user can view salary data

---

## Relationship Issues

4. No foreign key relationship between employees and tenants  
→ Risk: Employees are not tied to any tenant

---

## Query Issues

5. No tenant-based filtering in queries  
→ Risk: Queries can return all employees across tenants

---

## Access Control Issues

6. No role-based access control (RBAC)  
→ Risk: All users can access all employee data

---

## Performance Issues

7. No index on tenant_id (since it does not exist yet)  
→ Risk: Future tenant queries will be slow

---

## Data Security Issues

8. Department and employee data are globally accessible  
→ Risk: One company can view another company's internal structure