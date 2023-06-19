"use client";
import useHandleContext from "../hooks/useHadleContext";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    suppliers,
    setSuppliers,
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
          suppliers,
          setSuppliers,
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
            <main className="min-h-full">{children}</main>
        </body>
      </InvoicesContext.Provider>
    </html>
  );
}
