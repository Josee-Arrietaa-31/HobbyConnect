const jwt = require("jsonwebtoken");
const SECRET = () => process.env.JWT_SECRET || "dev_secret";

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado" });
  try {
    req.user = jwt.verify(token, SECRET());
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try { req.user = jwt.verify(token, SECRET()); } catch { /* ignore */ }
  }
  next();
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Se requiere rol de administrador" });
  }
  next();
}

module.exports = { auth, optionalAuth, adminOnly };
