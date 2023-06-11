import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../utils/database";
import hashPassword from "../../../utils/hashPassword";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userName, password } = req.body;

    const passwordHashed = hashPassword(password, "hash");

    db.models.User.create({
      userName,
      password: passwordHashed,
    });

    console.log("Usuario creado exitosamente")

    res.status(200).json({ success: true, message: "Usuario creado exitosamente" });
  } else {
    res.status(405).json({ success: false, message: "Método no permitido" });
  }
}
