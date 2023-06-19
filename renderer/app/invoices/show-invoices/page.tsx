"use client";
import React, { useEffect, useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import Head from "next/head";
import db from "@/utils/database";
import Menu from "@/app/components/Menu";
import { ipcRenderer } from "electron";
import Button from "@/app/components/Button";
import EditIcon from "@/app/components/icons/EditIcon";
import DeleteIcon from "@/app/components/icons/DeleteIcon";

export default function ShowInvoices() {
  const { invoices, setInvoices } = useContext(InvoicesContext);

  useEffect(() => {
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
    { key: "due_date", label: "Fecha Vencimiento" },
    { key: "payment_status", label: "Estado" },
    { key: "total_amount", label: "Valor Total" },
    { key: "amount_paid", label: "Valor Pagado" },
    { key: "remaining_amount", label: "Valor Pendiente" },
    { key: "actions", label: "Acciones" },
  ];

  const handleEditInvoice = (invoice_id: number) => {
    ipcRenderer.send("open-modal", {
      name: "edit-invoice",
      url: `invoices/edit-invoice?id=${invoice_id}`,
    });
  };

  const handleDeleteInvoice = (invoice_id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta factura?")) {
      db.Invoice.destroy({ where: { invoice_id } });
      const updateInvoices = invoices.filter(
        (invoice) => invoice.invoice_id !== invoice_id
      );
      setInvoices(updateInvoices);
    }
  };

  return (
    <>
      <table className="w-full mt-2 text-gray-900 border border-gray-200 shadow-lg">
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
            <tr key={invoice.invoice_id} className="bg-white even:bg-gray-100">
              <td className="px-2 py-1 text-left border-b border-gray-200">
                {invoice.Supplier.supplier_name}
              </td>
              <td className="px-2 py-1 text-left border-b border-gray-200">
                {invoice.description}
              </td>
              <td className="px-2 py-1 border-b border-gray-200 text-center">
                {invoice.invoice_date}
              </td>
              <td className="px-2 py-1 border-b border-gray-200 text-center">
                {invoice.due_date}
              </td>
              <td className="px-2 py-1 border-b border-gray-200 text-center">
                {invoice.payment_status}
              </td>
              <td className="px-2 py-1 border-b border-gray-200 text-center">
                ${formatNumber(invoice.total_amount)}
              </td>
              <td className="px-2 py-1 border-b border-gray-200 text-center">
                ${formatNumber(invoice.paid_amount)}
              </td>
              <td className="px-2 py-1 border-b border-gray-200 text-center">
                ${formatNumber(invoice.remaining_amount)}
              </td>
              <td className="flex justify-around px-2 py-1 border-b border-gray-200">
                <Button
                  type="button"
                  className="text-blue-600 font-bold rounded"
                  baseStyle="none"
                  onClick={() => handleEditInvoice(invoice.invoice_id)}
                >
                  <EditIcon />
                </Button>
                <Button
                  type="button"
                  className="text-red-600 font-bold rounded"
                  baseStyle="none"
                  onClick={() => handleDeleteInvoice(invoice.invoice_id)}
                >
                  <DeleteIcon />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200">
            <th
              colSpan={3}
              className="px-2 py-1 text-right border-b border-gray-200"
            >
              Cantidad de Facturas:
              <span className="font-normal ml-4">{invoices.length}</span>
            </th>
            <th
              colSpan={2}
              className="px-2 py-1 text-right border-b border-gray-200"
            >
              Total
            </th>
            <td className="px-2 py-1 border-b border-gray-200 text-center">
              $
              {formatNumber(
                invoices.reduce(
                  (total, invoice) => total + invoice.total_amount,
                  0
                )
              )}
            </td>
            <td className="px-2 py-1 border-b border-gray-200 text-center">
              $
              {formatNumber(
                invoices.reduce(
                  (total, invoice) => total + invoice.paid_amount,
                  0
                )
              )}
            </td>
            <td className="px-2 py-1 border-b border-gray-200 text-center">
              $
              {formatNumber(
                invoices.reduce(
                  (total, invoice) => total + invoice.remaining_amount,
                  0
                )
              )}
            </td>
            <th colSpan={1} className="px-2 py-1 border-b border-gray-200" />
          </tr>
        </tfoot>
      </table>
    </>
  );
}
