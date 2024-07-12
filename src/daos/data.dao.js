const Data = require("../models/data.model");

class DataDao {
  async readById(asesorId) {
    try {
      // Buscamos el pedido con el pedidoId dado entre todos los asesores y sus pedidos
      const asesores = await Data.find();
      let pedidoEncontrado = null;
      asesores.forEach((asesor) => {
        asesor.Asesores.forEach((pedido) => {
          if (pedido._id.toString() === asesorId) {
            pedidoEncontrado = pedido;
          }
        });
      });

      if (!pedidoEncontrado) {
        throw new Error(`No se encontró un pedido con el ID ${asesorId}`);
      }

      return pedidoEncontrado;
    } catch (error) {
      console.error("Error al buscar pedido por pedidoId:", error);
      throw error;
    }
  }

  async addItem(asesorId, pedidoId, nuevoProducto) {
    try {
      const data = await Data.findOneAndUpdate(
        {
          "Asesores._id": asesorId,
          "Asesores.Pedidos._id": pedidoId,
        },
        {
          $push: {
            "Asesores.$.Pedidos.$[pedido].Detalles": nuevoProducto,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "pedido._id": pedidoId },
            { "asesor._id": asesorId },
          ],
        }
      );

      if (!data) {
        throw new Error(`No se encontró el pedido para agregar el producto.`);
      }

      return data.Asesores.id(asesorId)
        .Pedidos.id(pedidoId)
        .Detalles.find(
          (producto) => producto._id.toString() === nuevoProducto._id.toString()
        );
    } catch (error) {
      throw new Error(
        `Error al agregar el producto desde el dao: ${error.message}`
      );
    }
  }

  async create(data) {
    try {
      const newData = new Data(data);
      return await newData.save();
    } catch (error) {
      throw new Error(`Error al guardar en la base de datos: ${error.message}`);
    }
  }

  async readAll() {
    try {
      const data = await Data.find();
      return data;
    } catch (error) {
      throw new Error("Error al leer los datos: " + error.message);
    }
  }

  async readByCicloAndSemana(ciclo, semana) {
    try {
      const data = await Data.findOne({ ciclo, semana });

      if (!data) {
        throw new Error(
          `No se encontraron datos para el ciclo ${ciclo} y semana ${semana}`
        );
      }

      return data;
    } catch (error) {
      console.error("Error al buscar datos por ciclo y semana:", error);
      throw error;
    }
  }

  async editProductQuantity(
    asesorId,
    pedidoId,
    productId,
    nuevaCantidad,
    nuevosPuntos
  ) {
    try {
      const data = await Data.findOneAndUpdate(
        {
          "Asesores._id": asesorId,
          "Asesores.Pedidos._id": pedidoId,
          "Asesores.Pedidos.Detalles._id": productId,
        },
        {
          $set: {
            "Asesores.$[asesor].Pedidos.$[pedido].Detalles.$[detalle].Cantidad Unidades":
              nuevaCantidad,
            "Asesores.$[asesor].Pedidos.$[pedido].Detalles.$[detalle].Puntos":
              nuevosPuntos,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "asesor._id": asesorId },
            { "pedido._id": pedidoId },
            { "detalle._id": productId },
          ],
        }
      );

      if (!data) {
        throw new Error(`No se encontró el producto para actualizar.`);
      }

      return data.Asesores.id(asesorId)
        .Pedidos.id(pedidoId)
        .Detalles.id(productId);
    } catch (error) {
      throw new Error(
        `Error al actualizar el producto desde el dao: ${error.message}`
      );
    }
  }

  async removeProduct(asesorId, pedidoId, productId) {
    try {
      const data = await Data.findOneAndUpdate(
        { "Asesores._id": asesorId, "Asesores.Pedidos._id": pedidoId },
        {
          $pull: {
            "Asesores.$.Pedidos.$[pedido].Detalles": { _id: productId },
          },
        },
        { new: true, arrayFilters: [{ "pedido._id": pedidoId }] }
      );

      if (!data) {
        throw new Error(`No se encontró el producto para eliminar.`);
      }

      const productoEliminado = data.Asesores.id(asesorId)
        .Pedidos.id(pedidoId)
        .Detalles.id(productId);
      return !productoEliminado; // Devolver true si el producto ya no está
    } catch (error) {
      throw new Error(
        `Error al eliminar el producto desde el dao: ${error.message}`
      );
    }
  }

  async deleteByCicloAndSemana(ciclo, semana) {
    try {
      const result = await Data.deleteMany({ Ciclo: ciclo, Semana: semana });
      return result;
    } catch (error) {
      throw new Error(`Error al vaciar la base de datos: ${error.message}`);
    }
  }

  async vaciar() {
    try {
      const result = await Data.deleteMany({});
      return result;
    } catch (error) {
      throw new Error(`Error al vaciar la base de datos: ${error.message}`);
    }
  }
}

module.exports = new DataDao();
