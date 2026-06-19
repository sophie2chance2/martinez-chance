import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const env = readEnv(path.join(root, ".env.local"));
const credentials = JSON.parse(fs.readFileSync(env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8"));
const token = await getAccessToken(credentials);
const metadata = await sheetsFetch(`/spreadsheets/${env.GOOGLE_SHEET_ID}?fields=properties.title,sheets.properties`, token);

console.log(`Spreadsheet: ${metadata.properties?.title || "Untitled"}`);

for (const sheet of metadata.sheets || []) {
  const title = sheet.properties.title;
  const range = `'${title.replace(/'/g, "''")}'!1:5`;
  const result = await sheetsFetch(
    `/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(range)}`,
    token
  );
  const rows = result.values || [];
  console.log(`\n[${title}]`);
  console.log(`Rows: ${sheet.properties.gridProperties?.rowCount || "unknown"}`);
  console.log(`Headers: ${(rows[0] || []).join(" | ") || "(empty)"}`);
  console.log(`Sample rows present: ${Math.max(rows.length - 1, 0)}`);
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(serviceAccount.private_key);
  const assertion = `${unsigned}.${base64Url(signature)}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error_description || "Could not authorize Google Sheets.");
  return payload.access_token;
}

async function sheetsFetch(endpoint, token) {
  const response = await fetch(`https://sheets.googleapis.com/v4${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || "Google Sheets request failed.");
  return payload;
}

function readEnv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return Object.fromEntries(raw.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return [];
    const index = trimmed.indexOf("=");
    if (index === -1) return [];
    return [trimmed.slice(0, index), trimmed.slice(index + 1)];
  }).filter((entry) => entry.length));
}

function base64Url(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
