import { useContext } from "react";
import { InvoicesContext } from "../../hooks/useHadleContext";
import db from "../../utils/database";
import { Op } from "sequelize";
import Button from "./Button";
import showAlert from "./showAlert";
import DatePicker from "react-datepicker";

export default function Menu() {
  // Menu to show invoices that especific date and reports
  const { setInvoices, startDate, setStartDate, endDate, setEndDate } =
    useContext(InvoicesContext);

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 1);
    setStartDate(date);
  };
  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    date.setDate(date.getDate() + 1);
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
            [Op.gte]: startDate,
            [Op.lte]: endDate,
            // [Op.between]: [startDate, endDate],
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
      <h1 className="text-2xl font-bold mb-4">Buscar Facturas por Fecha</h1>
      <div className="flex flex-wrap items-end justify-center gap-2 -mx-3 mb-6">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-start-date"
          >
            Fecha Inicial
          </label>
          <input
            id="grid-start-date"
            type="date"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={startDate.toISOString().substring(0, 10)}
            onChange={handleStartDateChange}
          />
          {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} /> */}
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="grid-end-date"
          >
            Fecha Final
          </label>
          <input
            id="grid-end-date"
            type="date"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={endDate.toISOString().substring(0, 10)}
            onChange={handleEndDateChange}
          />
        </div>
        <div className="flex justify-center w-36 h-10 md:w-1/5 px3">
          <Button onClick={handleSearch}>Buscar Facturas</Button>
        </div>
      </div>
    </div>
  );
}
