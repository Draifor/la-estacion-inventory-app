"use client";
import useHandleContext from "@/hooks/useHadleContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
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
      <ToastContainer />
      {children}
    </InvoicesContext.Provider>
  );
}
