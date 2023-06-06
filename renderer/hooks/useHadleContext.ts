"use client"
import { useState, createContext } from "react";

type invoicesContextType = {
  user: { username: string; role: string };
  setUser: (user: { username: string; role: string }) => void;
  invoices: any[];
  setInvoices: (invoices: any[]) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
};

export const InvoicesContext = createContext<invoicesContextType>({
  user: { username: "", role: "" },
  setUser: () => {},
  invoices: [],
  setInvoices: () => {},
  startDate: new Date(),
  setStartDate: () => {},
  endDate: new Date(),
  setEndDate: () => {},
});

export default function useHandleContext () {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  return {
    InvoicesContext,
    user,
    setUser,
    invoices,
    setInvoices,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};
