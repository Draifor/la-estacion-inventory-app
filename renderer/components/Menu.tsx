"use client";
import { useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import db from "@/utils/database";
import { Op } from "sequelize";
import Button from "@/components/Button";
import showAlert from "@/components/showAlert";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

export default function Menu() {
  const { setInvoices, startDate, setStartDate, endDate, setEndDate } =
    useContext(InvoicesContext);
  registerLocale("es", es);

  const handleStartDateChange = (date) => {
    date.setHours(0, 0, 0, 1);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    date.setHours(23, 59, 59, 999);
    setEndDate(date);
  };

  const handleClear = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleSearch = () => {
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    if (!startDate || !endDate) {
      showAlert(
        "warning",
        "Debe seleccionar una fecha inicial y una fecha final"
      );
      return;
    }
    if (startDate > new Date()) {
      console.log("startDate", startDate);
      console.log("new Date()", new Date());
      showAlert(
        "warning",
        "La fecha inicial no puede ser mayor a la fecha actual"
      );
      return;
    }
    if (startDate > endDate) {
      console.log("startDate", startDate);
      console.log("endDate", endDate);
      showAlert(
        "warning",
        "La fecha inicial no puede ser mayor a la fecha final"
      );
      return;
    }

    const fetchInvoices = async () => {
      const result = await db.Invoice.findAll({
        include: [db.Supplier],
        where: {
          invoice_date: {
            // [Op.gte]: startDate,
            // [Op.lte]: endDate,
            [Op.between]: [startDate, endDate],
          },
        },
      });
      setInvoices(result);
    };
    fetchInvoices();
    handleClear();
  };

  return (
    <div className="container mx-auto px-4 text-center max-w-6xl">
      {/* <h1 className="text-2xl font-bold mb-4">Buscar Facturas por Fecha</h1> */}
      <div className="flex flex-wrap items-end justify-center gap-2 -mx-3 m-6">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-start-date"
          >
            Fecha Inicial
          </label>
          <DatePicker
            id="grid-start-date"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="dd/MM/yyyy"
            locale="es"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-end-date"
          >
            Fecha Final
          </label>
          <DatePicker
            id="grid-end-date"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="dd/MM/yyyy"
            locale="es"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div className="flex justify-center w-36 h-10">
          <Button
            type="button"
            className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}
