import { getPageBody } from "../lib/html";

export const metadata = {
  title: "Contact - Kuro",
  description: "Contact the Kuro team for any questions or to join the waitlist.",
};

const body = getPageBody("contact.html");

export default function ContactPage() {
  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}
