import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import handler from "../api/rsvp.js";

const root = path.resolve(import.meta.dirname, "..");
const env = readEnv(path.join(root, ".env.local"));
Object.assign(process.env, env);

const credentials = JSON.parse(fs.readFileSync(env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8"));
const token = await getAccessToken(credentials);
const range = encodeURIComponent(`'${env.GUEST_SHEET_NAME}'!A:D`);
const sheetResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${range}`, {
  headers: { Authorization: `Bearer ${token}` }
});
const sheet = await sheetResponse.json();
if (!sheetResponse.ok) throw new Error(sheet.error?.message || "Could not read guest list.");
const [headers, ...guestRows] = sheet.values || [];
if (!headers || !guestRows.length) throw new Error("Guest List has no sample rows.");

const groupIndex = headers.indexOf("Group");
const firstNameIndex = headers.indexOf("First Name");
const lastNameIndex = headers.indexOf("Last Name");
const groupCounts = guestRows.reduce((counts, row) => {
  const group = row[groupIndex] || "";
  counts.set(group, (counts.get(group) || 0) + 1);
  return counts;
}, new Map());

for (const row of guestRows) {
  const query = `${row[firstNameIndex] || ""} ${row[lastNameIndex] || ""}`.trim();
  let statusCode = 200;
  let result;
  await handler(
    { method: "POST", body: { action: "lookup", password: env.RSVP_PASSWORD, guestName: query } },
    {
      status(code) { statusCode = code; return this; },
      json(payload) { result = payload; }
    }
  );

  if (statusCode !== 200) throw new Error(result?.error || `Lookup returned ${statusCode}.`);
  if (!result.households?.length) throw new Error("A sample guest did not return a group.");
  const expected = groupCounts.get(row[groupIndex] || "");
  const actual = result.households[0].guests.length;
  if (actual !== expected) throw new Error(`Expected group size ${expected}, received ${actual}.`);
}

console.log(`Live lookup passed for ${guestRows.length} sample guests across ${groupCounts.size} groups.`);

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
  if (!response.ok) throw new Error(payload.error_description || "Could not authorize.");
  return payload.access_token;
}

function readEnv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return Object.fromEntries(raw.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return [];
    const index = trimmed.indexOf("=");
    return index === -1 ? [] : [trimmed.slice(0, index), trimmed.slice(index + 1)];
  }).filter((entry) => entry.length));
}

function base64Url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
