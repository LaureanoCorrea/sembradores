const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");
const DataDao = require("../daos/data.dao");

class UploadController {
  // Método para manejar la subida de archivos CSV
  uploadCSV = async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se ha proporcionado ningún archivo CSV" });
      }

      // Extraer ciclo y semana desde el cuerpo de la solicitud
      const { ciclo, semana } = req.body;

      // Ruta del archivo CSV y ruta para guardar el archivo JSON
      const csvFilePath = req.file.path;
      const jsonFilePath = path.join(
        __dirname,
        "../../uploads",
        `${path.parse(req.file.filename).name}.json`
      );

      // Convertir archivo CSV a JSON
      const jsonArray = await this.convertCSVToJsonArray(csvFilePath);

      // Agrupar pedidos y asesores desde el archivo JSON
      const pedidosAgrupados = this.groupPedidos(jsonArray);
      const asesoresAgrupados = this.groupAsesores(pedidosAgrupados);

      // Filtrar asesores válidos para guardar en la base de datos
      const asesoresArray = Object.values(asesoresAgrupados).filter(
        (asesor) =>
          asesor.Pedidos &&
          asesor.Pedidos.length > 0 &&
          asesor["Nivel de Alianza Categoria"] !== "Nivel de Alianza Categoria"
      );

      // Verificar si hay datos válidos para guardar
      if (asesoresArray.length === 0) {
        return res
          .status(400)
          .json({ message: "No hay datos válidos para guardar" });
      }

      // Objeto para guardar en la base de datos y en archivo JSON
      const documentObject = {
        ciclo,
        semana,
        Asesores: asesoresArray,
      };

      // Eliminar registros antiguos de la base de datos para el ciclo y semana dados
      await this.deleteOldRecords(ciclo, semana);

      // Guardar datos en la base de datos
      await this.saveToDatabase(documentObject);

      // Guardar archivo JSON con los datos procesados
      await this.saveJsonFile(jsonFilePath, documentObject);

      // Eliminar archivos temporales CSV y JSON después de procesarlos
      this.deleteFileIfExists(csvFilePath);
      this.deleteFileIfExists(jsonFilePath);

      // Redireccionar a la página de órdenes con ciclo y semana especificados
      res.redirect(`/Orders?ciclo=${ciclo}&semana=${semana}`);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      res
        .status(500)
        .json({ message: `Error al procesar el archivo: ${error.message}` });
    }
  };
  // Borrar archivos de la carpeta Uploads luego de subirlos
  deleteFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Archivos eliminados luego de ser procesados`);
    } else {
      console.log(`El archivo ya ha sido eliminado o movido: ${filePath}`);
    }
  };

  // Método para convertir un archivo CSV a un array de objetos JSON
  convertCSVToJsonArray = async (csvFilePath) => {
    return await csvtojson({
      delimiter: ";", // Delimitador utilizado en el archivo CSV
      noheader: true, // Indica que el archivo CSV no tiene fila de encabezado
    }).fromFile(csvFilePath);
  };

  // Método para agrupar pedidos basados en el número de pedido desde el JSON
  groupPedidos = (jsonArray) => {
    const pedidosAgrupados = {};
    jsonArray.forEach((fila) => {
      const nivelAlianza = fila.field3 ? fila.field3.trim() : "";
      const numeroPedido = fila.field4 ? fila.field4.trim() : "";
      const nombreAsesor = fila.field2 ? fila.field2.trim() : "";
      const codigoProducto = fila.field5 ? fila.field5.trim() : "";

      if (numeroPedido) {
        if (!pedidosAgrupados[numeroPedido]) {
          pedidosAgrupados[numeroPedido] = {
            "Número de Pedido": numeroPedido,
            Detalles: [],
            Nivel: nivelAlianza,
            Asesor: nombreAsesor,
            Timestamp: new Date(),
          };
        }

        if (codigoProducto) {
          const detalle = {
            "Codigo de Producto": codigoProducto,
            "Nombre de Producto": fila.field6 ? fila.field6.trim() : "",
            "Cantidad Unidades": parseInt(
              fila.field9 ? fila.field9.trim().replace(/\./g, "") : "0",
              10
            ),
            Puntos: parseInt(
              fila.field10 ? fila.field10.trim().replace(/\./g, "") : "0",
              10
            ),
            "Precio Público": this.convertToNumber(
              fila.field11 ? fila.field11.trim() : "0"
            ),
            "Precio x Unidades": this.convertToNumber(
              fila.field12 ? fila.field12.trim() : "0"
            ),
            "Precio x Nivel / Categoria": this.convertToNumber(
              fila.field13 ? fila.field13.trim() : "0"
            ),
            Ganancia: this.convertToNumber(
              fila.field14 ? fila.field14.trim() : "0"
            ),
          };

          pedidosAgrupados[numeroPedido].Detalles.push(detalle);
        }
      }
    });
    return pedidosAgrupados;
  };
  groupAsesores = (pedidosAgrupados) => {
    const asesoresAgrupados = {};
    Object.values(pedidosAgrupados).forEach((pedido) => {
      const nombreAsesor = pedido.Asesor;
      if (!asesoresAgrupados[nombreAsesor]) {
        asesoresAgrupados[nombreAsesor] = {
          Asesor: nombreAsesor,
          "Nivel de Alianza Categoria": pedido.Nivel,
          Pedidos: [],
        };
      }
      if (pedido.Detalles.length > 0) {
        asesoresAgrupados[nombreAsesor].Pedidos.push({
          "Número de Pedido": pedido["Número de Pedido"],
          Detalles: pedido.Detalles,
        });
      }
    });
    return asesoresAgrupados;
  };

  // Método para eliminar registros antiguos de la base de datos por ciclo y semana
  deleteOldRecords = async (ciclo, semana) => {
    try {
      const result = await DataDao.deleteByCicloAndSemana(ciclo, semana);
      console.log(
        `Registros eliminados para ciclo ${ciclo}, semana ${semana}:`,
        result
      );
    } catch (error) {
      throw new Error(`Error al eliminar registros antiguos: ${error.message}`);
    }
  };

  // Método para guardar datos en la base de datos
  saveToDatabase = async (documentObject) => {
    try {
      await DataDao.create(documentObject);
      console.log(
        `Pedidos guardados en la base de datos para ciclo ${documentObject.ciclo}, semana ${documentObject.semana}`
      );
    } catch (error) {
      throw new Error(`Error al guardar en la base de datos: ${error.message}`);
    }
  };

  // Método para convertir una cadena numérica en un número flotante
  convertToNumber = (number) => {
    const formattedNumber = number.replace(/\./g, "").replace(/\,/g, ".");
    return parseFloat(formattedNumber);
  };

  // Método para guardar un archivo JSON en el sistema de archivos
  saveJsonFile = async (filePath, data) => {
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log("Archivo JSON guardado correctamente.");
    } catch (error) {
      throw new Error(`Error al guardar el archivo JSON: ${error.message}`);
    }
  };
}

module.exports = new UploadController();
