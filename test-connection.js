require("dotenv").config();

const { MongoClient } = require("mongodb");

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Falta MONGODB_URI en el archivo .env");
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("Conexion exitosa con MongoDB Atlas.");
    console.log("Usuario y contraseña validados correctamente.");
  } catch (error) {
    console.error("Error de conexion:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();

