// app/(home)/layout.jsx
import { Inter } from "next/font/google";
import "../globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Plenti",
  description: "Fresh, Delicious Meals, Ready to Go",
};

export default function HomeLayout({ children }) {
  return (
    <div className={inter.className}>
      {/* Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
      
      {children}
      
      {/* Google Translate Scripts */}
      <Script
        strategy="afterInteractive"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      />
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
    </div>
  );
}