# AUTH-BUGS.md

## Observed Behaviours (Before Fixing)

The following behaviours were observed when testing the application in an incognito window before making any code changes:

- Navigating directly to `/dashboard` without logging in renders the dashboard page instead of redirecting to the login page.
- Navigating directly to `/settings` without logging in renders the settings page.
- Navigating directly to `/profile` without logging in renders the profile page.
- After logging in and refreshing the page, the user is logged out.
- No authentication data (token or user) is stored in localStorage after login.
- Navbar always displays the "Login" button, even after successful login.
- There is no "Logout" button available in the Navbar.
- User information (such as name) is not displayed anywhere in the UI after login.
- Protected routes are accessible via URL even when the user is not authenticated.

---

## Root Cause Analysis

### Bug 1 — Missing AuthProvider

**Root Cause:**  
The `AuthProvider` component was not wrapping the application in `main.jsx`. Although it was imported, it was never used.

**Impact:**  
- `useAuth()` returned `undefined` or `null`
- No global authentication state was available
- Components could not access user or token
- Authentication logic failed across the entire app

---

### Bug 2 — No localStorage Persistence

**Root Cause:**  
The `AuthContext` did not properly store authentication data in localStorage during login, nor retrieve it on application load.

**Impact:**  
- User session was lost on page refresh
- Authentication state was not persisted
- User had to log in again after every refresh

---

### Bug 3 — No Protected Routes

**Root Cause:**  
Private routes (`/dashboard`, `/settings`, `/profile`) were not wrapped with any authentication guard component.

**Impact:**  
- Unauthenticated users could access protected pages by typing URLs directly
- No redirection to login page
- Application security was completely bypassed

---

### Bug 4 — Navbar Not Connected to Auth State

**Root Cause:**  
The Navbar component did not use the `useAuth()` hook and had hardcoded UI.

**Impact:**  
- Navbar always showed "Login" button
- No "Logout" functionality available
- User information was not displayed
- UI did not update after login or logout

---

## Fixes Applied

### Bug 1 Fix — AuthProvider Integration

- Wrapped the entire application with `AuthProvider` in `main.jsx`
- Ensured all components can access authentication context

---

### Bug 2 Fix — localStorage Synchronization

- Implemented storage of `authToken` and `authUser` in localStorage during login
- Added `useEffect` in `AuthProvider` to load stored data on app initialization
- Ensured logout clears localStorage completely
- Verified that authentication persists after page refresh

---

### Bug 3 Fix — Protected Routes Implementation

- Created `ProtectedRoute.jsx` component
- Used `useAuth()` to check `isAuthenticated`
- Redirected unauthenticated users to `/login` using `<Navigate replace />`
- Wrapped all private routes:
  - `/dashboard`
  - `/settings`
  - `/profile`

---

### Bug 4 Fix — Navbar Authentication State

- Integrated `useAuth()` into Navbar
- Conditionally rendered UI based on `isAuthenticated`
- Displayed user name when logged in
- Added Logout button with proper handler
- Ensured UI updates immediately after login/logout

---

## Test Evidence

The following scenarios were tested after applying all fixes:

### 1. Unauthenticated Access Protection
- Navigating to `/dashboard` without logging in redirects to `/login`

### 2. Successful Login
- User is redirected to `/dashboard`
- Navbar updates to show user name and Logout button

### 3. Persistence After Refresh
- Refreshing the page keeps the user logged in
- Authentication state is restored from localStorage

### 4. Logout Flow
- Clicking Logout clears authentication state
- User is redirected to `/login`
- Navbar updates to show Login button

### 5. Post-Logout Protection
- Attempting to access `/dashboard` after logout redirects to `/login`

---

## Conclusion

All four critical authentication issues were identified and resolved:

- Authentication context is now properly wired
- User sessions persist across refreshes
- Protected routes are secured against unauthorized access
- UI accurately reflects authentication state at all times

The authentication flow is now fully functional and secure from a frontend perspective.
