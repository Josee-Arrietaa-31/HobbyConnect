const express = require("express");
const { query } = require("../db");
const router = express.Router();

// Lista de hobbies con cantidad de grupos
router.get("/", async (req, res) => {
  try {
    const r = await query(
      `SELECT h.id, h.name, COUNT(g.id)::int AS groups
       FROM hobbies h LEFT JOIN groups g ON g.hobby_id = h.id
       GROUP BY h.id, h.name ORDER BY h.name`
    );
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: "Error al obtener hobbies" }); }
});

module.exports = router;
