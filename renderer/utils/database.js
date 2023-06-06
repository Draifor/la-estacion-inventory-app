import { Sequelize } from "sequelize";
import { User } from "../models/user";
import { Supplier } from "../models/supplier";
import { Invoice } from "../models/invoice";
import { SupplierType } from "../models/supplierType";
import hashPassword from "./hashPassword";
import mysql from "mysql2";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql,
    timezone: "-05:00",
    logging: false,
  }
);

const db = {};

db.sequelize = sequelize;

// Define the models for the database tables
db.User = User(sequelize);
db.Supplier = Supplier(sequelize);
db.Invoice = Invoice(sequelize);
db.SupplierType = SupplierType(sequelize);

// Define the associations between the models
db.Supplier.hasMany(db.Invoice, { foreignKey: "supplier_id" });
db.Invoice.belongsTo(db.Supplier, { foreignKey: "supplier_id" });
db.SupplierType.hasMany(db.Supplier, { foreignKey: "type_id" });

async function createDefaultDBValues() {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  const users = [
    {
      username: "admin",
      password: hashPassword("admin"),
      role: "admin",
    },
    {
      username: "user",
      password: hashPassword("user"),
      role: "user",
    },
  ];

  const supplierTypes = [
    { type_name: "Grande" },
    { type_name: "Pequeño" },
    { type_name: "Queso" },
  ];

  const examplesSuppliers = [
    {
      supplier_name: "Harinal el Trigal",
      type_id: 1,
      address: "Calle 1 # 1-1",
      telephone: "1234567890",
    },
    {
      supplier_name: "Leche la Vaquita",
      type_id: 2,
      address: "Calle 34 # 51-1",
      telephone: "0987654321",
    },
    {
      supplier_name: "Quesos el Paisa",
      type_id: 3,
      address: "Calle 45 # 56-23",
      telephone: "1234567890",
    },
  ];

  const examplesInvoices = [
    {
      supplier_id: 3,
      description: "Compra de queso",
      total_amount: 50000,
      paid_amount: 30000,
      payment_status: "Crédito",
      remaining_amount: 20000,
    },
    {
      supplier_id: 2,
      description: "Compra de leche",
      total_amount: 20000,
      paid_amount: 20000,
      payment_status: "Pagada",
      remaining_amount: 0,
    },
    {
      supplier_id: 1,
      description: "Compra de harina",
      total_amount: 100000,
      paid_amount: 50000,
      payment_status: "Crédito",
      remaining_amount: 50000,
    },
  ];

  // Create tables with default data
  await db.sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
  await db.User.bulkCreate(users);
  await db.SupplierType.bulkCreate(supplierTypes);
  await db.Supplier.bulkCreate(examplesSuppliers);
  await db.Invoice.bulkCreate(examplesInvoices);
}

// createDefaultDBValues();
export default db;
