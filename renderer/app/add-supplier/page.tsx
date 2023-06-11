"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import db from "@/utils/database";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";

import showAlert from "@/app/components/showAlert";
import Button from "@/app/components/Button";

const defaultSupplierType = db.SupplierType.build({
  type_id: 0,
  type_name: "Selecciona un tipo de proveedor",
});

export default function AddSupplier() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [supplierTypes, setSupplierTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(defaultSupplierType);

  useEffect(() => {
    console.log("useEffect --> Holi");
    async function fetchSupplierTypes() {
      try {
        await db.sequelize.authenticate();
        console.log("Connection has been established successfully.");
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }

      const result = await db.SupplierType.findAll();
      result.unshift(defaultSupplierType);
      setSupplierTypes(result);
      console.log(result);
      setSelectedType(result[0]);
    }
    fetchSupplierTypes();
  }, []);

  const handleTypeChange = (event) => {
    const selectedType = supplierTypes.find(
      (type) => type.type_name === event.target.value
    );
    setSelectedType(selectedType);
  };

  const phoneRegex = /^\d{3} \d{3} \d{4}$/;

  const handleTelephoneChange = (event) => {
    let value = event.target.value.replace(/[^\d]/g, "");
    if (value.length > 0) {
      value =
        value.substring(0, 3) +
        (value.length > 3 ? " " + value.substring(3) : "");
    }
    if (value.length > 7) {
      value =
        value.substring(0, 7) +
        (value.length > 7 ? " " + value.substring(7) : "");
    }
    if (value.length > 12) {
      showAlert(
        "warning",
        "El número de teléfono no puede tener más de 10 dígitos"
      );
      return;
    }
    setTelephone(value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (supplierName.trim() === "") {
      showAlert("warning", "Ingresa el nombre del proveedor");
      return;
    }
    if (telephone.trim() === "") {
      showAlert("warning", "Ingresa el número de teléfono");
      return;
    }
    if (!phoneRegex.test(telephone)) {
      showAlert("warning", "Ingresa un número de teléfono válido");
      return;
    }
    if (address.trim() === "") {
      showAlert("warning", "Ingresa la dirección del proveedor");
      return;
    }
    if (selectedType.type_id === 0) {
      showAlert("warning", "Selecciona un tipo de proveedor");
      return;
    }
    await db.Supplier.create({
      supplier_name: supplierName,
      telephone,
      address,
      type_id: selectedType.type_id,
    });
    showAlert("success", "Proveedor agregado correctamente!");
    resetForm();
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }

  const supplierTypeOptions = supplierTypes.map((type) => (
    <option
      key={type.type_id}
      value={type.type_name}
      disabled={type.type_id === 0}
    >
      {type.type_name}
    </option>
  ));

  const resetForm = () => {
    setSupplierName("");
    setTelephone("");
    setAddress("");
    setSelectedType(defaultSupplierType);
  };

  return (
    <div className="container mx-auto px-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Registrar Proveedor</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="supplierName" className="block font-medium mb-2">
            Nombre
          </label>
          <Input
            type="text"
            id="supplierName"
            className="form-input w-full"
            value={supplierName}
            onChange={setSupplierName}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="telephone"
            className="block font-medium mb-2
"
          >
            Teléfono
          </label>
          <Input
            type="text"
            id="telephone"
            className="form-input"
            value={telephone}
            onChange={handleTelephoneChange}
            isHandleChange={true}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block font-medium mb-2">
            Dirección
          </label>
          <Input
            type="text"
            id="address"
            className="form-input w-full"
            value={address}
            onChange={setAddress}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="supplierType" className="block font-medium mb-2">
            Tipo
          </label>
          <Select
            id="supplierType"
            className="form-select w-full"
            value={selectedType.type_name}
            onChange={handleTypeChange}
            isHandleChange={true}
          >
            {supplierTypeOptions}
          </Select>
        </div>
        <Button
          type="submit"
          className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Proveedor
        </Button>
      </form>
    </div>
  );
}
