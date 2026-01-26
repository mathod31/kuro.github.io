import { getPageBody } from "../lib/html";

export const metadata = {
  title: "Supprimer mon compte - Kuro App",
  description: "Comment supprimer votre compte et vos données de l'application Kuro.",
};

const body = getPageBody("delete-account.html");

export default function DeleteAccountPage() {
  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}
