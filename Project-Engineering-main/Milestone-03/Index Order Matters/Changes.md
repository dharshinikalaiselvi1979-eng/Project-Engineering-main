Document your index fixes here
Original index:
A composite index was initially created on the columns (status, user_id). The intention was to optimize queries filtering on both columns, but the column order did not match how the query was actually written.
Issue observed:
When running the query using EXPLAIN ANALYZE, PostgreSQL performed a Sequential Scan instead of using the index. This indicated that the index was not being utilized effectively. As a result:
The entire table was scanned row by row
Query execution time was higher
Performance degraded, especially for large datasets

Fixed index:
The index was dropped and recreated with the correct column order (user_id, status):

CREATE INDEX idx_orders_correct ON orders (user_id, status);

This ordering matches the filtering pattern used in the query, where user_id is the primary condition.

Performance improvement:
After correcting the index and re-running EXPLAIN ANALYZE:

PostgreSQL switched from Sequential Scan to Index Scan
The database was able to directly locate relevant rows instead of scanning the full table
Query execution time was significantly reduced
Overall efficiency improved, especially for queries filtering by user_id

This improvement is due to the Left-Most Prefix Rule, which states that PostgreSQL can only efficiently use a composite index if the query includes the leading (first) column(s) of the index. By placing user_id first, the index became fully usable for the query.
this is my observation
