"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import db from "@/utils/database";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";

import showAlert from "@/app/components/showAlert";
import Textarea from "@/app/components/Textarea";
import Button from "@/app/components/Button";

const TOTAL_PAYMENT = "Pago total";
const PARTIAL_PAYMENT = "Pago parcial";

const defaultSupplier = db.Supplier.build({
  supplier_id: 0,
  supplier_name: "Selecciona un proveedor",
});
const totalPayment = { type_id: 1, type_name: TOTAL_PAYMENT };
const partialPayment = { type_id: 2, type_name: PARTIAL_PAYMENT };

const defaultPaymentTypes = [totalPayment, partialPayment];

export default function AddSupplier() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(defaultSupplier);
  const [description, setDescription] = useState("");
  const [paymentTypes, setPaymentTypes] = useState(defaultPaymentTypes);
  const [selectedPaymentType, setSelectedPaymentType] = useState(totalPayment);
  const [isTotalPayment, setIsTotalPayment] = useState(true);
  const [totalAmount, setTotalAmount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [remainingAmount, setRemainingAmount] = useState("");

  useEffect(() => {
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
        setSelectedSupplier(result[0]);
      } catch (error) {
        console.error("Unable to fetch suppliers:", error);
      }
    }

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const total = Number(totalAmount.replace(/\D/g, ""));
    const paid = Number(paidAmount.replace(/\D/g, ""));
    const remaining = total - paid;
    if (total > 0 && remaining < 0) {
      showAlert("warning", "El monto pagado no puede ser mayor al total");
      return;
    }
    setRemainingAmount(remaining.toLocaleString("es-ES"));
  }, [totalAmount, paidAmount]);

  const handleSupplierChange = (event) => {
    const newSelectedSupplier = suppliers.find(
      (supplier) => supplier.supplier_name === event.target.value
    );
    setSelectedSupplier(newSelectedSupplier);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePaymentTypeChange = (event) => {
    console.log("handlePaymentTypeChange --> before");
    console.log("event.target.value", event.target.value);
    console.log("paymentTypes", paymentTypes);
    console.log("selectedPaymentType", selectedPaymentType);
    const newSelectedPaymentType = paymentTypes.find(
      (paymentType) => paymentType.type_name === event.target.value
    );
    setSelectedPaymentType(newSelectedPaymentType);
    console.log("handlePaymentTypeChange --> after");
    console.log("newSelectedPaymentType", newSelectedPaymentType);
    console.log("selectedPaymentType", selectedPaymentType);
    console.log("isTotalPayment", isTotalPayment);
    console.log(
      "newSelectedPaymentType.type_name",
      newSelectedPaymentType.type_name
    );
    console.log("TOTAL_PAYMENT", TOTAL_PAYMENT);
    console.log(
      "newSelectedPaymentType.type_name === TOTAL_PAYMENT",
      newSelectedPaymentType.type_name === TOTAL_PAYMENT
    );
    const isTotal = newSelectedPaymentType.type_name === TOTAL_PAYMENT;
    setIsTotalPayment(isTotal);
    if (isTotal) {
      setPaidAmount(totalAmount);
    }
  };

  const handleTotalAmountChange = (event) => {
    // Validate that the field only contains numbers
    const value = event.target.value.replace(/\D/g, "");
    setTotalAmount(Number(value).toLocaleString("es-ES"));
    if (isTotalPayment) {
      setPaidAmount(Number(value).toLocaleString("es-ES"));
    }
  };

  const handlePaidAmountChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setPaidAmount(Number(value).toLocaleString("es-ES"));
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

    const totalAmountNumeric = Number(totalAmount.replace(/\D/g, ""));
    const paidAmountNumeric = Number(paidAmount.replace(/\D/g, ""));
    const remainingAmountNumeric = totalAmountNumeric - paidAmountNumeric;
    let payment_status = isTotalPayment ? "Pagada" : "Crédito";

    if (remainingAmountNumeric < 0) {
      showAlert("warning", "El monto pagado no puede ser mayor al total");
      return;
    }

    if (totalAmountNumeric === 0) {
      showAlert("warning", "El monto total no puede ser cero");
      return;
    }

    if (totalAmountNumeric === paidAmountNumeric) {
      payment_status = "Pagada";
    }

    try {
      await db.Invoice.create({
        supplier_id: selectedSupplier.supplier_id,
        description: description,
        total_amount: totalAmountNumeric,
        paid_amount: paidAmountNumeric,
        payment_status: payment_status,
        remaining_amount: remainingAmountNumeric,
      });
      showAlert("success", "Factura agregada correctamente!");
      resetForm();

      setTimeout(() => {
        router.push("/show-invoices");
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
    setSelectedPaymentType(totalPayment);
    setIsTotalPayment(true);
    setTotalAmount("");
    setPaidAmount("");
    setRemainingAmount("");
  };
  return (
    <div className="container mx-auto px-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Registrar Factura</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <fieldset className="inline-block mr-16">
            <label htmlFor="supplier" className="block font-medium mb-2">
              Proveedor
            </label>
            <Select
              id="supplier"
              className="form-select w-full"
              value={selectedSupplier.supplier_name}
              onChange={handleSupplierChange}
              isHandleChange={true}
            >
              {supplierOptions}
            </Select>
          </fieldset>
          <fieldset className="inline-block">
            <label htmlFor="paymentType" className="block font-medium mb-2">
              Tipo de Pago
            </label>
            <Select
              id="paymentType"
              className="form-select w-full"
              value={selectedPaymentType.type_name}
              onChange={handlePaymentTypeChange}
              isHandleChange={true}
            >
              {paymentTypeOptions}
            </Select>
          </fieldset>
        </div>
        <div className="mb-4">
          <fieldset className="max-w-lg">
            <label htmlFor="description" className="block font-medium mb-2">
              Descripción
            </label>
            <Textarea
              id="description"
              className="form-input w-full"
              value={description}
              onChange={handleDescriptionChange}
              isHandleChange={true}
            />
          </fieldset>
        </div>
        <div className="mb-4">
          <fieldset className="inline-block mr-12">
            <label htmlFor="totalAmount" className="block font-medium mb-2">
              Valor Factura
            </label>
            <Input
              type="text"
              id="totalAmount"
              className="form-input w-full"
              value={"$ " + totalAmount}
              // pattern="[0-9]*"
              onChange={handleTotalAmountChange}
              isHandleChange={true}
              required
            />
          </fieldset>
          <fieldset className="inline-block">
            <label htmlFor="paidAmount" className="block font-medium mb-2">
              Valor a Pagar
            </label>
            <Input
              type="text"
              id="paidAmount"
              className="form-input w-full"
              value={"$ " + paidAmount}
              onChange={handlePaidAmountChange}
              isHandleChange={true}
              required
              disabled={isTotalPayment}
            />
          </fieldset>
        </div>
        <div className="mb-4">
          <fieldset className="w-[215px]">
            <label htmlFor="remainingAmount" className="block font-medium mb-2">
              Valor Restante
            </label>
            <Input
              type="text"
              id="remainingAmount"
              className="form-input w-full"
              value={"$ " + remainingAmount}
              disabled
            />
          </fieldset>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Agregar Factura
          </Button>
        </div>
      </form>
    </div>
  );
}
