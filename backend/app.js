const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/hobbies", require("./routes/hobbies"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/me", require("./routes/me"));
app.use("/api/admin", require("./routes/admin"));

module.exports = app;
