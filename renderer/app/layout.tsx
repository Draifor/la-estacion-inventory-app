"use client";
import useHandleContext from "../hooks/useHadleContext";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./components/Navigation";

export const metadata = {
  title: "Sistema de Facturación",
  description: "Sistema de Facturación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    InvoicesContext,
    user,
    setUser,
    invoices,
    setInvoices,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useHandleContext();
  return (
    <html lang="en">
      <InvoicesContext.Provider
        value={{
          user,
          setUser,
          invoices,
          setInvoices,
          startDate,
          setStartDate,
          endDate,
          setEndDate,
        }}
      >
        <body className="min-h-screen">
          <ToastContainer />
          <div>
            <Navigation />
          </div>
            <main className="min-h-full">{children}</main>
        </body>
      </InvoicesContext.Provider>
    </html>
  );
}
