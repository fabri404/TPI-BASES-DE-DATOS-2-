const { DB_NAME, ping, closeConnection } = require("./database");

async function main() {
  try {
    await ping();

    console.log("Conexion exitosa con MongoDB Atlas.");
    console.log("Usuario y contraseña validados correctamente.");
    console.log("Base de datos en uso:", DB_NAME);
  } catch (error) {
    console.error("Error de conexion:", error.message);
    process.exitCode = 1;
  } finally {
    await closeConnection();
  }
}

main();
