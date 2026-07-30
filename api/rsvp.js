import crypto from "node:crypto";
import fs from "node:fs";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;

    if (!process.env.GOOGLE_SHEET_ID || (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON && !process.env.GOOGLE_SERVICE_ACCOUNT_FILE)) {
      return response.status(503).json({ preview: true, error: "Google Sheets is not configured yet." });
    }

    const token = await getAccessToken();
    const guestSheet = process.env.GUEST_SHEET_NAME || "Guests";
    const rsvpSheet = process.env.RSVP_SHEET_NAME || "Sheet1";

    if (body.action === "lookup") {
      let rows = [];
      try {
        rows = await readRows(token, `${quoteSheet(guestSheet)}!A:Z`);
      } catch (error) {
        if (!String(error.message).includes("Unable to parse range")) throw error;
        return response.status(200).json({ households: [], guestListMissing: true });
      }
      const query = normalize(body.guestName || body.familyName);
      const matchedRows = rows.filter((row) => guestMatches(row, query));
      const matchedGroups = new Set(matchedRows.map(groupName).filter(Boolean));
      const groupRows = rows.filter((row) => matchedGroups.has(groupName(row)));
      return response.status(200).json({ households: groupHouseholds(groupRows) });
    }

    if (body.action === "submit") {
      const submissions = Array.isArray(body.responses) ? body.responses : [];
      if (!submissions.length) return response.status(400).json({ error: "No guest responses were provided." });

      const values = submissions.map((entry) => [
        new Date().toISOString(),
        clean(entry.household),
        clean(entry.guestName),
        clean(entry.attending),
        clean(entry.welcomeDrinks),
        clean(entry.wedding),
        clean(entry.brunch),
        clean(entry.meal),
        clean(entry.dietary),
        clean(entry.songRequest),
        clean(body.email)
      ]);

      await appendRows(token, `${quoteSheet(rsvpSheet)}!A:K`, values);
      return response.status(200).json({ ok: true });
    }

    return response.status(400).json({ error: "Unknown RSVP action." });
  } catch (error) {
    return response.status(500).json({ error: error.message || "Unable to process RSVP." });
  }
}

async function getAccessToken() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    : JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  }));
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(credentials.private_key);
  const assertion = `${unsigned}.${base64Url(signature)}`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const payload = await tokenResponse.json();
  if (!tokenResponse.ok) throw new Error(payload.error_description || "Could not authorize Google Sheets.");
  return payload.access_token;
}

async function readRows(token, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(range)}`;
  const sheetResponse = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const payload = await sheetResponse.json();
  if (!sheetResponse.ok) throw new Error(payload.error?.message || "Could not read guest list.");
  const [headers = [], ...rows] = payload.values || [];
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [slug(header), row[index] || ""])));
}

async function appendRows(token, range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const sheetResponse = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ values })
  });
  const payload = await sheetResponse.json();
  if (!sheetResponse.ok) throw new Error(payload.error?.message || "Could not save RSVP.");
}

function groupHouseholds(rows) {
  const groups = new Map();
  rows.forEach((row) => {
    const household = row.group || row.household || row.family_name || row.family || "Your group";
    if (!groups.has(household)) groups.set(household, []);
    groups.get(household).push({
      name: row.name || row.guest_name || `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      welcomeDrinks: yes(row.welcome_drinks_invited),
      wedding: row.wedding_invited == null || row.wedding_invited === "" ? true : yes(row.wedding_invited),
      brunch: yes(row.brunch_invited),
      child: yes(row.child),
      mealType: row.meal_type || ""
    });
  });
  return [...groups].map(([household, guests]) => ({ household, guests }));
}

function guestMatches(row, query) {
  if (!query) return false;
  const full = normalize(`${row.first_name || ""} ${row.last_name || ""}`);
  const listedName = normalize(row.guest_name || row.name);
  return [full, listedName].some((value) => value && value === query);
}

function groupName(row) {
  return normalize(row.group || row.household || row.family_name || row.family);
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function yes(value) {
  return ["yes", "y", "true", "1", "invited"].includes(String(value || "").trim().toLowerCase());
}

function slug(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function clean(value) {
  return String(value ?? "").slice(0, 500);
}

function quoteSheet(name) {
  return `'${String(name).replace(/'/g, "''")}'`;
}

function base64Url(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
