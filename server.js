const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CREATE SUPPLIER
========================= */
app.post("/supplier", (req, res) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and city required" });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO suppliers (name, city) VALUES (?, ?)"
    );

    const result = stmt.run(name, city);

    res.json({
      id: result.lastInsertRowid,
      name,
      city,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE INVENTORY
========================= */
app.post("/inventory", (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // validation
  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity must be >= 0" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be > 0" });
  }

  try {
    // check supplier exists
    const supplier = db
      .prepare("SELECT * FROM suppliers WHERE id = ?")
      .get(supplier_id);

    if (!supplier) {
      return res.status(400).json({ message: "Invalid supplier_id" });
    }

    const stmt = db.prepare(`
      INSERT INTO inventory (supplier_id, product_name, quantity, price)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      supplier_id,
      product_name,
      quantity,
      price
    );

    res.json({ id: result.lastInsertRowid });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET INVENTORY
========================= */
app.get("/inventory", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM inventory").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   INVENTORY SUMMARY
========================= */
app.get("/inventory-summary", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        s.id,
        s.name,
        SUM(i.quantity * i.price) AS total_value
      FROM suppliers s
      JOIN inventory i ON s.id = i.supplier_id
      GROUP BY s.id
      ORDER BY total_value DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ROOT (optional)
========================= */
app.get("/", (req, res) => {
  res.send("Part B API is running 🚀");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
