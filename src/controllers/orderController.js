const OrderDao = require("../daos/order.dao");
const DataDao = require("../daos/data.dao");

class OrderController {
  async getAdvisorNames(req, res) {
    try {
      const { ciclo, semana } = req.query;

      if (!ciclo || !semana) {
        return res.status(400).json({ message: "Ciclo y semana son requeridos" });
      }

      const orders = await DataDao.readByCicloAndSemana(ciclo, semana);
      if (!orders) {
        return res.render("orders", { advisorNames: [], ciclo, semana });
      }

      const advisorDcs = orders; // Los asesores están en el documento recuperado
      
      const advisorNames = advisorDcs.Asesores.map((asesor) => ({
        Asesor: asesor.Asesor,
        AsesorId: asesor._id,
        Pedidos: asesor.Pedidos.map((pedido) => ({
          NumeroPedido: pedido["Número de Pedido"],
        })),
      }));

      res.render("orders", { advisorNames, ciclo, semana });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  }

  async addItem (req, res){
    try {
      const { nombreProducto, cantidadUnidades, puntos, precioPublico } = req.body;
  
      // Lógica para guardar el nuevo producto en la base de datos
      const nuevoProducto = await DataDao.addItem(nombreProducto, cantidadUnidades, puntos, precioPublico);
  
      res.status(201).json({ message: "Producto agregado exitosamente", nuevoProducto });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      res.status(500).json({ message: "Hubo un problema al agregar el producto" });
    }
  }

  async getOrderDetails(req, res) {
    try {
      const { id } = req.params;
      const { ciclo, semana } = req.query;

      if (!ciclo || !semana) {
        return res.status(400).json({ message: "Ciclo y semana son requeridos" });
      }

      const orders = await DataDao.readByCicloAndSemana(ciclo, semana);

      // Find the specific advisor by id
      const advisor = orders.Asesores.find((a) => a._id.toString() === id);

      if (!advisor) {
        return res.status(404).json({ message: "Asesor no encontrado" });
      }

      // Compile all product details into one array
      const allProductDetails = advisor.Pedidos.flatMap((pedido) =>
        pedido.Detalles.map((detalle) => ({
          ...detalle.toObject(),
          AsesorId: advisor._id,
          PedidoId: pedido._id,
          NivelAsesor: advisor["Nivel de Alianza Categoria"], // Include the level of the advisor
        }))
      );

      res.render("orderDetails", {
        Asesor: advisor.Asesor,
        AsesorId: advisor._id,
        ciclo: orders.ciclo,
        semana: orders.semana,
        NivelAsesor: advisor["Nivel de Alianza Categoria"], // Include the level of the advisor
        Productos: allProductDetails,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Error fetching order details" });
    }
  }
  // Actualiza el pedido específico
  async editProductQuantity(req, res) {
    try {
      const { asesorId, pedidoId, productId } = req.params;
      const { nuevaCantidad, puntos } = req.body;

      // Actualizar la cantidad de unidades
      const productoActualizado = await DataDao.editProductQuantity(
        asesorId,
        pedidoId,
        productId,
        nuevaCantidad,
        puntos
      );

      if (!productoActualizado) {
        return res
          .status(404)
          .json({ message: "No se encontró el producto para actualizar." });
      }
      res
        .status(200)
        .json({
          message: "Producto actualizado exitosamente",
          productoActualizado,
        });
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      res
        .status(500)
        .json({ message: "Error al actualizar la cantidad del producto" });
    }
  }

  async removeProduct(req, res) {
    try {
      const { asesorId, pedidoId, productId } = req.params;

      const productoEliminado = await DataDao.removeProduct(
        asesorId,
        pedidoId,
        productId
      );
      if (!productoEliminado) {
        return res
          .status(404)
          .json({ message: "No se encontró el producto para eliminar." });
      }

      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar el producto catch controller:", error);
    }
  }
}

module.exports = new OrderController();
