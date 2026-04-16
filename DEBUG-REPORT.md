## Bug 1 — Invalid customer reference

### Symptom
Orders exist with customer_id that does not exist.

```sql
SELECT * FROM orders
WHERE customer_id NOT IN (SELECT id FROM customers);

---

# 🐛 BUG 2 — Missing NOT NULL

## 🔧 Change in `schema.sql`

Find `order_items` table.

### Add:

```sql
ALTER TABLE order_items
ALTER COLUMN quantity SET NOT NULL;
## Bug 2 — Null quantity

### Symptom

```sql
SELECT * FROM order_items WHERE quantity IS NULL;
INSERT INTO order_items (quantity) VALUES (NULL);
-- Should fail

---

# 🐛 BUG 3 — Duplicate Products (UNIQUE)

## 🔧 Change in `schema.sql`

Find `products` table.

### Add:

```sql
ALTER TABLE products
ADD CONSTRAINT unique_sku UNIQUE (sku);
## Bug 3 — Duplicate SKU

### Symptom

```sql
SELECT sku, COUNT(*)
FROM products
GROUP BY sku
HAVING COUNT(*) > 1;
INSERT INTO products (sku) VALUES ('ABC123');
INSERT INTO products (sku) VALUES ('ABC123');
-- Second insert should fail