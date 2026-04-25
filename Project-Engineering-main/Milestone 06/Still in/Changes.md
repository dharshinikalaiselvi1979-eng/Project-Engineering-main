# Still In? – Bug Fix Log

Please document all the fixes you implemented below. For each fix, describe:
1. **The Problem**: What was going wrong?
2. **The Discovery**: How did you find it (e.g., Network Tab, console, code audit)?
3. **The Fix**: What code did you change and why?

---

## 🛠️ Your Fixes

### 1. [Fix Title Here]
- **Description**: ...
- **Solution**: ...

### 2. [Fix Title Here]
- **Description**: ...
- **Solution**: ...

*(Add more as needed...)*
Changes.md
Investigation Summary

After running the polling application locally and testing the authentication flow, several critical issues were identified related to token expiry handling, duplicate voting, and improper frontend behavior.

Issues Identified
1. Expired Token Returns Incorrect HTTP Status

Observed Behavior:

After token expiry (1 minute), API requests fail.
Server returns 500 Internal Server Error instead of indicating authentication failure.
Error message is unclear and does not help the frontend understand session expiry.

Why This Is Dangerous:

Frontend cannot distinguish between server failure and expired session.
Users remain in a “logged-in” state even though their session is invalid.
Leads to inconsistent UI and potential unauthorized actions.
2. Duplicate Voting Allowed

Observed Behavior:

Users are able to vote multiple times on the same poll.

Root Cause:

votedUserIds.find(id => id === req.user.email)
votedUserIds stores user IDs (numbers or strings)
req.user.email is an email (string)
Type mismatch causes the check to always fail.

Why This Is Dangerous:

Breaks poll integrity.
Allows manipulation of results.
Violates core business logic.
3. Frontend Ignores Authentication Errors

Observed Behavior:

When token expires, API calls fail silently.
User is not logged out.
No redirection to login page.
Token remains in localStorage.

Why This Is Dangerous:

Stale sessions persist.
User thinks they are authenticated when they are not.
Repeated failed API calls degrade performance.
4. Polling Interval Continues After Token Expiry

Observed Behavior:

Dashboard continues polling every 10 seconds using setInterval.
Even after token expiry, polling does not stop.

Why This Is Dangerous:

Unnecessary API calls flood the backend.
Memory leaks due to uncleared intervals.
Poor user experience and wasted resources.
Fixes Applied
1. Fixed Authentication Middleware

Changes:

Specifically handled token expiry error.
Returned correct HTTP status.
if (err.name === "TokenExpiredError") {
  return res.status(401).json({ message: "Session expired" });
}

Result:

Expired sessions now return 401 Unauthorized
Frontend can correctly detect session expiration.
2. Fixed Duplicate Vote Logic

Changes:

Used consistent identifier (user.id) instead of email.
Replaced .find() with .includes().
if (votedUserIds.includes(req.user.id)) {
  return res.status(400).json({ message: "Already voted" });
}

Result:

Duplicate votes are prevented.
Data consistency maintained.
3. Added Axios Response Interceptor

Changes:

Implemented global interceptor for handling 401 errors.
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

Result:

User is automatically logged out on expiry.
Redirected to login page.
Prevents stale session usage.
4. Stopped Polling on Session Expiry

Changes:

Stored interval ID and cleared it on logout or 401.
const interval = setInterval(fetchPoll, 10000);

return () => clearInterval(interval);
Ensured cleanup when:
Component unmounts
Session expires
User logs out

Result:

No unnecessary API calls after expiry.
Improved performance and memory usage.
Before vs After Behavior
Before Fixes
Token expiry returns 500 error
User stays on dashboard after expiry
Can attempt actions with invalid session
Polling continues indefinitely
Duplicate votes allowed
After Fixes
Token expiry returns 401 Unauthorized
User is redirected to login immediately
Polling stops automatically
Duplicate voting is blocked
Session handling is clean and predictable
Conclusion

The application previously suffered from improper session management, leading to stale authentication, excessive API calls, and broken business logic.

With these fixes:

Authentication is now handled securely
Frontend and backend are properly synchronized
Resource usage is optimized
Poll integrity is preserved
<!-- hnwkowjkwjo -->