// app/layout.jsx
import { RouteLayout } from "../components/layouts/RouteLayout";
import Providers from "../redux/provider";
import { Toaster } from "sonner";
import './globals.css';
import ServiceWorkerRegister from "./sw-register";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Plenti Vendor Dashboard',
  description: 'Manage your food surplus orders',
  manifest: '/manifest.json',
  themeColor: '#5f22d9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Plenti Vendor',
  },
  icons: {
    icon: [
      // Favicons (browser tabs)
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      // iOS home screen icons
      { url: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-167.png', sizes: '167x167', type: 'image/png' },
      { url: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
    ],
    other: [
      // Windows/macOS icons
      { url: '/icons/icon-150.png', sizes: '150x150', type: 'image/png' },
      { url: '/icons/icon-310.png', sizes: '310x310', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ]
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={poppins.className}>
        <ServiceWorkerRegister />
        <Toaster richColors position="top-right" visibleToasts={2}/>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <Providers>
            <RouteLayout>{children}</RouteLayout>
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}