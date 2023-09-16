const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  host: "db4free.net", // Replace with your MySQL server host
  user: "tubbysparks", // Replace with your MySQL username
  password: "Adeyemo@", // Replace with your MySQL password
  database: "tubbysparks", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Define CRUD routes (see next step)

// READ: Fetching all persons
app.get("/api", (req, res) => {
  const sql = "SELECT * FROM person";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving users:", err);
      res.status(500).json({ message: "Error retrieving users" });
      return;
    }
    res.json(results);
  });
});

// CREATE: Adding a new user
app.post("/api", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO person (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Error creating user" });
      return;
    }
    res.status(201).json({ message: "User created", name });
  });
});

// READ: Fetching details of a user by name
app.get("/api/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "SELECT * FROM person WHERE id = ?";
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      res.status(500).json({ message: "Error retrieving user" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(results[0]);
  });
});

// UPDATE: Modifying details of an existing user by name
app.put("/api/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { email } = req.body;
  const sql = "UPDATE person SET email = ? WHERE id = ?";
  db.query(sql, [email, user_id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Error updating user" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User updated", name });
  });
});

app.delete("/api/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Error deleting user" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
