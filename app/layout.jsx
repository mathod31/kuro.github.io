import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="no-js i18n-loading">
      <head>
        <style>{`html.i18n-loading [data-i18n],html.i18n-loading .lang-switch{visibility:hidden;}`}</style>
        <Script id="i18n-class" strategy="beforeInteractive">
          {`(function(){var root=document.documentElement;root.classList.remove('no-js');root.classList.add('js');try{var stored=localStorage.getItem('kuro-lang');var browser=(navigator.language||navigator.userLanguage||'').toLowerCase();var lang=(stored||browser||'').toLowerCase();if(!lang||lang.indexOf('en')===0){root.classList.remove('i18n-loading');}}catch(e){root.classList.remove('i18n-loading');}})();`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://unpkg.com/i18next@23.10.1/dist/umd/i18next.min.js"
          strategy="afterInteractive"
        />
        <Script src="/i18n/translations.js" strategy="afterInteractive" />
        <Script src="/i18n/i18n.js" strategy="afterInteractive" />
        <Script src="/script.js" strategy="afterInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
