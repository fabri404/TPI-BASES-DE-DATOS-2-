const { getDb, closeConnection } = require("./database");

async function main() {
  try {
    const db = await getDb();

    const productos = await db.collection("productos")
      .aggregate([
        {
          $match: { activo: true }
        },
        {
          $lookup: {
            from: "categorias",
            localField: "categoria_id",
            foreignField: "_id",
            as: "categoria"
          }
        },
        {
          $unwind: {
            path: "$categoria",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,
            nombre: 1,
            marca: 1,
            precio: 1,
            stock: 1,
            categoria: "$categoria.nombre",
            volumen_ml: "$presentacion.volumen_ml"
          }
        },
        {
          $sort: { nombre: 1 }
        }
      ])
      .toArray();

    console.log("Productos activos de la vinoteca:\n");
    console.table(productos);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await closeConnection();
  }
}

main();
