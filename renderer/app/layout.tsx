import "../styles/globals.css";
import Providers from "./providers/providers";

export const metadata = {
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
      <Providers>
        <body className="min-h-screen">
          <main className="min-h-full">{children}</main>
        </body>
      </Providers>
    </html>
  );
}
