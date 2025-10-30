// app/layout.jsx
import { RouteLayout } from "../components/layouts/RouteLayout";
import Providers from "../redux/provider";
import { Toaster } from "sonner";
import './globals.css';
import ServiceWorkerRegister from "./sw-register";

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
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }, // ← This is for macOS
    ]
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ServiceWorkerRegister />
        <Toaster richColors position="top-center" />
        <Providers>
          <RouteLayout>{children}</RouteLayout>
        </Providers>
      </body>
    </html>
  );
}