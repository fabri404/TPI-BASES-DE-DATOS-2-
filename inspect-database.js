const { getDb, closeConnection } = require("./database");

async function main() {
  try {
    const db = await getDb();

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
    await closeConnection();
  }
}

main();
