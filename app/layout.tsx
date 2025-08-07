import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import ContextWrapper from "@/lib/context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rented123 | Rent Reporting",
  description: "Report your on-time rent payment",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const loggedInCookie = Boolean(cookieStore.get("myapp-token"));

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextWrapper>
          {loggedInCookie && <Header isSignedIn={loggedInCookie} />}
          {children}
        </ContextWrapper>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
