// app/layout.jsx
import { RouteLayout } from "../components/layouts/RouteLayout";
import Providers from "../redux/provider";
import { Toaster } from "sonner";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-center" />
        <Providers>
          <RouteLayout>{children}</RouteLayout>
        </Providers>
      </body>
    </html>
  );
}