const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../db");
const router = express.Router();
const SECRET = () => process.env.JWT_SECRET || "dev_secret";

function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, SECRET(), { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Faltan datos" });
  if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  try {
    const exists = await query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length) return res.status(409).json({ error: "El correo ya está registrado" });
    const hash = await bcrypt.hash(password, 10);
    const r = await query("INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email,role", [name, email, hash]);
    const user = r.rows[0];
    res.status(201).json({ token: makeToken(user), user });
  } catch (e) { console.error(e); res.status(500).json({ error: "Error en el servidor" }); }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Faltan datos" });
  try {
    const r = await query("SELECT * FROM users WHERE email=$1", [email]);
    if (!r.rows.length) return res.status(401).json({ error: "Credenciales incorrectas" });
    const u = r.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });
    const user = { id: u.id, name: u.name, email: u.email, role: u.role };
    res.json({ token: makeToken(user), user });
  } catch (e) { console.error(e); res.status(500).json({ error: "Error en el servidor" }); }
});

module.exports = router;
