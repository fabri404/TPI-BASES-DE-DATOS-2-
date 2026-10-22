
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Falta MONGODB_URI en el archivo .env");
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const db = client.db("TPI_Vinoteca");

    const usuarios = db.collection("usuarios");
    const clientes = db.collection("clientes");
    const categorias = db.collection("categorias");
    const productos = db.collection("productos");

    // Evitar duplicar los datos si el script ya fue ejecutado.
    const total = await Promise.all([
      usuarios.countDocuments(),
      clientes.countDocuments(),
      categorias.countDocuments(),
      productos.countDocuments()
    ]);

    if (total.some(cantidad => cantidad > 0)) {
      console.log(
        "Carga cancelada: hay colecciones con datos. " +
        "Revisá la base antes de volver a ejecutar."
      );
      return;
    }

    const fecha = new Date();

    await usuarios.insertMany([
      {
        nombre: "Administrador Demo",
        email: "admin@vinoteca.test",
        password_hash: "HASH_DEMO_NO_VALIDO",
        rol: "admin",
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Operador Demo",
        email: "operador@vinoteca.test",
        password_hash: "HASH_DEMO_NO_VALIDO",
        rol: "operador",
        activo: true,
        fecha_creacion: fecha
      }
    ]);

    const resultadoCategorias = await categorias.insertMany([
      {
        nombre: "Tintos",
        descripcion: "Vinos tintos",
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Blancos",
        descripcion: "Vinos blancos",
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Espumantes",
        descripcion: "Vinos espumantes",
        activo: true,
        fecha_creacion: fecha
      }
    ]);

    const idsCategorias = Object.values(resultadoCategorias.insertedIds);

    await clientes.insertMany([
      {
        nombre: "Lucía",
        apellido: "Pérez",
        email: "lucia@example.test",
        telefono: "3510000001",
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Martín",
        apellido: "Gómez",
        email: "martin@example.test",
        telefono: "3510000002",
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Sofía",
        apellido: "López",
        email: "sofia@example.test",
        telefono: "3510000003",
        activo: true,
        fecha_creacion: fecha
      }
    ]);

    await productos.insertMany([
      {
        nombre: "Malbec Reserva",
        marca: "Bodega Demo",
        precio: 12500,
        stock: 20,
        categoria_id: idsCategorias[0],
        presentacion: {
          volumen_ml: 750,
          tipo_botella: "Estándar"
        },
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Cabernet Sauvignon",
        marca: "Bodega Demo",
        precio: 11000,
        stock: 15,
        categoria_id: idsCategorias[0],
        presentacion: {
          volumen_ml: 750,
          tipo_botella: "Estándar"
        },
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Chardonnay",
        marca: "Viñedos Demo",
        precio: 9800,
        stock: 12,
        categoria_id: idsCategorias[1],
        presentacion: {
          volumen_ml: 750,
          tipo_botella: "Estándar"
        },
        activo: true,
        fecha_creacion: fecha
      },
      {
        nombre: "Extra Brut",
        marca: "Bodega Demo",
        precio: 14500,
        stock: 8,
        categoria_id: idsCategorias[2],
        presentacion: {
          volumen_ml: 750,
          tipo_botella: "Espumante"
        },
        activo: true,
        fecha_creacion: fecha
      }
    ]);

    console.log("Carga de datos de prueba completada.");
    console.log("Usuarios: 2");
    console.log("Categorías: 3");
    console.log("Clientes: 3");
    console.log("Productos: 4");
  } catch (error) {
    console.error("Error durante la carga:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
