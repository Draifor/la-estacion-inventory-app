"use client";
import { useState, useEffect } from "react";
import db from "@/utils/database";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import { ipcRenderer } from "electron";

import showAlert from "@/app/components/showAlert";
import Button from "@/app/components/Button";

const defaultSupplierType = db.SupplierType.build({
  type_id: 0,
  type_name: "Selecciona un tipo de proveedor",
});

export default function AddSupplier() {
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
      ipcRenderer.send("close-modal", { reload: true });
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
    <>
      <form
        className="space-y-6 border-t border-b border-gray-200 py-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label
            htmlFor="supplierName"
            className="text-lg font-medium text-gray-600"
          >
            Nombre
          </label>
          <Input
            type="text"
            id="supplierName"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={supplierName}
            onChange={setSupplierName}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="telephone"
            className="text-lg font-medium text-gray-600"
          >
            Teléfono
          </label>
          <Input
            type="text"
            id="telephone"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={telephone}
            onChange={setTelephone}
            isHandleChange={true}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="address"
            className="text-lg font-medium text-gray-600"
          >
            Dirección
          </label>
          <Input
            type="text"
            id="address"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={address}
            onChange={setAddress}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="supplierType"
            className="text-lg font-medium text-gray-600"
          >
            Tipo
          </label>
          <Select
            id="supplierType"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={selectedType.type_name}
            onChange={handleTypeChange}
            isHandleChange={true}
          >
            {supplierTypeOptions}
          </Select>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
          >
            Agregar Proveedor
          </Button>
          <Button
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
            onClick={() => {
              ipcRenderer.send("close-modal");
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
}
