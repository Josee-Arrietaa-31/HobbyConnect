const test = require("node:test");
const assert = require("node:assert");
const { isValidLevel, canManageGroup } = require("../utils");

test("isValidLevel acepta solo niveles válidos", () => {
  assert.ok(isValidLevel("principiante"));
  assert.ok(isValidLevel("intermedio"));
  assert.ok(isValidLevel("avanzado"));
  assert.ok(!isValidLevel("experto"));
  assert.ok(!isValidLevel(""));
});

test("canManageGroup: admin y dueño pueden, otros no", () => {
  const group = { created_by: 2 };
  assert.ok(canManageGroup({ id: 9, role: "admin" }, group));
  assert.ok(canManageGroup({ id: 2, role: "user" }, group));
  assert.ok(!canManageGroup({ id: 7, role: "user" }, group));
  assert.ok(!canManageGroup(null, group));
});
