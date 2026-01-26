import fs from "fs";
import path from "path";

const cache = new Map();
const replacements = [
  ["index.html#", "/#"],
  ["index.html", "/"],
  ["contact.html", "/contact"],
  ["privacy.html", "/privacy"],
  ["delete-account.html", "/delete-account"],
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

export function getPageBody(fileName) {
  if (cache.has(fileName)) {
    return cache.get(fileName);
  }

  const filePath = path.join(process.cwd(), fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  let body = extractBody(raw, fileName);
  body = stripScripts(body);

  replacements.forEach(([from, to]) => {
    body = body.split(from).join(to);
  });

  body = body.trim();
  cache.set(fileName, body);
  return body;
}
