#!/usr/bin/env node
// Alimente un projet Supabase avec le contenu institutionnel vérifié.
//
//   node scripts/seed-supabase.mjs
//
// Variables lues dans .env.local (ou l’environnement) :
//   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Les identifiants sont dérivés de manière déterministe (UUID v5) : relancer le
// script met à jour les fiches existantes au lieu de les dupliquer.

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const TABLES = {
  projects: "projects",
  articles: "news_articles",
  areas: "intervention_areas",
  publications: "publications",
  partners: "partners",
  indicators: "impact_indicators",
  reportingPeriods: "reporting_periods",
  milestones: "milestones",
  testimonials: "testimonials",
  events: "events",
  pages: "pages",
  media: "media_assets",
};

function loadEnv() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

function uuid5(name) {
  const hash = createHash("sha1")
    .update(Buffer.from("6ba7b810-9dad-11d1-80b4-00c04fd430c8", "hex"))
    .update(name)
    .digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.subarray(0, 16).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const snake = (key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

function toRow(value) {
  if (Array.isArray(value)) return value.map(toRow);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [snake(key), toRow(entry)]));
  }
  return value;
}

const DATE_FIELDS = new Set([
  "published_at",
  "starts_on",
  "ends_on",
  "deleted_at",
]);

function normalizeDates(row) {
  for (const [key, value] of Object.entries(row)) {
    if (DATE_FIELDS.has(key) && value === "") row[key] = null;
  }
  return row;
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");
    process.exit(1);
  }

  const seed = JSON.parse(readFileSync("supabase/seed.json", "utf8"));
  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Les paramètres sont stockés tels quels (camelCase) dans data jsonb.
  const settings = { ...seed.settings, updatedAt: new Date().toISOString() };
  const { error: settingsError } = await client
    .from("site_settings")
    .upsert({ id: 1, data: settings, updated_at: settings.updatedAt });
  if (settingsError) throw new Error(`Paramètres : ${settingsError.message}`);
  console.log("Paramètres du site : OK");

  for (const [collection, table] of Object.entries(TABLES)) {
    const items = seed.collections[collection] ?? [];
    const rows = items.map((item) => {
      const row = normalizeDates(toRow(item));
      row.id = uuid5(`${collection}:${item.id}`);
      if (collection !== "media") row.updated_at = new Date().toISOString();
      return row;
    });
    if (!rows.length) {
      console.log(`${table} : aucun élément`);
      continue;
    }
    const { error } = await client.from(table).upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`${table} : ${error.message}`);
    console.log(`${table} : ${rows.length} élément(s)`);
  }

  console.log("\nTerminé. Vérifiez les contenus dans l’administration avant publication.");
}

main().catch((error) => {
  console.error("\nÉchec :", error.message);
  process.exit(1);
});
