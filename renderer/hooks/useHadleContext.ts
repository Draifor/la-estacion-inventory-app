"use client"
import { useState, createContext } from "react";

type invoice = {
  invoice_id: number;
  supplier_id: number;
  invoice_date: Date | any;
  due_date?: Date | any;
  description?: string;
  total_amount?: number;
  paid_amount?: number;
  payment_status?: string;
  remaining_amount?: number;
  Supplier?: {
    supplier_id?: number;
    supplier_name?: string;
  }
};

type invoicesContextType = {
  suppliers: any [];
  setSuppliers: ([]) => void;
  invoices: invoice[];
  setInvoices: (invoices: invoice[]) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
};

export const InvoicesContext = createContext<invoicesContextType>({
  suppliers: [],
  setSuppliers: () => {},
  invoices: [],
  setInvoices: () => {},
  startDate: new Date(),
  setStartDate: () => {},
  endDate: new Date(),
  setEndDate: () => {},
});

export default function useHandleContext () {
  const [user, setUser] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState<invoice[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return {
    InvoicesContext,
    user,
    setUser,
    suppliers,
    setSuppliers,
    invoices,
    setInvoices,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};
