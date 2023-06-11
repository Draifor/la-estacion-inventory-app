"use client";
import React, { useContext } from "react";
import { InvoicesContext } from "../../hooks/useHadleContext";
import Head from "next/head";
import { useState, useEffect } from "react";
import db from "../../utils/database";
import Menu from "../components/Menu";

export default function Next() {
  const {invoices, setInvoices} = useContext(InvoicesContext);

  useEffect(() => {
    // Query the database for the daily invoices
    console.log("useEffect --> Holi");
    async function fetchInvoices() {
      const result = await db.Invoice.findAll({
        include: [db.Supplier],
        where: { invoice_date: new Date() },
      });
      setInvoices(result);
    }
    fetchInvoices();
  }, []);

  const formatNumber = (value: number) => {
    return value.toLocaleString("es-ES", {
      maximumFractionDigits: 0,
    });
  };

  const headerTable = [
    { key: "supplier_name", label: "Proveedor", className: "text-left" },
    { key: "description", label: "Descripción", className: "text-left" },
    { key: "invoice_date", label: "Fecha Factura" },
    { key: "total_amount", label: "Valor Total" },
    { key: "amount_paid", label: "Valor Pagado" },
    { key: "payment_status", label: "Estado" },
    { key: "remaining_amount", label: "Valor Pendiente" },
  ];
  console.log("invoices", invoices)

  return (
    <React.Fragment>
      <Head>
        <title>Facturas Diarias</title>
      </Head>
      <Menu />
      {/* TODO Menu to show invoices that especific date and reports */}
      {/* <div className="container mx-auto px-4 text-center max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Facturas Diarias</h1> */}
        <table className="table-auto w-full text-gray-900">
          <thead>
            <tr>
              {headerTable.map((column) => (
                <th
                  key={column.key}
                  className={`${
                    column.className ? column.className : ""
                  } px-4 py-2 bg-gray-200 border-b border-gray-200`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoice_id}>
                <td className="px-2 py-1 text-left bg-white border-b border-gray-200">
                  {invoice.Supplier.supplier_name}
                </td>
                <td className="px-2 py-1 text-left bg-white border-b border-gray-200">
                  {invoice.description}
                </td>
                <td className="px-2 py-1 bg-white border-b border-gray-200">
                  {invoice.invoice_date}
                </td>
                <td className="px-2 py-1 bg-white border-b border-gray-200">
                  ${formatNumber(invoice.total_amount)}
                </td>
                <td className="px-2 py-1 bg-white border-b border-gray-200">
                  ${formatNumber(invoice.paid_amount)}
                </td>
                <td className="px-2 py-1 bg-white border-b border-gray-200">
                  {invoice.payment_status}
                </td>
                <td className="px-2 py-1 bg-white border-b border-gray-200">
                  ${formatNumber(invoice.remaining_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      {/* </div> */}
    </React.Fragment>
  );
}
