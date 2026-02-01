import fs from "fs";
import path from "path";

export const SUPPORTED_LANGS = ["en", "fr", "es", "de"];
export const DEFAULT_LANG = "en";

const cache = new Map();
let translationsCache = null;

const getReplacements = (lang) => [
  ["index.html#", `/${lang}#`],
  ["index.html", `/${lang}`],
  ["contact.html", `/${lang}/contact`],
  ["privacy.html", `/${lang}/privacy`],
  ["delete-account.html", `/${lang}/delete-account`],
  ['href="/#', `href="/${lang}#`],
  ['href="/"', `href="/${lang}"`],
];

function extractBody(html, fileName) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) {
    throw new Error(`Missing <body> in ${fileName}`);
  }
  return match[1];
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

function loadTranslations() {
  if (translationsCache) {
    return translationsCache;
  }
  const filePath = path.join(process.cwd(), "public/i18n/translations.js");
  const raw = fs.readFileSync(filePath, "utf8");
  const module = { exports: {} };
  const getTranslations = new Function(
    "module",
    "exports",
    `${raw}; return (typeof translations !== "undefined" && translations) || module.exports || {};`
  );
  translationsCache = getTranslations(module, module.exports) || {};
  return translationsCache;
}

function getTranslationBundle(lang) {
  const translations = loadTranslations();
  if (!translations) {
    return null;
  }
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  return (
    (translations[safeLang] && translations[safeLang].translation) ||
    (translations[DEFAULT_LANG] && translations[DEFAULT_LANG].translation) ||
    null
  );
}

export function getTranslations(lang) {
  return getTranslationBundle(lang) || {};
}

function applyTranslations(html, lang) {
  const bundle = getTranslationBundle(lang);
  if (!bundle) {
    return html;
  }

  let output = html.replace(
    /<([a-zA-Z0-9:-]+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag, before, key, after) => {
      const translation = bundle[key];
      if (!translation) {
        return match;
      }
      return `<${tag}${before} data-i18n="${key}"${after}>${translation}</${tag}>`;
    }
  );

  output = output.replace(
    /<([a-zA-Z0-9:-]+)([^>]*?)\sdata-i18n-placeholder="([^"]+)"([^>]*)>/g,
    (match, tag, before, key, after) => {
      const translation = bundle[key];
      if (!translation) {
        return match;
      }
      const placeholderRegex = /\splaceholder="[^"]*"/;
      if (placeholderRegex.test(match)) {
        return match.replace(placeholderRegex, ` placeholder="${translation}"`);
      }
      return `<${tag}${before} data-i18n-placeholder="${key}"${after} placeholder="${translation}">`;
    }
  );

  output = output.replace(
    /<([a-zA-Z0-9:-]+)([^>]*?)\sdata-i18n-title="([^"]+)"([^>]*)>/g,
    (match, tag, before, key, after) => {
      const translation = bundle[key];
      if (!translation) {
        return match;
      }
      const titleRegex = /\stitle="[^"]*"/;
      if (titleRegex.test(match)) {
        return match.replace(titleRegex, ` title="${translation}"`);
      }
      return `<${tag}${before} data-i18n-title="${key}"${after} title="${translation}">`;
    }
  );

  output = output.replace(
    /<([a-zA-Z0-9:-]+)([^>]*?)\sdata-i18n-aria="([^"]+)"([^>]*)>/g,
    (match, tag, before, key, after) => {
      const translation = bundle[key];
      if (!translation) {
        return match;
      }
      const ariaRegex = /\saria-label="[^"]*"/;
      if (ariaRegex.test(match)) {
        return match.replace(ariaRegex, ` aria-label="${translation}"`);
      }
      return `<${tag}${before} data-i18n-aria="${key}"${after} aria-label="${translation}">`;
    }
  );

  return output;
}

export function getPageBody(fileName, lang = DEFAULT_LANG) {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const cacheKey = `${fileName}:${safeLang}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const filePath = path.join(process.cwd(), fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  let body = extractBody(raw, fileName);
  body = stripScripts(body);

  getReplacements(safeLang).forEach(([from, to]) => {
    body = body.split(from).join(to);
  });

  body = applyTranslations(body, safeLang);
  body = body.trim();
  cache.set(cacheKey, body);
  return body;
}
