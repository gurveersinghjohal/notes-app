const broken = ;
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.query(`CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, text TEXT)`);

app.get("/api/notes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM notes ORDER BY id");
  res.json(rows);
});

app.post("/api/notes", async (req, res) => {
  await pool.query("INSERT INTO notes (text) VALUES ($1)", [req.body.text]);
  res.sendStatus(201);
});

app.listen(process.env.PORT || 3000, "0.0.0.0");