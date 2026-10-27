require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

// Este archivo es la fuente compartida de los datos de prueba.
// Los _id son fijos para que cada integrante pueda ejecutarlo las veces
// que quiera: inserta lo que falta y actualiza lo que cambió, sin duplicar.
// Nunca borra documentos que no estén acá.

const FECHA_CARGA_INICIAL = new Date("2026-10-22T15:41:09.001Z");

const IDS = {
  usuarios: {
    admin: new ObjectId("6ada2e9550470bdfd7724039"),
    operador: new ObjectId("6ada2e9550470bdfd772403a")
  },
  categorias: {
    tintos: new ObjectId("6ada2e9550470bdfd772403b"),
    blancos: new ObjectId("6ada2e9550470bdfd772403c"),
    espumantes: new ObjectId("6ada2e9550470bdfd772403d")
  },
  clientes: {
    lucia: new ObjectId("6ada2e9550470bdfd772403e"),
    martin: new ObjectId("6ada2e9550470bdfd772403f"),
    sofia: new ObjectId("6ada2e9550470bdfd7724040")
  },
  productos: {
    trumpeterMalbec: new ObjectId("6ada2e9550470bdfd7724041"),
    lopezCabernet: new ObjectId("6ada2e9550470bdfd7724042"),
    rutiniChardonnay: new ObjectId("6ada2e9550470bdfd7724043"),
    chandonExtraBrut: new ObjectId("6ada2e9550470bdfd7724044"),
    montchenotGranReserva: new ObjectId("6adfbdacce606c31b40035de")
  },
  ventas: {
    venta1: new ObjectId("6adfbb42ce606c31b40035d9"),
    venta2: new ObjectId("6adfc167ce606c31b40035e8"),
    venta3: new ObjectId("6adfc167ce606c31b40035e9"),
    venta4: new ObjectId("6adfc167ce606c31b40035ea")
  }
};

const usuarios = [
  {
    _id: IDS.usuarios.admin,
    nombre: "Administrador Demo",
    email: "admin@vinoteca.test",
    password_hash: "HASH_DEMO_NO_VALIDO",
    rol: "admin",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.usuarios.operador,
    nombre: "Operador Demo",
    email: "operador@vinoteca.test",
    password_hash: "HASH_DEMO_NO_VALIDO",
    rol: "operador",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  }
];

const categorias = [
  {
    _id: IDS.categorias.tintos,
    nombre: "Tintos",
    descripcion: "Vinos tintos",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.categorias.blancos,
    nombre: "Blancos",
    descripcion: "Vinos blancos",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.categorias.espumantes,
    nombre: "Espumantes",
    descripcion: "Vinos espumantes",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  }
];

const clientes = [
  {
    _id: IDS.clientes.lucia,
    nombre: "Lucía",
    apellido: "Pérez",
    email: "lucia@example.test",
    telefono: "3510000001",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.clientes.martin,
    nombre: "Martín",
    apellido: "Gómez",
    email: "martin@example.test",
    telefono: "3510000002",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.clientes.sofia,
    nombre: "Sofía",
    apellido: "López",
    email: "sofia@example.test",
    telefono: "3510000003",
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  }
];

const BOTELLA_ESTANDAR = { volumen_ml: 750, tipo_botella: "Estándar" };
const BOTELLA_ESPUMANTE = { volumen_ml: 750, tipo_botella: "Espumante" };

