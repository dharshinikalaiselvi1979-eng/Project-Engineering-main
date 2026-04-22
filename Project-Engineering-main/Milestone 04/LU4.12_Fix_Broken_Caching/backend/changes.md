# Fix Broken Caching - Improvements

## Issues Identified
- A single global cache key (`global_data_key`) was used for all requests, causing incorrect data sharing.
- No TTL (Time-To-Live) was implemented, leading to stale and outdated responses.
- Cache was not invalidated after DELETE and CREATE operations.
- Null values were cached, resulting in incorrect responses.
- Promises were stored in cache due to missing `await`.
- Incorrect HTTP status codes were used (200 for everything).
- Error handling was weak and responses were not properly returned.

## Improvements Implemented
- Introduced namespaced cache keys:
  - `tasks:list` for all tasks
  - `task:<id>` for individual tasks
- Added TTL (60 seconds) to all cache entries to prevent stale data.
- Implemented cache invalidation:
  - After CREATE → clear task list cache
  - After DELETE → clear task list + specific task cache
- Prevented caching of null or invalid responses.
- Fixed async issues by ensuring all database calls use `await`.
- Improved HTTP status codes:
  - `200` → success
  - `201` → resource created
  - `404` → not found
  - `500` → server error
- Added proper error handling and responses.

## Result
- API responses are now consistent and reliable.
- No stale or incorrect data is returned.
- Cache behaves predictably with expiration.
- Memory usage is controlled.
- Overall backend performance is improved without compromising correctness.