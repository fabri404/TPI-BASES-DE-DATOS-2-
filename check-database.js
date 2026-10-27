require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const db = client.db("TPI_Vinoteca");
    const colecciones = await db.listCollections().toArray();

    console.log("Base de datos: TPI_Vinoteca");
    console.log("Colecciones:");

    colecciones.forEach(c => console.log(`- ${c.name}`));
    console.log("Total:", colecciones.length);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();

