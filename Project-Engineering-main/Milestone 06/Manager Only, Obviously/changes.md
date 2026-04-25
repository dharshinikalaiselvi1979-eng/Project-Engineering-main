Changes.md
1. Role Gap Audit

Logged in as a regular user (user@expenseapp.io
) and tested all sensitive endpoints.

Method	Endpoint	Expected	Actual (Before Fix)
PUT	/api/expenses/:id/approve	❌ Not allowed	✅ 200 OK
PUT	/api/expenses/:id/reject	❌ Not allowed	✅ 200 OK
DELETE	/api/expenses/:id	❌ Not allowed	✅ 200 OK
PUT	/api/users/:id/role	❌ Not allowed	✅ 200 OK
GET	/api/expenses	❌ Not allowed	✅ 200 OK
GET	/api/users	❌ Not allowed	✅ 200 OK
PUT	/api/expenses/:id	❌ Cannot edit others	✅ 200 OK
DELETE	/api/expenses/:id (others)	❌ Cannot delete others	✅ 200 OK

👉 Conclusion: Any authenticated user could perform admin and manager actions.

2. Root Cause Analysis
Issue 1 — Missing Role Middleware
File: routes (expenses & users)
Problem: Only authMiddleware used
Missing: requireRole()
Impact: All users can access restricted endpoints
Issue 2 — Role Not Enforced in Routes
Sensitive routes like:
Approve expense
Delete expense
Change user role
Had no role checks
Impact: Privilege escalation
Issue 3 — No Ownership Validation
File: expense controller
Problem: No check for submittedBy
Impact: Users can modify/delete others' expenses
Issue 4 — Role Escalation Vulnerability
Route: PUT /api/users/:id/role
Problem: No restriction
Impact: Any user can become admin
3. Access Model
Action	Endpoint	Allowed Roles	Before Fix	After Fix
Submit expense	POST /api/expenses	user, manager, admin	✅ All	✅ All
View own expenses	GET /api/expenses/mine	user, manager, admin	✅ All	✅ All
View all expenses	GET /api/expenses	manager, admin	❌ All users	✅ Restricted
Approve expense	PUT /api/expenses/:id/approve	manager, admin	❌ All users	✅ Restricted
Reject expense	PUT /api/expenses/:id/reject	manager, admin	❌ All users	✅ Restricted
Delete expense	DELETE /api/expenses/:id	admin only	❌ All users	✅ Restricted
View all users	GET /api/users	admin only	❌ All users	✅ Restricted
Change role	PUT /api/users/:id/role	admin only	❌ All users	✅ Restricted
Edit own expense	PUT /api/expenses/:id	owner/admin/manager	❌ All users	✅ Restricted
4. What I Fixed
✅ Added Role to JWT

Before

jwt.sign({ userId: user._id, email: user.email }, SECRET)

After

jwt.sign(
  { userId: user._id, email: user.email, role: user.role },
  SECRET
)
✅ Created Role Middleware
// middleware/roleMiddleware.js
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    next()
  }
}
✅ Applied Role Restrictions to Routes

Before

router.put('/expenses/:id/approve', authMiddleware, approveExpense)

After

router.put(
  '/expenses/:id/approve',
  authMiddleware,
  requireRole('manager', 'admin'),
  approveExpense
)

Before

router.delete('/expenses/:id', authMiddleware, deleteExpense)

After

router.delete(
  '/expenses/:id',
  authMiddleware,
  requireRole('admin'),
  deleteExpense
)

Before

router.put('/users/:id/role', authMiddleware, updateUserRole)

After

router.put(
  '/users/:id/role',
  authMiddleware,
  requireRole('admin'),
  updateUserRole
)
✅ Added Ownership Check
const expense = await Expense.findById(req.params.id)

const isOwner = expense.submittedBy.toString() === req.user.userId
const isPrivileged = ['manager', 'admin'].includes(req.user.role)

if (!isOwner && !isPrivileged) {
  return res.status(403).json({
    message: 'You can only modify your own expenses.'
  })
}
5. Verification Results
Scenario	Role	Expected	Actual	Screenshot
User approves expense	user	403	✅ 403	01-user-approve.png
User deletes expense	user	403	✅ 403	02-user-delete.png
User changes role	user	403	✅ 403	03-user-role.png
User edits others expense	user	403	✅ 403	04-user-edit.png
Manager approves expense	manager	200	✅ 200	05-manager-approve.png
Manager changes role	manager	403	✅ 403	06-manager-role.png
Admin deletes expense	admin	200	✅ 200	07-admin-delete.png
Admin changes role	admin	200	✅ 200	08-admin-role.png
Final Summary
Implemented Role-Based Access Control (RBAC)
Prevented unauthorised actions
Fixed privilege escalation vulnerabilities
Added ownership validation
Ensured secure and correct access flow