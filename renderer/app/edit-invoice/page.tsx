"use client";
import { useState, useEffect, useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import db from "@/utils/database";
import showAlert from "@/app/components/showAlert";
import Select from "@/app/components/Select";
import Textarea from "../components/Textarea";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../components/Input";
import Button from "../components/Button";
import { ipcRenderer } from "electron";

const defaultSupplier = db.Supplier.build({
  supplier_id: 0,
  supplier_name: "Selecciona un proveedor",
});

export default function EditInvoice({ searchParams }) {
  const { id } = searchParams;
  registerLocale("es", es);
  const { invoices, setInvoices, suppliers, setSuppliers } =
    useContext(InvoicesContext);
  const [invoice, setInvoice] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(defaultSupplier);
  const [description, setDescription] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [paymentStatus, setPaymentStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [amountPaid, setAmountPaid] = useState("0");
  const [remainingAmount, setRemainingAmount] = useState("0");

  const formatDate = (date) => {
    date.setTime(date.getTime() + 5 * 60 * 60 * 1000);
    return date;
  };

  useEffect(() => {
    fetchInvoice();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    console.log("invoice 2 effect", invoice);
    if (invoice) {
      console.log("suppliers", suppliers);
      if (suppliers) {
        setSelectedSupplier(
          suppliers.find(
            (supplier) => invoice.supplier_id === supplier.supplier_id
          )
        );
      }
      setDescription(invoice.description);
      setInvoiceDate(formatDate(new Date(invoice.invoice_date)));
      setDueDate(formatDate(new Date(invoice.due_date)));
      setPaymentStatus(invoice.payment_status);
      setTotalAmount(validateAmount(invoice.total_amount + ""));
      setAmountPaid(validateAmount(invoice.paid_amount + ""));
      setRemainingAmount(validateAmount(invoice.remaining_amount + ""));
    }
  }, [invoice]);

  const fetchInvoice = async () => {
    try {
      const result = await db.Invoice.findOne({
        where: {
          invoice_id: id,
        },
      });
      setInvoice(result.dataValues);
    } catch (error) {
      showAlert("error", "No se pudo cargar la factura");
    }
  };

  useEffect(() => {
    // Calculate the remaining amount based on the total and paid amounts
    const total = Number(totalAmount.replace(/\D/g, ""));
    const paid = Number(amountPaid.replace(/\D/g, ""));
    const remaining = total - paid;
    if (total > 0 && remaining < 0) {
      showAlert("warning", "El monto pagado no puede ser mayor al total");
      return;
    }

    setPaymentStatus(total === paid ? "Pagada" : "Crédito");
    setRemainingAmount(remaining.toLocaleString("es-ES"));
  }, [totalAmount, amountPaid]);

  const fetchSuppliers = async () => {
    const result = await db.Supplier.findAll();
    setSuppliers(result.map((supplier) => supplier.dataValues));
  };

  const validateAmount = (value) => {
    value = value.replace(/\D/g, "");
    value = Number(value).toLocaleString("es-ES");
    return value;
  };

  const handleSupplierChange = (event) => {
    const newSelectedSupplier = suppliers.find(
      (supplier) => supplier.supplier_name === event.target.value
    );
    setSelectedSupplier(newSelectedSupplier);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleInvoiceDateChange = (date) => {
    date.setHours(0, 0, 0, 1);
    setInvoiceDate(date);
  };

  const handleDueDateChange = (date) => {
    date.setHours(23, 59, 59, 999);
    setDueDate(date);
  };

  const handlePaymentStatusChange = (event) => {
    setPaymentStatus(event.target.value);
  };

  const handleTotalAmountChange = (event) => {
    let value = event.target.value;
    value = validateAmount(value);
    setTotalAmount(value);
  };

  const handleAmountPaidChange = (event) => {
    let value = event.target.value;
    value = validateAmount(value);
    setAmountPaid(value);
  };

  const handleRemainingAmountChange = (event) => {
    let value = event.target.value;
    value = validateAmount(value);
    setRemainingAmount(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedSupplier) {
      showAlert("warning", "Debe seleccionar un proveedor");
      return;
    }
    if (!description) {
      showAlert("warning", "Debe ingresar una descripción");
      return;
    }
    if (!invoiceDate) {
      showAlert("warning", "Debe ingresar una fecha de factura");
      return;
    }
    if (!dueDate) {
      showAlert("warning", "Debe ingresar una fecha de vencimiento");
      return;
    }
    if (!paymentStatus) {
      showAlert("warning", "Debe seleccionar un estado de pago");
      return;
    }
    if (!totalAmount) {
      showAlert("warning", "Debe ingresar un valor total");
      return;
    }
    if (!amountPaid) {
      showAlert("warning", "Debe ingresar un valor pagado");
      return;
    }
    if (!remainingAmount) {
      showAlert("warning", "Debe ingresar un valor pendiente");
      return;
    }

    const totalAmountNumeric = Number(totalAmount.replace(/\D/g, ""));
    const amountPaidNumeric = Number(amountPaid.replace(/\D/g, ""));
    const remainingAmountNumeric = Number(remainingAmount.replace(/\D/g, ""));

    if (totalAmountNumeric < amountPaidNumeric) {
      showAlert("warning", "El valor pagado no puede ser mayor al valor total");
      return;
    }

    if (totalAmountNumeric < remainingAmountNumeric) {
      showAlert(
        "warning",
        "El valor pendiente no puede ser mayor al valor total"
      );
      return;
    }

    const updatedInvoice = {
      invoice_id: id,
      supplier_id: selectedSupplier.supplier_id,
      description,
      invoice_date: invoiceDate,
      due_date: dueDate,
      payment_status: paymentStatus,
      total_amount: totalAmountNumeric,
      paid_amount: amountPaidNumeric,
      remaining_amount: remainingAmountNumeric,
    };
    setInvoice(updatedInvoice);

    const result = await db.Invoice.update(updatedInvoice, {
      where: {
        invoice_id: id,
      },
    });
    setTimeout(() => {
      if (result) {
        const updatedInvoices = invoices.filter(
          (invoice) => invoice.invoice_id !== id
        );
        setInvoices(
          [...updatedInvoices, { ...updatedInvoice }]
          // invoices.map((invoice) => {
          //   if (invoice.invoice_id === id) {
          //     return result;
          //   }
          //   return invoice;
          // })
        );
        showAlert("success", "Factura actualizada exitosamente");
        setTimeout(() => {
          ipcRenderer.send("close-edit-invoice");
        }, 1000);
      } else {
        showAlert("error", "No se pudo actualizar la factura");
      }
    }, 1000);
  };

  const supplierOptions = suppliers.map((supplier) => {
    return (
      <option key={supplier.supplier_id} value={supplier.supplier_name}>
        {supplier.supplier_name}
      </option>
    );
  });

  console.log("id", id);
  console.log("invoice", invoice);
  console.log("suppliers", suppliers);
  console.log("selectedSupplier", selectedSupplier);
  console.log("description", description);
  console.log("invoiceDate", invoiceDate);
  console.log("dueDate", dueDate);
  console.log("paymentStatus", paymentStatus);
  console.log("totalAmount", totalAmount);
  console.log("amountPaid", amountPaid);
  console.log("remainingAmount", remainingAmount);

  return (
    <div className="flex flex-col items-center justify-center my-8 min-h-screen">
      <div className="container max-w-lg px-4 py-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Editar Factura
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border-t border-b border-gray-200 py-6"
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
              value={
                selectedSupplier?.supplier_name || "Selecciona un proveedor"
              }
              onChange={handleSupplierChange}
              isHandleChange={true}
            >
              {supplierOptions}
            </Select>
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
              htmlFor="invoiceDate"
              className="text-lg font-medium text-gray-600 md:w-3/5"
            >
              Fecha de Factura
            </label>
            <DatePicker
              id="invoiceDate"
              selected={invoiceDate}
              onChange={handleInvoiceDateChange}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="appearance-none text-gray-700 border border-gray-200 rounded py-1 text-center px-4 ml-6 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="dueDate"
              className="text-lg font-medium text-gray-600 md:w-3/5"
            >
              Fecha de Vencimiento
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
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="paymentStatus"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Estado de Pago
            </label>
            {/* <Select
              id="paymentStatus"
              className="mt-1 p-2 border border-gray-300 rounded-md"
              value={paymentStatus}
              onChange={handlePaymentStatusChange}
              isHandleChange={true}
            >
              {paymentStatusOptions}
            </Select> */}
            <Input
              type="text"
              id="paymentStatus"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={paymentStatus}
              onChange={handlePaymentStatusChange}
              isHandleChange={true}
              disabled={true}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="totalAmount"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Valor Total
            </label>
            <Input
              type="text"
              id="totalAmount"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={"$" + totalAmount}
              onChange={handleTotalAmountChange}
              isHandleChange={true}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="amountPaid"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Valor Pagado
            </label>
            <Input
              type="text"
              id="amountPaid"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={"$" + amountPaid}
              onChange={handleAmountPaidChange}
              isHandleChange={true}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="remainingAmount"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Valor Pendiente
            </label>
            <Input
              type="text"
              id="remainingAmount"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={"$" + remainingAmount}
              onChange={handleRemainingAmountChange}
              isHandleChange={true}
              disabled={true}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
              onClick={() => {
                ipcRenderer.send("close-edit-invoice");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
            >
              Actualizar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
