"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import Button from "@/app/components/Button";
import db from "@/utils/database";
import showAlert from "@/app/components/showAlert";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

export default function GenerateReport() {
  const router = useRouter();
  const [reportType, setReportType] = useState({ value: "", label: "" });
  const [date, setDate] = useState("");
  registerLocale("es", es);

  const reportTypeOptions = [
    { value: "1", label: "Reporte de Ventas" },
    { value: "2", label: "Reporte de Compras" },
  ];

  const handleReportTypeChange = (event) => {
    const newReportType = reportTypeOptions.find(
      (reportType) => reportType.value === event.target.value
    );
    setReportType(newReportType);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reportType.value === "") {
      showAlert("error", "Debe seleccionar un tipo de reporte");
      return;
    }
    if (date === "") {
      showAlert("error", "Debe seleccionar una fecha");
      return;
    }
    console.log("reportType", reportType);
    console.log("date", date);
    const fetchReport = async () => {
      try {
        const result = await db.sequelize.query(
          `SELECT * FROM invoices WHERE invoice_date = '${date}'`
        );
        console.log("result", result);
        if (result[0].length === 0) {
          showAlert(
            "warning",
            "No se encontraron facturas para la fecha seleccionada"
          );
          return;
        }
        router.push(
          "/report"
          // {
          // pathname: "/report",
          // query: { reportType: reportType.value, date },
          // }
        );
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }
    };
    fetchReport();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-6xl px-4 py-4 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Generar Reporte
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[90vh] max-h-[800px]">
          <div className="container max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-center text-blue-600">
              Generar Reporte
            </h1>
            <form
              className="space-y-6 border-t border-b border-gray-200 py-6"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <label
                  htmlFor="reportType"
                  className="text-lg font-medium text-gray-600"
                >
                  Tipo de Reporte
                </label>
                <Select
                  id={"reportType"}
                  className="mt-2 p-2 border border-gray-300 rounded-md"
                  value={reportType.value}
                  onChange={handleReportTypeChange}
                  isHandleChange={true}
                >
                  {reportTypeOptions.map((reportType) => {
                    return (
                      <option key={reportType.value} value={reportType.value}>
                        {reportType.label}
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="date"
                  className="text-lg font-medium text-gray-600"
                >
                  Fecha
                </label>
                <DatePicker
                  id="date"
                  selected={date}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  locale="es"
                  className="mt-2 p-2 border text-gray-700 border-gray-300 rounded-md"
                />
              </div>
              <Button type="submit" className="w-full p-3">
                Generar Reporte
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
