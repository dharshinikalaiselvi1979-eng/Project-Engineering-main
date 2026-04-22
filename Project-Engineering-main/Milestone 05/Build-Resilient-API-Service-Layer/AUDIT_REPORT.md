API ISSUES FOUND
Multiple fetch calls across components
Hardcoded API URLs
Manual token handling in components
No centralized error handling
Inconsistent async patterns
AFTER FIX
All API calls moved to api.js
Axios instance created
Interceptors added
Token handled globally
Clean architecture achieved