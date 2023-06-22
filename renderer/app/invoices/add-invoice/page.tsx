"use client";
import { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { ipcRenderer } from "electron";

import { InvoicesContext } from "@/hooks/useHadleContext";
import db from "@/utils/database";
import Input from "@/components/Input";
import Select from "@/components/Select";
import showAlert from "@/components/showAlert";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";

const TOTAL_PAYMENT = "Pago total";
const PARTIAL_PAYMENT = "Pago parcial";

const defaultSupplier = db.Supplier.build({
  supplier_id: 0,
  supplier_name: "Selecciona un proveedor",
});
const totalPayment = { type_id: 1, type_name: TOTAL_PAYMENT };
const partialPayment = { type_id: 2, type_name: PARTIAL_PAYMENT };

const paymentTypes = [totalPayment, partialPayment];

export default function AddInvoice() {
  registerLocale("es", es);
  const { suppliers, setSuppliers } = useContext(InvoicesContext);
  const [selectedSupplier, setSelectedSupplier] = useState(defaultSupplier);
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState(totalPayment);
  const [isTotalPayment, setIsTotalPayment] = useState(true);
  const [totalAmount, setTotalAmount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [remainingAmount, setRemainingAmount] = useState("");

  useEffect(() => {
    console.log("useEffect --> Holi");
    async function fetchSuppliers() {
      try {
        await db.sequelize.authenticate();
        console.log("Connection has been established successfully.");
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }

      try {
        const result = await db.Supplier.findAll();
        result.unshift(defaultSupplier);
        setSuppliers(result);
        console.log(result);
        setSelectedSupplier(result[0]);
      } catch (error) {
        console.error("Unable to fetch suppliers:", error);
      }
    }

    fetchSuppliers();
  }, []);

  useEffect(() => {
    // Calculate the remaining amount based on the total and paid amounts
    const total = Number(totalAmount.replace(/\D/g, ""));
    const paid = Number(paidAmount.replace(/\D/g, ""));
    const remaining = total - paid;
    if (total > 0 && remaining < 0) {
      showAlert("warning", "El monto pagado no puede ser mayor al total");
      return;
    }
    setRemainingAmount(remaining.toLocaleString("es-ES"));
  }, [totalAmount, paidAmount]);

  const validateAmount = (value) => {
    value = value.replace(/\D/g, "");
    value = Number(value).toLocaleString("es-ES");
    return value;
  };

  const handlePaidAmountChange = (event) => {
    let value = event.target.value;
    value = validateAmount(value);
    setPaidAmount(value);
  };

  const handlePaymentTypeChange = (event) => {
    const newSelectedPaymentType = paymentTypes.find(
      (paymentType) => paymentType.type_name === event.target.value
    );
    setSelectedPaymentType(newSelectedPaymentType);
    const isTotal = newSelectedPaymentType.type_id === 1 ? true : false;
    setIsTotalPayment(isTotal);
    if (isTotal) {
      setPaidAmount(totalAmount);
    }
  };

  const handleTotalAmountChange = (event) => {
    let value = event.target.value;
    value = validateAmount(value);
    setTotalAmount(value);
    if (isTotalPayment) {
      setPaidAmount(value);
    }
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleSupplierChange = (event) => {
    const newSelectedSupplier = suppliers.find(
      (supplier) => supplier.supplier_name === event.target.value
    );
    setSelectedSupplier(newSelectedSupplier);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (selectedSupplier.supplier_id === 0) {
      showAlert("warning", "Selecciona un proveedor");
      return;
    }

    if (description === "") {
      showAlert("warning", "Ingresa una descripción");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 1);

    if (dueDate < today) {
      showAlert("warning", "La fecha de vencimiento no puede ser menor a hoy");
      return;
    }

    const totalAmountNumeric = Number(totalAmount.replace(/\D/g, ""));
    const paidAmountNumeric = Number(paidAmount.replace(/\D/g, ""));
    const remainingAmountNumeric = totalAmountNumeric - paidAmountNumeric;

    // Usé un operador ternario para determinar el estado del pago
    let payment_status = remainingAmountNumeric === 0 ? "Pagada" : "Crédito";

    if (remainingAmountNumeric < 0) {
      showAlert("warning", "El monto pagado no puede ser mayor al total");
      return;
    }

    if (totalAmountNumeric === 0) {
      showAlert("warning", "El monto total no puede ser cero");
      return;
    }

    try {
      await db.Invoice.create({
        supplier_id: selectedSupplier.supplier_id,
        description: description,
        invoice_date: new Date(),
        due_date: dueDate,
        total_amount: totalAmountNumeric,
        paid_amount: paidAmountNumeric,
        payment_status: payment_status,
        remaining_amount: remainingAmountNumeric,
      });
      showAlert("success", "Factura agregada correctamente!");
      resetForm();

      setTimeout(() => {
        ipcRenderer.send("close-modal", { reload: true });
      }, 1000);
    } catch (error) {
      showAlert("error", "No se pudo agregar la factura");
      console.error("Unable to add invoice:", error);
      return;
    }
  }

  const supplierOptions = suppliers.map((supplier) => (
    <option
      key={supplier.supplier_id}
      value={supplier.supplier_name}
      disabled={supplier.supplier_id === 0}
    >
      {supplier.supplier_name}
    </option>
  ));

  const paymentTypeOptions = paymentTypes.map((paymentType) => (
    <option
      key={paymentType.type_id}
      value={paymentType.type_name}
      disabled={paymentType.type_id === 0}
    >
      {paymentType.type_name}
    </option>
  ));

  const resetForm = () => {
    setSelectedSupplier(defaultSupplier);
    setDescription("");
    setTotalAmount("0");
    setPaidAmount("0");
    setSelectedPaymentType(totalPayment);
    setIsTotalPayment(true);
  };

  return (
    <form
      className="space-y-6 border-t border-b border-gray-200 py-6"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row md:space-x-8">
        <label
          htmlFor="supplier"
          className="text-lg font-medium text-gray-600 md:w-2/5"
        >
          Proveedor
        </label>
        <Select
          id="supplier"
          className="mt-1 p-2 border border-gray-300 rounded-md"
          value={selectedSupplier.supplier_name}
          onChange={handleSupplierChange}
          isHandleChange={true}
        >
          {supplierOptions}
        </Select>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <label
          htmlFor="paymentType"
          className="text-lg font-medium text-gray-600 md:w-1/2"
        >
          Tipo de Pago
        </label>
        <Select
          id="paymentType"
          className="mt-1 p-2 border border-gray-300 rounded-md"
          value={selectedPaymentType.type_name}
          onChange={handlePaymentTypeChange}
          isHandleChange={true}
        >
          {paymentTypeOptions}
        </Select>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <label
          htmlFor="dueDate"
          className="text-lg font-medium text-gray-600 md:w-3/5"
        >
          Fecha Vencimiento
        </label>
        <DatePicker
          id="dueDate"
          selected={dueDate}
          onChange={handleDueDateChange}
          dateFormat="dd/MM/yyyy"
          locale="es"
          className="appearance-none text-gray-700 border border-gray-200 rounded py-1 text-center px-4 ml-6 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="text-lg font-medium text-gray-600"
        >
          Descripción
        </label>
        <Textarea
          id="description"
          className="mt-1 p-2 border border-gray-300 rounded-md"
          value={description}
          onChange={handleDescriptionChange}
          isHandleChange={true}
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <label
          htmlFor="totalAmount"
          className="text-lg font-medium text-gray-600 md:w-1/2"
        >
          Valor Factura
        </label>
        <Input
          type="text"
          id="totalAmount"
          className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
          value={"$ " + totalAmount}
          onChange={handleTotalAmountChange}
          isHandleChange={true}
          required
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <label
          htmlFor="paidAmount"
          className="text-lg font-medium text-gray-600 md:w-1/2"
        >
          Valor a Pagar
        </label>
        <Input
          type="text"
          id="paidAmount"
          className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
          value={"$ " + paidAmount}
          onChange={handlePaidAmountChange}
          isHandleChange={true}
          required
          disabled={isTotalPayment}
        />
      </div>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <label
          htmlFor="remainingAmount"
          className="text-lg font-medium text-gray-600 md:w-1/2"
        >
          Valor Restante
        </label>
        <Input
          type="text"
          id="remainingAmount"
          className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
          value={"$ " + remainingAmount}
          disabled
        />
      </div>
      <Button
        type="submit"
        className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
      >
        Agregar Factura
      </Button>
      <Button
        className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
        onClick={() => {
          ipcRenderer.send("close-modal");
        }}
      >
        Cancelar
      </Button>
    </form>
  );
}
