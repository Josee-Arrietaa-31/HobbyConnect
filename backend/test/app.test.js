const test = require("node:test");
const assert = require("node:assert");
const app = require("../app");

test("la aplicación Express se carga correctamente", () => {
  assert.strictEqual(typeof app, "function");
});
