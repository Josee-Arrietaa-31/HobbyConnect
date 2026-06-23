const express = require("express");
const bcrypt = require("bcryptjs");
const { auth } = require("../middleware/auth");
const { query } = require("../db");
const router = express.Router();

router.get("/hobbies", auth, async (req, res) => {
  try {
    const r = await query(
      `SELECT h.id, h.name, uh.level FROM user_hobbies uh
       JOIN hobbies h ON h.id = uh.hobby_id
       WHERE uh.user_id = $1 ORDER BY h.name`, [req.user.id]);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

router.post("/hobbies", auth, async (req, res) => {
  const { hobbyId, level } = req.body || {};
  const levels = ["principiante", "intermedio", "avanzado"];
  if (!hobbyId || !levels.includes(level)) return res.status(400).json({ error: "Datos inválidos" });
  try {
    await query(
      `INSERT INTO user_hobbies(user_id,hobby_id,level) VALUES($1,$2,$3)
       ON CONFLICT (user_id,hobby_id) DO UPDATE SET level = EXCLUDED.level`,
      [req.user.id, hobbyId, level]);
    res.status(201).json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

router.delete("/hobbies/:hobbyId", auth, async (req, res) => {
  try {
    await query("DELETE FROM user_hobbies WHERE user_id=$1 AND hobby_id=$2", [req.user.id, req.params.hobbyId]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

router.get("/groups", auth, async (req, res) => {
  try {
    const r = await query(
      `SELECT g.id, g.name, g.level, g.community, h.name AS hobby
       FROM memberships m JOIN groups g ON g.id = m.group_id JOIN hobbies h ON h.id = g.hobby_id
       WHERE m.user_id = $1 ORDER BY g.name`, [req.user.id]);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

// Editar perfil: nombre y/o contraseña
router.patch("/", auth, async (req, res) => {
  const { name, password } = req.body || {};
  try {
    if (name && name.trim()) {
      await query("UPDATE users SET name=$1 WHERE id=$2", [name.trim(), req.user.id]);
    }
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
      const hash = await bcrypt.hash(password, 10);
      await query("UPDATE users SET password_hash=$1 WHERE id=$2", [hash, req.user.id]);
    }
    const r = await query("SELECT id, name, email, role FROM users WHERE id=$1", [req.user.id]);
    res.json({ user: r.rows[0] });
  } catch (e) { res.status(500).json({ error: "Error al actualizar el perfil" }); }
});

module.exports = router;
