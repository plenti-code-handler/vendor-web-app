import { Inter } from "next/font/google";

import "../globals.css";
import Providers from "../../redux/provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Foodie Finder",
  description: "Fresh, Delicious Meals, Ready to Go",
};

export default function AuthLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        {/* Google Translate Element for background translation */}
        <div id="google_translate_element" style={{ display: "none" }}></div>

        <Providers>{children}</Providers>
        {/* Load Google Translate script asynchronously */}
        <Script
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />

        {/* Initialize Google Translate after script is loaded */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
         
          autoDisplay: false
        }, 'google_translate_element');
      }
    `,
          }}
        />
      </body>
    </html>
  );
}
