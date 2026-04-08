# Zeerostock Assignment

## 📌 Overview

This project implements two parts:

* **Part A:** Inventory Search API + UI
* **Part B:** Inventory Database + APIs

The goal is to allow users to search inventory and manage supplier-based inventory data.

---

# 🔍 Part A — Inventory Search API + UI

## Features

* Search products by name (partial match)
* Filter by category
* Filter by price range
* Combine multiple filters
* Case-insensitive search
* “No results found” handling

---

## Backend API

### Endpoint

GET /search

### Query Parameters

* q → product name (partial match)
* category → filter by category
* minPrice → minimum price
* maxPrice → maximum price

---

## Search Logic

The API starts with the full dataset and applies filters step-by-step based on query parameters.
All filters are optional and combined using AND logic.

---

## Edge Cases Handled

* Empty query returns all results
* Invalid price range returns error
* No matches returns empty array

---

## Performance Improvement

For large datasets, performance can be improved using:

* Database indexing
* Pagination
* Search engines like Elasticsearch

---

## Deployment

* Frontend: https://inventory-search-git-main-rohitbitlas-projects.vercel.app
* Backend: https://inventory-search-chpv.onrender.com

---

# 🗄️ Part B — Inventory Database + APIs

## Database Schema

### Suppliers Table

* id
* name
* city

### Inventory Table

* id
* supplier_id
* product_name
* quantity
* price

---

## Relationship

One supplier can have multiple inventory items (one-to-many relationship).

---

## APIs

### POST /supplier

Creates a new supplier

### POST /inventory

Adds inventory for a supplier

### GET /inventory

Returns all inventory

---

## Validation Rules

* Inventory must belong to a valid supplier
* Quantity must be ≥ 0
* Price must be > 0

---

## Required Query

Returns all inventory grouped by supplier and sorted by total inventory value:

(total value = quantity × price)

---

## Implementation

This is implemented using SQL aggregation:

* GROUP BY supplier
* SUM(quantity × price)
* ORDER BY total value DESC

---

## Database Choice

SQL (SQLite) was used because:

* Structured relational data
* Supports foreign keys
* Efficient for aggregation queries

---

## Optimization Suggestion

Adding an index on `supplier_id` improves query performance for joins and grouping.

---

## Deployment

* Backend: [https://inventory-database-xpj0.onrender.com]

---

# ⚙️ Tech Stack

* Frontend: React (Vite), Axios
* Backend: Node.js, Express
* Database: SQLite (better-sqlite3)

---

# ▶️ How to Run Locally

## Part A

### Backend

cd backend
npm install
node server.js

### Frontend

cd frontend
npm install
npm run dev

---

## Part B

cd part-b-backend
npm install
node server.js

---

# 🎯 Conclusion

This project demonstrates:

* API design and filtering logic
* Relational database modeling
* Data validation
* SQL aggregation queries
* Full-stack deployment
