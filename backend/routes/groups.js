const express = require("express");
const { auth, optionalAuth } = require("../middleware/auth");
const { query } = require("../db");
const { isValidLevel, canManageGroup } = require("../utils");
const router = express.Router();

async function getGroup(id) {
  const r = await query("SELECT id, created_by FROM groups WHERE id=$1", [id]);
  return r.rows[0] || null;
}

router.get("/", optionalAuth, async (req, res) => {
  const { hobbyId, level, community } = req.query;
  const uid = req.user ? req.user.id : 0;
  const cond = [];
  const params = [uid];
  if (hobbyId) { params.push(hobbyId); cond.push(`g.hobby_id = $${params.length}`); }
  if (level) { params.push(level); cond.push(`g.level = $${params.length}`); }
  if (community) { params.push("%" + community + "%"); cond.push(`g.community ILIKE $${params.length}`); }
  const where = cond.length ? "WHERE " + cond.join(" AND ") : "";
  try {
    const r = await query(
      `SELECT g.id, g.name, g.description, g.level, g.community, h.name AS hobby,
              (SELECT COUNT(*)::int FROM memberships m WHERE m.group_id = g.id) AS members,
              EXISTS(SELECT 1 FROM memberships m WHERE m.group_id = g.id AND m.user_id = $1) AS "isMember"
       FROM groups g JOIN hobbies h ON h.id = g.hobby_id
       ${where} ORDER BY g.created_at DESC`, params);
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ error: "Error al obtener grupos" }); }
});

