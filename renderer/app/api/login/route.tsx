import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/database";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userName, password } = req.body;

  console.log("userName api", userName)
  console.log("password api", password)
  // Check if the user already exists
  const user = await db.models.User.findOne({
    where: {
      userName,
    },
  });

  // If the user already exists, return an error
  if (user) {
    res.status(400).json({ success: false, message: "El usuario ya existe" });
    return;
  }

  // If the user doesn't exists, create it
  const newUser = await db.models.User.create({
    userName,
    password,
  });

  // Return a success message
  res.status(200).json({ success: true, message: "Usuario creado exitosamente" });
}

