document.addEventListener("DOMContentLoaded", function () {
  // Obtener valores de ciclo y semana
  const ciclo = document.querySelector(".numero-ciclo").textContent.trim();
  const semana = document.querySelector(".numero-semana").textContent.trim();

  document.getElementById("botonpdf").addEventListener("click", function () {
    document.getElementById("botonadd").style.display = "none";
    document.getElementById("botonpdf").style.display = "none";

    const asesorName = document.querySelector(".name").textContent.trim();
    const originalContainer = document.querySelector(".details-container");

    // Clonar la tabla original
    const clonedTable = originalContainer.cloneNode(true);

    // Eliminar la columna "Acciones" de la tabla clonada
    clonedTable.querySelectorAll("tr").forEach((row) => {
      if (row.cells.length > 8) {
        row.deleteCell(8); // Eliminar la novena celda
      }
    });

    // Aplicar estilos CSS a la tabla clonada
    clonedTable.style.fontSize = "10px"; // Ajustar el tamaño de fuente de toda la tabla
    clonedTable.querySelectorAll("th, td").forEach((cell) => {
      cell.style.fontSize = "10px"; // Tamaño de fuente para todas las celdas
      cell.style.whiteSpace = "nowrap"; // Evitar que el texto se divida en varias líneas
    });

    // Ajustar anchos de las columnas
    const css = `
      #clonedTable {
        table-layout: auto;
        width: 100%;
      }
      #clonedTable th:nth-child(1), #clonedTable td:nth-child(1) { width: 7%; } /* Código */
      #clonedTable th:nth-child(2), #clonedTable td:nth-child(2) { width: 22%; } /* Nombre de Producto */
      #clonedTable th:nth-child(3), #clonedTable td:nth-child(3) { width: 7%; } /* Cantidad Unidades */
      #clonedTable th:nth-child(4), #clonedTable td:nth-child(4) { width: 7%; } /* Puntos */
      #clonedTable th:nth-child(5), #clonedTable td:nth-child(5) { width: 12%; } /* Precio Público */
      #clonedTable th:nth-child(6), #clonedTable td:nth-child(6) { width: 12%; } /* Precio x Unidades */
      #clonedTable th:nth-child(7), #clonedTable td:nth-child(7) { width: 14%; } /* Precio x Nivel / Categoria */
      #clonedTable th:nth-child(8), #clonedTable td:nth-child(8) { width: 14%; } /* Ganancia */
    `;

    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Crear un contenedor temporal para la tabla clonada y agregar el nombre y nivel del asesor
    const tempContainer = document.createElement("div");
    const header = document.createElement("div");

    tempContainer.appendChild(header);
    clonedTable.id = "clonedTable";
    tempContainer.appendChild(clonedTable);

    // Configuración de html2pdf
    html2pdf()
      .from(tempContainer)
      .set({
        margin: [5, 5, 5, 5], // Márgenes: [arriba, derecha, abajo, izquierda]
        filename: `${asesorName}.pdf`, // Nombre del archivo con el nombre del asesor
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          logging: true,
          letterRendering: true,
          useCORS: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // Orientación vertical (portrait)
      })
      .toPdf()
      .get("pdf")
      .save()
      .then(() => {
        // Mostrar el nuevo botón y ocultar el botón add
        document.getElementById("botonadd").style.display = "none";
        document.getElementById("botonadvice").style.display = "inline";
      });
  });

  // Event listener for the new button to redirect to /orders
  document.getElementById("botonadvice").addEventListener("click", function () {
    window.location.href = `/orders?ciclo=${ciclo}&semana=${semana}`;
  });
});
