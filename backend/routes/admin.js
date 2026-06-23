const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const { query } = require("../db");
const router = express.Router();

router.use(auth, adminOnly);

// Estadísticas
router.get("/stats", async (req, res) => {
  try {
    const r = await query(
      `SELECT
        (SELECT COUNT(*)::int FROM users) AS users,
        (SELECT COUNT(*)::int FROM groups) AS groups,
        (SELECT COUNT(*)::int FROM hobbies) AS hobbies,
        (SELECT COUNT(*)::int FROM activities) AS activities`);
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

// Usuarios
router.get("/users", async (req, res) => {
  try {
    const r = await query("SELECT id, name, email, role FROM users ORDER BY id");
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body || {};
  if (!["user", "admin"].includes(role)) return res.status(400).json({ error: "Rol inválido" });
  try {
    await query("UPDATE users SET role=$1 WHERE id=$2", [role, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

// Grupos
router.get("/groups", async (req, res) => {
  try {
    const r = await query(
      `SELECT g.id, g.name, g.level, g.community, h.name AS hobby,
              (SELECT COUNT(*)::int FROM memberships m WHERE m.group_id = g.id) AS members
       FROM groups g JOIN hobbies h ON h.id = g.hobby_id ORDER BY g.created_at DESC`);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

router.delete("/groups/:id", async (req, res) => {
  try {
    await query("DELETE FROM groups WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

// Hobbies
router.post("/hobbies", async (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: "El nombre es obligatorio" });
  try {
    const r = await query("INSERT INTO hobbies(name) VALUES($1) RETURNING id, name", [name.trim()]);
    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Ese hobby ya existe" });
    res.status(500).json({ error: "Error" });
  }
});

router.delete("/hobbies/:id", async (req, res) => {
  try {
    await query("DELETE FROM hobbies WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === "23503") return res.status(409).json({ error: "No se puede eliminar: hay grupos con ese hobby" });
    res.status(500).json({ error: "Error" });
  }
});

module.exports = router;
