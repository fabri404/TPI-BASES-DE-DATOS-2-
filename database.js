require("dotenv").config({ quiet: true });
const { MongoClient } = require("mongodb");

// Ambos integrantes deben apuntar al mismo cluster y a la misma base
// para ver los cambios del otro: la URI y el nombre salen del .env.
const DEFAULT_DB_NAME = "TPI_Vinoteca";
const SERVER_SELECTION_TIMEOUT_MS = 10000;

const DB_NAME = process.env.DB_NAME || DEFAULT_DB_NAME;

let clientPromise = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Falta MONGODB_URI en el archivo .env (usá .env.example como plantilla)"
    );
  }

  return uri;
}

function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(getMongoUri(), {
      appName: "vinoteca-tpi",
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS
    });

    // Si la conexión falla, se descarta para poder reintentar.
    clientPromise = client.connect().catch(error => {
      clientPromise = null;
      throw error;
    });
  }

  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  return client.db(DB_NAME);
}

async function ping() {
  const db = await getDb();
  await db.command({ ping: 1 });
}

async function closeConnection() {
  if (!clientPromise) {
    return;
  }

  const client = await clientPromise;
  clientPromise = null;
  await client.close();
}

module.exports = {
  DB_NAME,
  getDb,
  ping,
  closeConnection
};
