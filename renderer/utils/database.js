import { Sequelize } from "sequelize";
import { User } from "../models/user";
import { Supplier } from "../models/supplier";
import { Invoice } from "../models/invoice";
import { SupplierType } from "../models/supplierType";
import { Dough } from "@/models/dough";
import { DoughProduct } from "@/models/doughProduct";
import { Ingredient } from "@/models/ingredient";
import { IngredientDough } from "@/models/ingredientDough";
import { Product } from "@/models/product";
import bcrypt from "bcryptjs";
import mysql from "mysql2";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
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
db.Dough = Dough(sequelize);
db.Product = Product(sequelize);
db.Ingredient = Ingredient(sequelize);
db.DoughProduct = DoughProduct(sequelize);
db.IngredientDough = IngredientDough(sequelize);

// Define the associations between the models
db.Supplier.hasMany(db.Invoice, { foreignKey: "supplier_id" });
db.Invoice.belongsTo(db.Supplier, { foreignKey: "supplier_id" });
db.SupplierType.hasMany(db.Supplier, { foreignKey: "type_id" });

db.Ingredient.hasMany(db.IngredientDough, { foreignKey: "ingredient_id" });
db.Dough.hasMany(db.IngredientDough, { foreignKey: "dough_id" });
db.IngredientDough.belongsTo(db.Ingredient, { foreignKey: "ingredient_id" });
db.IngredientDough.belongsTo(db.Dough, { foreignKey: "dough_id" });

db.Dough.hasMany(db.DoughProduct, { foreignKey: "dough_id" });
db.Product.hasMany(db.DoughProduct, { foreignKey: "product_id" });
db.DoughProduct.belongsTo(db.Dough, { foreignKey: "dough_id" });
db.DoughProduct.belongsTo(db.Product, { foreignKey: "product_id" });

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
      name: "Administrador",
      password: await bcrypt.hash("admin", 10),
      role: "admin",
    },
    {
      username: "user",
      name: "Usuario",
      password: await bcrypt.hash("user", 10),
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

async function defaultProductValues() {
  try {
    await db.sequelize.authenticate();
    const ingredient1 = await db.Ingredient.create({
      ingredient_name: "Harina Kg",
      ingredient_description: "Harina de trigo para panadería",
      ingredient_price: 4000,
      ingredient_stock: 50,
    });

    const ingredient2 = await db.Ingredient.create({
      ingredient_name: "Azúcar Kg",
      ingredient_description: "Azúcar para panadería",
      ingredient_price: 5000,
      ingredient_stock: 30,
    });

    const dough1 = await db.Dough.create({
      dough_name: "Dough de Trigo",
      dough_description: "Dough para pan de trigo",
      dough_stock: 20,
    });

    const dough2 = await db.Dough.create({
      dough_name: "Dough de Maíz",
      dough_description: "Dough para pan de maíz",
      dough_stock: 15,
    });

    await db.IngredientDough.bulkCreate([
      {
        dough_id: dough1.dough_id,
        ingredient_id: ingredient1.ingredient_id,
        quantity: 5,
        ingredient_dough_stock: 5,
      },
      {
        dough_id: dough1.dough_id,
        ingredient_id: ingredient2.ingredient_id,
        quantity: 2,
        ingredient_dough_stock: 20,
      },
      {
        dough_id: dough2.dough_id,
        ingredient_id: ingredient1.ingredient_id,
        quantity: 4,
        ingredient_dough_stock: 10,
      },
    ]);

    // Insertar datos de prueba en la tabla Productos
    const producto1 = await db.Product.create({
      product_name: "Pan de Trigo",
      product_description: "Pan hecho con Dough de trigo",
      product_cost: 1000,
      product_price: 2000,
      product_stock: 10,
    });

    const producto2 = await db.Product.create({
      product_name: "Pan de Maíz",
      product_description: "Pan hecho con Dough de maíz",
      product_cost: 1500,
      product_price: 2500,
      product_stock: 8,
    });

    await db.DoughProduct.bulkCreate([
      {
        dough_id: dough1.dough_id,
        product_id: producto1.product_id,
        quantity: 2,
        dough_product_stock: 10,
      },
      {
        dough_id: dough2.dough_id,
        product_id: producto2.product_id,
        quantity: 3,
        dough_product_stock: 8,
      },
    ]);

    console.log("Datos de prueba insertados correctamente");
  } catch (error) {
    console.error("Error al insertar datos de prueba:", error);
  } finally {
    // Cierra la conexión a la base de datos al finalizar
    sequelize.close();
  }
}

// createDefaultDBValues();
// defaultProductValues();

export default db;
