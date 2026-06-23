const fs = require("fs");
const path = require("path");
const app = require("./app");
const { query } = require("./db");
const { seedIfEmpty } = require("./seed");

async function waitForDb(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try { await query("SELECT 1"); return; }
    catch (e) { console.log("Esperando la base de datos..."); await new Promise((r) => setTimeout(r, 2000)); }
  }
  throw new Error("No se pudo conectar a la base de datos");
}

async function runSchema() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await query(sql);
}

async function init() {
  await waitForDb();
  await runSchema();
  await seedIfEmpty();
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Backend HobbyConnect en http://localhost:${port}`));
}

init().catch((e) => { console.error(e); process.exit(1); });