const productos = [
  {
    _id: IDS.productos.trumpeterMalbec,
    nombre: "Trumpeter Malbec",
    marca: "Rutini Wines",
    precio: 12500,
    stock: 20,
    categoria_id: IDS.categorias.tintos,
    presentacion: BOTELLA_ESTANDAR,
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.productos.lopezCabernet,
    nombre: "Lopez Cabernet Sauvignon",
    marca: "López",
    precio: 11000,
    stock: 15,
    categoria_id: IDS.categorias.tintos,
    presentacion: BOTELLA_ESTANDAR,
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.productos.rutiniChardonnay,
    nombre: "Rutini Chardonnay",
    marca: "Rutini Wines",
    precio: 9800,
    stock: 12,
    categoria_id: IDS.categorias.blancos,
    presentacion: BOTELLA_ESTANDAR,
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.productos.chandonExtraBrut,
    nombre: "Chandon Extra Brut",
    marca: "Chandon",
    precio: 14500,
    stock: 8,
    categoria_id: IDS.categorias.espumantes,
    presentacion: BOTELLA_ESPUMANTE,
    activo: true,
    fecha_creacion: FECHA_CARGA_INICIAL
  },
  {
    _id: IDS.productos.montchenotGranReserva,
    nombre: "Montchenot Gran Reserva",
    marca: "López",
    precio: 25000,
    stock: 10,
    categoria_id: IDS.categorias.tintos,
    presentacion: BOTELLA_ESTANDAR,
    activo: true,
    fecha_creacion: new Date("2026-10-26T17:50:00.000Z")
  }
];

function item(productoId, nombre, precioUnitario, cantidad) {
  return {
    producto_id: productoId,
    nombre,
    precio_unitario: precioUnitario,
    cantidad
  };
}

const P = IDS.productos;

const ventas = [
  {
    _id: IDS.ventas.venta1,
    cliente_id: IDS.clientes.lucia,
    usuario_id: IDS.usuarios.admin,
    fecha: new Date("2026-10-26T15:30:00.000Z"),
    items: [
      item(P.trumpeterMalbec, "Trumpeter Malbec", 12500, 2),
      item(P.rutiniChardonnay, "Rutini Chardonnay", 9800, 1)
    ],
    activo: true
  },
  {
    _id: IDS.ventas.venta2,
    cliente_id: IDS.clientes.martin,
    usuario_id: IDS.usuarios.operador,
    fecha: new Date("2026-10-24T11:15:00.000Z"),
    items: [item(P.chandonExtraBrut, "Chandon Extra Brut", 14500, 1)],
    activo: true
  },
  {
    _id: IDS.ventas.venta3,
    cliente_id: IDS.clientes.sofia,
    usuario_id: IDS.usuarios.operador,
    fecha: new Date("2026-10-25T19:40:00.000Z"),
    items: [
      item(P.montchenotGranReserva, "Montchenot Gran Reserva", 25000, 1),
      item(P.lopezCabernet, "Lopez Cabernet Sauvignon", 11000, 2),
      item(P.rutiniChardonnay, "Rutini Chardonnay", 9800, 3)
    ],
    activo: true
  },
  {
    _id: IDS.ventas.venta4,
    cliente_id: IDS.clientes.martin,
    usuario_id: IDS.usuarios.admin,
    fecha: new Date("2026-10-25T12:05:00.000Z"),
    items: [item(P.trumpeterMalbec, "Trumpeter Malbec", 12500, 6)],
    activo: false
  }
];

const SEED = { usuarios, categorias, clientes, productos, ventas };

// fecha_creacion solo se escribe al insertar, para no pisar la original.
function toUpsert({ _id, fecha_creacion, ...campos }) {
  const update = { $set: campos };

  if (fecha_creacion) {
    update.$setOnInsert = { fecha_creacion };
  }

  return {
    updateOne: { filter: { _id }, update, upsert: true }
  };
}

async function syncCollection(db, nombre, documentos) {
  const resultado = await db
    .collection(nombre)
    .bulkWrite(documentos.map(toUpsert), { ordered: true });

  return {
    coleccion: nombre,
    insertados: resultado.upsertedCount,
    actualizados: resultado.modifiedCount,
    sin_cambios: resultado.matchedCount - resultado.modifiedCount
  };
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("Falta MONGODB_URI en el archivo .env");
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const db = client.db("TPI_Vinoteca");
    const resumen = [];

    for (const [nombre, documentos] of Object.entries(SEED)) {
      resumen.push(await syncCollection(db, nombre, documentos));
    }

    console.log("Sincronización de datos de prueba completada.");
    console.table(resumen);
  } catch (error) {
    console.error("Error durante la carga:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