router.post("/", auth, async (req, res) => {
  const { name, description, hobbyId, level, community } = req.body || {};
  if (!name || !hobbyId || !isValidLevel(level) || !community)
    return res.status(400).json({ error: "Datos inválidos" });
  try {
    const r = await query(
      `INSERT INTO groups(name,description,hobby_id,level,community,created_by)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
      [name, description || "", hobbyId, level, community, req.user.id]);
    const id = r.rows[0].id;
    await query("INSERT INTO memberships(group_id,user_id) VALUES($1,$2)", [id, req.user.id]);
    res.status(201).json({ id });
  } catch (e) { console.error(e); res.status(500).json({ error: "Error al crear el grupo" }); }
});

router.get("/:id", optionalAuth, async (req, res) => {
  const uid = req.user ? req.user.id : 0;
  try {
    const g = await query(
      `SELECT g.id, g.name, g.description, g.level, g.community, g.created_by, h.name AS hobby,
              (SELECT COUNT(*)::int FROM memberships m WHERE m.group_id = g.id) AS members,
              EXISTS(SELECT 1 FROM memberships m WHERE m.group_id = g.id AND m.user_id = $2) AS "isMember"
       FROM groups g JOIN hobbies h ON h.id = g.hobby_id WHERE g.id = $1`, [req.params.id, uid]);
    if (!g.rows.length) return res.status(404).json({ error: "Grupo no encontrado" });
    const row = g.rows[0];
    const acts = await query(
      `SELECT id, title, description, location, created_by AS "createdBy",
              to_char(activity_date,'YYYY-MM-DD') AS date
       FROM activities WHERE group_id = $1 ORDER BY activity_date`, [req.params.id]);
    const comments = await query(
      `SELECT c.id, c.user_id AS "userId", u.name AS author, c.body,
              to_char(c.created_at,'YYYY-MM-DD HH24:MI') AS date
       FROM comments c JOIN users u ON u.id = c.user_id
       WHERE c.group_id = $1 ORDER BY c.created_at`, [req.params.id]);
    const memberList = await query(
      `SELECT u.id, u.name FROM memberships m JOIN users u ON u.id = m.user_id
       WHERE m.group_id = $1 ORDER BY u.name`, [req.params.id]);
    res.json({
      ...row,
      isOwner: req.user ? row.created_by === req.user.id : false,
      activities: acts.rows,
      comments: comments.rows,
      memberList: memberList.rows,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: "Error al obtener el grupo" }); }
});

// Editar grupo (dueño o admin)
router.put("/:id", auth, async (req, res) => {
  const { name, description, level, community } = req.body || {};
  if (!name || !isValidLevel(level) || !community) return res.status(400).json({ error: "Datos inválidos" });
  try {
    const group = await getGroup(req.params.id);
    if (!group) return res.status(404).json({ error: "Grupo no encontrado" });
    if (!canManageGroup(req.user, group)) return res.status(403).json({ error: "No tenés permiso" });
    await query("UPDATE groups SET name=$1, description=$2, level=$3, community=$4 WHERE id=$5",
      [name, description || "", level, community, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error al editar el grupo" }); }
});

// Eliminar grupo (dueño o admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await getGroup(req.params.id);
    if (!group) return res.status(404).json({ error: "Grupo no encontrado" });
    if (!canManageGroup(req.user, group)) return res.status(403).json({ error: "No tenés permiso" });
    await query("DELETE FROM groups WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error al eliminar el grupo" }); }
});

router.post("/:id/join", auth, async (req, res) => {
  try {
    await query("INSERT INTO memberships(group_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING", [req.params.id, req.user.id]);
    res.status(201).json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error al unirse" }); }
});

router.post("/:id/leave", auth, async (req, res) => {
  try {
    await query("DELETE FROM memberships WHERE group_id=$1 AND user_id=$2", [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error al salir del grupo" }); }
});

router.post("/:id/activities", auth, async (req, res) => {
  const { title, description, location, date } = req.body || {};
  if (!title || !date) return res.status(400).json({ error: "Título y fecha son obligatorios" });
  try {
    const mem = await query("SELECT 1 FROM memberships WHERE group_id=$1 AND user_id=$2", [req.params.id, req.user.id]);
    if (!mem.rows.length) return res.status(403).json({ error: "Debe ser miembro del grupo" });
    const r = await query(
      `INSERT INTO activities(group_id,title,description,location,activity_date,created_by)
       VALUES($1,$2,$3,$4,$5,$6)
       RETURNING id, title, description, location, to_char(activity_date,'YYYY-MM-DD') AS date`,
      [req.params.id, title, description || "", location || "", date, req.user.id]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: "Error al crear la actividad" }); }
});

// Eliminar actividad (autor, dueño del grupo o admin)
router.delete("/:id/activities/:aid", auth, async (req, res) => {
  try {
    const group = await getGroup(req.params.id);
    if (!group) return res.status(404).json({ error: "Grupo no encontrado" });
    const a = await query("SELECT created_by FROM activities WHERE id=$1 AND group_id=$2", [req.params.aid, req.params.id]);
    if (!a.rows.length) return res.status(404).json({ error: "Actividad no encontrada" });
    const isAuthor = a.rows[0].created_by === req.user.id;
    if (!isAuthor && !canManageGroup(req.user, group)) return res.status(403).json({ error: "No tenés permiso" });
    await query("DELETE FROM activities WHERE id=$1", [req.params.aid]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error al eliminar la actividad" }); }
});

router.post("/:id/comments", auth, async (req, res) => {
  const { body } = req.body || {};
  if (!body || !body.trim()) return res.status(400).json({ error: "El comentario no puede estar vacío" });
  try {
    const mem = await query("SELECT 1 FROM memberships WHERE group_id=$1 AND user_id=$2", [req.params.id, req.user.id]);
    if (!mem.rows.length) return res.status(403).json({ error: "Debe ser miembro del grupo" });
    const r = await query(
      `INSERT INTO comments(group_id,user_id,body) VALUES($1,$2,$3)
       RETURNING id, body, to_char(created_at,'YYYY-MM-DD HH24:MI') AS date`,
      [req.params.id, req.user.id, body.trim()]);
    res.status(201).json({ ...r.rows[0], author: req.user.name, userId: req.user.id });
  } catch (e) { console.error(e); res.status(500).json({ error: "Error al comentar" }); }
});

// Eliminar comentario (autor, dueño del grupo o admin)
router.delete("/:id/comments/:cid", auth, async (req, res) => {
  try {
    const group = await getGroup(req.params.id);
    if (!group) return res.status(404).json({ error: "Grupo no encontrado" });
    const c = await query("SELECT user_id FROM comments WHERE id=$1 AND group_id=$2", [req.params.cid, req.params.id]);
    if (!c.rows.length) return res.status(404).json({ error: "Comentario no encontrado" });
    const isAuthor = c.rows[0].user_id === req.user.id;
    if (!isAuthor && !canManageGroup(req.user, group)) return res.status(403).json({ error: "No tenés permiso" });
    await query("DELETE FROM comments WHERE id=$1", [req.params.cid]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Error al eliminar el comentario" }); }
});

module.exports = router;
