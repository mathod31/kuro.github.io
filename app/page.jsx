import { getPageBody } from "./lib/html";

export const metadata = {
  title: "Kuro - Your Digital Butler | Votre Majordome Numérique",
  description:
    "Kuro organizes your daily life by centralizing your documents, objects, and warranties. Never miss an important deadline again.",
};

const body = getPageBody("index.html");

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}
