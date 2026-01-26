import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script src="/i18n/translations.js" strategy="beforeInteractive" />
        <Script src="/i18n/i18n.js" strategy="beforeInteractive" />
        <Script src="/script.js" strategy="beforeInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
