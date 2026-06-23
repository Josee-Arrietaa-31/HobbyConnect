const bcrypt = require("bcryptjs");
const { query } = require("./db");

async function seedIfEmpty() {
  const r = await query("SELECT COUNT(*)::int AS c FROM hobbies");
  if (r.rows[0].c > 0) {
    console.log("La base ya tiene datos, se omite la semilla.");
    return;
  }
  console.log("Sembrando datos de ejemplo...");

  const hash = await bcrypt.hash("demo1234", 10);
  const adminHash = await bcrypt.hash("admin1234", 10);

  // Usuarios: [nombre, email, hash, rol]
  const userRows = [
    ["Administrador", "admin@hobbyconnect.cr", adminHash, "admin"],
    ["Usuario Demo", "demo@hobbyconnect.cr", hash, "user"],
    ["Ana Rojas", "ana@hobbyconnect.cr", hash, "user"],
    ["Luis Mora", "luis@hobbyconnect.cr", hash, "user"],
    ["María Vega", "maria@hobbyconnect.cr", hash, "user"],
    ["Carlos Solís", "carlos@hobbyconnect.cr", hash, "user"],
  ];
  const users = {};
  for (const [name, email, h, role] of userRows) {
    const u = await query("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id", [name, email, h, role]);
    users[email] = u.rows[0].id;
  }
  const demo = users["demo@hobbyconnect.cr"];

  const hobbyNames = ["Ciclismo de montaña", "Fotografía", "Lectura", "Senderismo", "Música", "Cocina", "Videojuegos", "Astronomía"];
  const hob = {};
  for (const name of hobbyNames) {
    const h = await query("INSERT INTO hobbies(name) VALUES($1) RETURNING id", [name]);
    hob[name] = h.rows[0].id;
  }

  const groups = [
    ["Riders San Carlos", "Salidas de montaña los fines de semana, ritmo intermedio y buena onda.", "Ciclismo de montaña", "intermedio", "San Carlos, Alajuela", demo, [demo, users["ana@hobbyconnect.cr"], users["luis@hobbyconnect.cr"]]],
    ["MTB Avanzado CR", "Rutas técnicas, descensos y preparación para competencias.", "Ciclismo de montaña", "avanzado", "Nacional", users["luis@hobbyconnect.cr"], [users["luis@hobbyconnect.cr"], users["carlos@hobbyconnect.cr"]]],
    ["Foto Principiantes", "Aprendamos fotografía juntos, salidas mensuales y sin presiones.", "Fotografía", "principiante", "Cartago", users["ana@hobbyconnect.cr"], [users["ana@hobbyconnect.cr"]]],
    ["Lectores de Ciencia Ficción", "Un libro al mes y discusión sin spoilers de capítulos no leídos.", "Lectura", "intermedio", "Virtual", users["maria@hobbyconnect.cr"], [users["maria@hobbyconnect.cr"], users["carlos@hobbyconnect.cr"], users["ana@hobbyconnect.cr"]]],
    ["Senderismo Norte", "Caminatas en la zona norte para empezar con buen pie.", "Senderismo", "principiante", "Ciudad Quesada", demo, [demo]],
    ["Jam Sessions CR", "Nos juntamos a improvisar, todos los instrumentos bienvenidos.", "Música", "intermedio", "San José", users["carlos@hobbyconnect.cr"], [users["carlos@hobbyconnect.cr"], users["maria@hobbyconnect.cr"]]],
  ];
  const gid = {};
  for (const [name, desc, hobby, level, comm, creator, members] of groups) {
    const g = await query(
      "INSERT INTO groups(name,description,hobby_id,level,community,created_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING id",
      [name, desc, hob[hobby], level, comm, creator]);
    gid[name] = g.rows[0].id;
    for (const m of members) {
      await query("INSERT INTO memberships(group_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING", [g.rows[0].id, m]);
    }
  }

  await query("INSERT INTO user_hobbies(user_id,hobby_id,level) VALUES($1,$2,$3)", [demo, hob["Ciclismo de montaña"], "intermedio"]);

  await query("INSERT INTO activities(group_id,title,description,location,activity_date,created_by) VALUES($1,$2,$3,$4,$5,$6)",
    [gid["Riders San Carlos"], "Salida al cerro", "Ruta de 20 km, paramos a desayunar.", "Parque Recreativo", "2026-07-05", demo]);
  await query("INSERT INTO activities(group_id,title,description,location,activity_date,created_by) VALUES($1,$2,$3,$4,$5,$6)",
    [gid["Lectores de Ciencia Ficción"], "Discusión: Dune", "Comentamos la primera mitad.", "Google Meet", "2026-07-12", users["maria@hobbyconnect.cr"]]);

  await query("INSERT INTO comments(group_id,user_id,body) VALUES($1,$2,$3)", [gid["Riders San Carlos"], users["ana@hobbyconnect.cr"], "¡Qué buena la salida pasada! ¿Repetimos ruta este finde?"]);
  await query("INSERT INTO comments(group_id,user_id,body) VALUES($1,$2,$3)", [gid["Riders San Carlos"], demo, "Yo me apunto, salgo temprano."]);

  console.log("Semilla completa.");
  console.log("  Admin: admin@hobbyconnect.cr / admin1234");
  console.log("  Demo:  demo@hobbyconnect.cr / demo1234");
}

module.exports = { seedIfEmpty };
