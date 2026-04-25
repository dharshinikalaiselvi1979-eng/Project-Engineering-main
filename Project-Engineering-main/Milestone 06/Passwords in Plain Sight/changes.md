# Password Security Fix — CredApp

## What I Found
After running the application and creating a test user, I checked the database and found that the password was stored in plain text.

Example:
{
  "email": "test@example.com",
  "password": "password123"
}

This falls under **Type 1 — Plain Text Storage (Critical Risk)** because the password is directly readable by anyone with database access.

---

## Root Cause
The issue was caused by the signup controller storing the password directly from `req.body.password` without any transformation or hashing.

Code responsible:
```js
const user = await User.create({
  email,
  password
})