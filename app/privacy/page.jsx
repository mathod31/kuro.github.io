import { getPageBody } from "../lib/html";

export const metadata = {
  title: "Politique de confidentialité - Kuro",
  description: "Politique de confidentialité de l'application Kuro.",
};

const body = getPageBody("privacy.html");

export default function PrivacyPage() {
  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}
