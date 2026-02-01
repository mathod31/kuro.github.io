import { notFound } from "next/navigation";
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  getPageBody,
  getTranslations
} from "../../lib/html";

const getMeta = (lang, key) => {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const t = getTranslations(safeLang);
  const fallback = getTranslations(DEFAULT_LANG);
  return t[key] || fallback[key] || "";
};

export function generateMetadata({ params }) {
  const lang = params?.lang || DEFAULT_LANG;
  return {
    title: getMeta(lang, "meta.privacy.title"),
    description: getMeta(lang, "meta.privacy.description")
  };
}

export default function LocalizedPrivacyPage({ params }) {
  const lang = params?.lang || DEFAULT_LANG;
  if (!SUPPORTED_LANGS.includes(lang)) {
    notFound();
  }
  const body = getPageBody("privacy.html", lang);
  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}
