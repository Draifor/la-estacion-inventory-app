import bcrypt from "bcryptjs";

export default async function hashPassword(
  password: string,
  type: string,
  userHashedPassword?: string
) {
  const saltRounds = 10;

  if (type === "hash") {
    // Cifrar la contraseña
    await bcrypt.hash(password, saltRounds, function (err, hash) {
      // Si hay un error, mostrarlo
      if (err) {
        console.error(err);
        return;
      }
      // Si no hay error, mostrar el hash
      console.log("Contraseña cifrada:", hash);
      console.log("if")
      return hash;
    });
  } else if (type === "compare") {
    // Comprobar si la contraseña coincide con el hash
    await bcrypt.compare(password, userHashedPassword, function (err, result) {
      // Si hay un error, mostrarlo
      if (err) {
        console.error(err);
        return;
      }
      // Si no hay error, mostrar el resultado de la comparación
      console.log("Contraseña coincide:", result);
      console.log("else")
      return result ? result.toString() : null;
    });
  }
  console.log("A ver que pedo null")
  return null;
}
