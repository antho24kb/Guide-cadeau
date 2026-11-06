// Depuis la racine du dépôt : node scripts/validate-steelbooks.mjs
import { readFile } from "node:fs/promises";

const file = new URL("../data/steelbooks.json", import.meta.url);
const entries = JSON.parse(await readFile(file, "utf8"));
const errors = [];
const seenTitles = new Set();
const seenLinks = new Set();
const expectedKeys = ["date", "titre", "lien"];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const pricePattern = /(?:[€$£]\\s?\\d[\\d\\s]*(?:[.,]\\d{1,2})?|\\d[\\d\\s]*(?:[.,]\\d{1,2})?\\s?[€$£]|\\b\\d[\\d\\s]*(?:[.,]\\d{1,2})?\\s?(?:EUR|USD|GBP|euros?|dollars?|livres?)\\b)/i;
const allowedHosts = new Set(["amazon.fr", "www.amazon.fr", "link.amazon", "amzn.to"]);

if (!Array.isArray(entries)) {
  console.error("Erreur : le catalogue doit être un tableau JSON.");
  process.exit(1);
}

function normalizeTitle(title) {
  return title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

for (const [index, entry] of entries.entries()) {
  const row = index + 1;
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    errors.push(`Ligne ${row} : chaque entrée doit être un objet.`);
    continue;
  }

  const keys = Object.keys(entry).sort();
  if (JSON.stringify(keys) !== JSON.stringify([...expectedKeys].sort())) {
    errors.push(`Ligne ${row} : les champs doivent être date, titre et lien uniquement.`);
  }

  if (typeof entry.date !== "string" || !datePattern.test(entry.date)) {
    errors.push(`Ligne ${row} : date invalide, format attendu AAAA-MM-JJ.`);
  } else {
    const parsed = new Date(`${entry.date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== entry.date) {
      errors.push(`Ligne ${row} : la date n'existe pas dans le calendrier.`);
    }
  }

  if (typeof entry.titre !== "string" || !entry.titre.trim()) {
    errors.push(`Ligne ${row} : le titre ne peut pas être vide.`);
  } else {
    const titleKey = `${entry.date}\0${normalizeTitle(entry.titre)}`;
    if (seenTitles.has(titleKey)) errors.push(`Ligne ${row} : doublon de titre et de date (« ${entry.titre} »).`);
    seenTitles.add(titleKey);
  }

  if (typeof entry.lien !== "string" || !entry.lien.trim()) {
    errors.push(`Ligne ${row} : le lien Amazon ne peut pas être vide.`);
  } else {
    try {
      const url = new URL(entry.lien);
      if (url.protocol !== "https:" || !allowedHosts.has(url.hostname.toLowerCase())) {
        errors.push(`Ligne ${row} : le lien doit pointer vers Amazon.`);
      } else if ((url.hostname === "amazon.fr" || url.hostname === "www.amazon.fr") && url.searchParams.get("tag") !== "antho24kb-21") {
        errors.push(`Ligne ${row} : le lien Amazon doit conserver le tag partenaire.`);
      }
      if (seenLinks.has(url.href)) errors.push(`Ligne ${row} : lien dupliqué.`);
      seenLinks.add(url.href);
    } catch {
      errors.push(`Ligne ${row} : URL invalide.`);
    }
  }

  for (const value of Object.values(entry)) {
    if (typeof value === "string" && pricePattern.test(value)) {
      errors.push(`Ligne ${row} : un prix ne doit pas apparaître dans le catalogue.`);
      break;
    }
  }
}

if (errors.length) {
  console.error(`Validation échouée (catalogue : ${entries.length} entrées) :`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Catalogue valide : ${entries.length} steelbooks vérifiés.`);
}
