# Prisma Stabilization Report

## Overview

This project involved stabilizing a fragile e-commerce backend API by replacing unsafe database practices with Prisma ORM. The goal was to improve reliability, prevent crashes, and ensure data consistency during operations like checkout.

---

## Changes Implemented

### 1. Replaced Raw SQL with Prisma

Previously, the application used raw SQL queries through the `pg` library. This was error-prone and hard to maintain.

All queries were replaced with Prisma methods such as:

* `findMany()` for fetching records
* `findUnique()` for single record lookup
* `create()` for inserting data
* `update()` for modifying data

This improved code readability and safety.

---

### 2. Updated Database Schema

A `stock` field was added to the Product model:

* Type: Integer
* Default value: 0

This ensures inventory tracking and prevents undefined stock values.

---

### 3. Implemented Prisma Singleton

A single shared Prisma client was created in:

```
prisma/client.js
```

This prevents multiple database connections from being opened on every request, avoiding connection exhaustion.

---

### 4. Fixed Connection Leaks

All controllers were updated to use the shared Prisma client instead of creating new instances.

Before:

* New PrismaClient created inside controllers

After:

* Imported singleton client across the application

---

### 5. Added Null Safety

API endpoints now handle missing data gracefully.

Example:

* If a product is not found, the API returns a `404` response instead of crashing.

---

### 6. Secured Checkout with Transactions

The checkout process was updated using Prisma transactions.

This ensures:

* Order creation and stock update happen together
* If one operation fails, all changes are rolled back

This prevents data corruption and inconsistent states.

---

## Testing

The API was tested using Postman / Thunder Client:

* Fetch all products
* Fetch product by ID (including invalid IDs)
* Place an order (stock decreases correctly)
* Handle out-of-stock scenarios

---

## Conclusion

The backend is now:

* More stable
* Safer against crashes
* Protected from partial data writes
* Easier to maintain using Prisma ORM

---
