const { DB_NAME, getDb, closeConnection } = require("./database");

async function main() {
  try {
    const db = await getDb();
    const colecciones = await db.listCollections().toArray();

    console.log("Base de datos:", DB_NAME);
    console.log("Colecciones:");

    colecciones.forEach(c => console.log(`- ${c.name}`));
    console.log("Total:", colecciones.length);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await closeConnection();
  }
}

main();

