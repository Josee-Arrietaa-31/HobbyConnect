const BASE = "/api";

let token = null;
try { token = localStorage.getItem("hc_token"); } catch (e) { /* noop */ }

export function setToken(t) {
  token = t;
  try {
    if (t) localStorage.setItem("hc_token", t);
    else localStorage.removeItem("hc_token");
  } catch (e) { /* noop */ }
}

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ocurrió un error");
  return data;
}
