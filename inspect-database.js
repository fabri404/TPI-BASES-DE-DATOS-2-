
require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("TPI_Vinoteca");

    for (const nombre of [
      "usuarios",
      "clientes",
      "categorias",
      "productos"
    ]) {
      const coleccion = db.collection(nombre);
      const cantidad = await coleccion.countDocuments();
      const ejemplos = await coleccion.find({}).limit(2).toArray();

      console.log(`\n--- ${nombre} ---`);
      console.log(`Cantidad de documentos: ${cantidad}`);
      console.log("Ejemplos:");

      console.dir(ejemplos, { depth: 5 });
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
