const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/supplier", (req, res) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return res.status(400).json({ message: "Name and city required" });
  }

  db.run(
    `INSERT INTO suppliers (name, city) VALUES (?, ?)`,
    [name, city],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID, name, city });
    }
  );
});
app.post("/inventory", (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // Validate rules
  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity must be >= 0" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be > 0" });
  }

  // Check supplier exists
  db.get(
    `SELECT * FROM suppliers WHERE id = ?`,
    [supplier_id],
    (err, supplier) => {
      if (!supplier) {
        return res.status(400).json({ message: "Invalid supplier_id" });
      }

      db.run(
        `INSERT INTO inventory (supplier_id, product_name, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [supplier_id, product_name, quantity, price],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ id: this.lastID });
        }
      );
    }
  );
});
app.get("/inventory", (req, res) => {
  db.all(
    `SELECT * FROM inventory`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(rows);
    }
  );
});
app.get("/inventory-summary", (req, res) => {
  db.all(
    `
    SELECT 
      s.id,
      s.name,
      SUM(i.quantity * i.price) AS total_value
    FROM suppliers s
    JOIN inventory i ON s.id = i.supplier_id
    GROUP BY s.id
    ORDER BY total_value DESC
    `,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(rows);
    }
  );
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});