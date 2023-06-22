import { Metadata } from "next";
import Providers from "@/providers/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sistema de Facturación",
  description: "Sistema de Facturación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="min-h-full">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
