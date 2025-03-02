import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/context/UserContext";
import { AssetsProvider } from "@/context/AssetsContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinEase - Your Financial Assistant",
  description: "Manage your finances with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <CurrencyProvider>
              <AssetsProvider>
                <Navbar />
                {children}
                <Toaster />
              </AssetsProvider>
            </CurrencyProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
