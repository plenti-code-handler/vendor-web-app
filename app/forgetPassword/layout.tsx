import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function ForgetPasswordLayout({ children }) {
  return (
    <>
      <Toaster richColors position="top-center" />
      {children}
    </>
  );
}
