"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "@/app/components/Select";
import Button from "@/app/components/Button";
import db from "@/utils/database";
import { Op } from "sequelize";
import showAlert from "@/app/components/showAlert";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

export default function GenerateReport() {
  const router = useRouter();
  const [reportType, setReportType] = useState({ value: "", label: "" });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  registerLocale("es", es);

  const reportTypeOptions = [
    { value: "0", label: "Seleccionar reporte" },
    { value: "1", label: "Facturas Pagadas" },
    // { value: "2", label: "Reporte de Ventas" },
  ];

  const handleReportTypeChange = (event) => {
    const newReportType = reportTypeOptions.find(
      (reportType) => reportType.value === event.target.value
    );
    setReportType(newReportType);
  };

  const handleStartDateChange = (date) => {
    date.setHours(0, 0, 0, 1);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    date.setHours(23, 59, 59, 999);
    setEndDate(date);
  };

  const validateInputs = () => {
    if (reportType.value === "0") {
      showAlert("error", "Debe seleccionar un tipo de reporte");
      return false;
    }
    if (!startDate || !endDate) {
      showAlert("error", "Debe seleccionar una fecha inicial y una fecha final");
      return false;
    }
    if (startDate > new Date()) {
      showAlert("error", "La fecha inicial no puede ser mayor a la fecha actual");
      return false;
    }
    if (startDate > endDate) {
      showAlert("error", "La fecha inicial no puede ser mayor a la fecha final");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Usé la función que definí antes para validar los inputs
    if (!validateInputs()) {
      return;
    }
    
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log(startDate.toISOString().slice(0, 10));
    const fetchReport = async () => {
      try {
        const result = await db.Invoice.findAll({
          where: {
            invoice_date: {
              [Op.between]: [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)],
              },
              },
            })
            console.log("result", result);
            if (result.length === 0) {
              showAlert(
                "warning",
                "No se encontraron facturas para la fecha seleccionada"
                );
                return;
              }
              router.push(
                `/report?startDate=${startDate.toISOString().slice(0, 10)}&endDate=${endDate.toISOString().slice(0, 10)}&reportType=${reportType.value}`
                );
              } catch (error) {
                console.error("Unable to connect to the database:", error);
              }
            };
            fetchReport();
          };

 return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="container max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Generar Reporte
        </h1>
        <form
          className="space-y-6 border-t border-b border-gray-200 py-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center md:flex-row md:space-x-8">
            <label
              htmlFor="reportType"
              className="text-lg font-medium text-gray-600 md:w-2/5 md:pl-9"
            >
              Tipo de Reporte
            </label>
            <Select
              id={"reportType"}
              className="p-2 border border-gray-300 rounded-md md:ml-4"
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
          <div className="flex flex-col items-center md:flex-row md:space-x-8">
            <label
              htmlFor="startDate"
              className="text-lg font-medium text-gray-600 md:w-4/5 md:pl-10"
            >
              Fecha Inicial
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="appearance-none text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col items-center md:flex-row md:space-x-8">
            <label
              htmlFor="endDate"
              className="text-lg font-medium text-gray-600 md:w-4/5 md:pl-10"
            >
              Fecha Final
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="appearance-none text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <Button type="submit" className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md">
            Generar Reporte
          </Button>
        </form>
      </div>
    </div>
  );
}
