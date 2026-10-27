const { ObjectId } = require("mongodb");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { getDb, closeConnection } = require("./database");

const rl = readline.createInterface({ input, output });

async function main() {
  try {
    const db = await getDb();
    const productos = db.collection("productos");

    let salir = false;

    while (!salir) {
      console.log("\n=== CRUD DE PRODUCTOS ===");
      console.log("1. Listar productos activos");
      console.log("2. Crear producto");
      console.log("3. Modificar precio y stock");
      console.log("4. Baja lógica de producto");
      console.log("0. Salir");

      const opcion = (await rl.question("Opción: ")).trim();

      switch (opcion) {
        case "1": {
          const lista = await productos.find({
            activo: true
          }).toArray();

          console.table(lista.map(p => ({
            id: p._id.toString(),
            nombre: p.nombre,
            precio: p.precio,
            stock: p.stock
          })));
          break;
        }

        case "2": {
          const nombre = (
            await rl.question("Nombre: ")
          ).trim();

          const marca = (
            await rl.question("Marca: ")
          ).trim();

          const precio = Number(
            await rl.question("Precio: ")
          );

          const stock = Number(
            await rl.question("Stock inicial: ")
          );

          const categoriaId = (
            await rl.question("ID de categoría: ")
          ).trim();

          if (
            !nombre ||
            !marca ||
            !Number.isFinite(precio) ||
            precio <= 0 ||
            !Number.isInteger(stock) ||
            stock < 0 ||
            !ObjectId.isValid(categoriaId)
          ) {
            console.log("Datos inválidos. No se creó el producto.");
            break;
          }

          const categoria = await db.collection("categorias")
            .findOne({
              _id: new ObjectId(categoriaId),
              activo: true
            });

          if (!categoria) {
            console.log("La categoría no existe o está inactiva.");
            break;
          }

          const resultado = await productos.insertOne({
            nombre,
            marca,
            precio,
            stock,
            categoria_id: categoria._id,
            presentacion: {
              volumen_ml: 750,
              tipo_botella: "Estándar"
            },
            activo: true,
            fecha_creacion: new Date()
          });

          console.log(
            "Producto creado. ID:",
            resultado.insertedId.toString()
          );
          break;
        }

        case "3": {
          const id = (
            await rl.question("ID del producto: ")
          ).trim();

          if (!ObjectId.isValid(id)) {
            console.log("ID inválido.");
            break;
          }

          const precio = Number(
            await rl.question("Nuevo precio: ")
          );

          const stock = Number(
            await rl.question("Nuevo stock: ")
          );

          if (
            !Number.isFinite(precio) ||
            precio <= 0 ||
            !Number.isInteger(stock) ||
            stock < 0
          ) {
            console.log("Precio o stock inválido.");
            break;
          }

          const resultado = await productos.updateOne(
            {
              _id: new ObjectId(id),
              activo: true
            },
            {
              $set: {
                precio,
                stock,
                fecha_actualizacion: new Date()
              }
            }
          );

          console.log(
            resultado.matchedCount
              ? "Producto actualizado."
              : "No se encontró un producto activo con ese ID."
          );
          break;
        }

        case "4": {
          const id = (
            await rl.question("ID del producto a desactivar: ")
          ).trim();

          if (!ObjectId.isValid(id)) {
            console.log("ID inválido.");
            break;
          }

          const resultado = await productos.updateOne(
            {
              _id: new ObjectId(id),
              activo: true
            },
            {
              $set: {
                activo: false,
                fecha_actualizacion: new Date()
              }
            }
          );

          console.log(
            resultado.modifiedCount
              ? "Producto desactivado mediante baja lógica."
              : "No se encontró un producto activo con ese ID."
          );
          break;
        }

        case "0":
          salir = true;
          break;

        default:
          console.log("Opción no válida.");
      }
    }
  } finally {
    await closeConnection();
    rl.close();
  }
}

main().catch(error => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});
