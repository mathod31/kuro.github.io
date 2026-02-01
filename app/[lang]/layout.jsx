import { SUPPORTED_LANGS } from "../lib/html";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({ children }) {
  return <>{children}</>;
}
