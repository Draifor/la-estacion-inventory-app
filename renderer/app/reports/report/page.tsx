"use client";
import { useState, useEffect } from "react";
import { Op } from "sequelize";
import Link from "next/link";
import db from "@/utils/database";

export default function report({ searchParams }) {
  const { startDate, endDate, reportType } = searchParams;
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
    console.log("reportType: ", reportType);

    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const result = await db.Invoice.findAll({
      include: [db.Supplier],
      where: {
        invoice_date: {
          [Op.between]: [
            new Date(startDate + "T00:00:00-05:00"),
            new Date(endDate + "T00:00:00-05:00"),
          ],
        },
      },
    });
    setInvoices(result);
  };

  return (
    <div className="container">
      <h1>Reporte de Compras</h1>
      <h2>Fecha de inicio: {startDate}</h2>
      <h2>Fecha de fin: {endDate}</h2>
      <h2>Total de compras: {invoices.length}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Proveedor</th>
            <th scope="col">Monto</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            return (
              <tr key={invoice.id}>
                <td>{invoice.invoice_date.toLocaleDateString()}</td>
                <td>{invoice.Supplier.name}</td>
                <td>{invoice.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link href="/">Regresar</Link>
    </div>
  );
}
