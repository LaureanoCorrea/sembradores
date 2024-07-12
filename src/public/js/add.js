document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("botonadd");

  addButton.addEventListener("click", function () {
    // Obtener el nivel del asesor de la primera fila (puedes ajustar esto según tus necesidades)
    const firstRow = document.querySelector("#order_details_table tbody tr");
    const nivelAsesor = firstRow
      ? firstRow.getAttribute("data-nivel-asesor")
      : null;

    // Mostrar el modal para agregar un nuevo producto
    Swal.fire({
      title: "Agregar Nuevo Producto",
      html: `
            <form id="modalForm">
                <label for="nombreProducto">Nombre de Producto:</label>
                <input type="text" id="nombreProducto" name="nombreProducto" required>
                <label for="cantidadUnidades">Cantidad de Unidades:</label>
                <input type="number" id="cantidadUnidades" name="cantidadUnidades" required>
                <label for="puntos">Puntos:</label>
                <input type="number" id="puntos" name="puntos" required>
                <label for="precioPublico">Precio Público:</label>
                <input type="number" id="precioPublico" name="precioPublico" required>
            </form>
        `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const nombreProducto = document.getElementById("nombreProducto").value;
        const cantidadUnidades =
          document.getElementById("cantidadUnidades").value;
        const puntos = document.getElementById("puntos").value;
        const precioPublico = document.getElementById("precioPublico").value;
        return { nombreProducto, cantidadUnidades, puntos, precioPublico };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombreProducto, cantidadUnidades, puntos, precioPublico } =
          result.value;

        // Calcular precios y ganancias en base al nivel del asesor
        let precioPorUnidades =
          parseFloat(precioPublico) * parseInt(cantidadUnidades);
        let precioPorNivel;
        let ganancia;

        if (parseInt(puntos) === 0) {
          // Si puntos es igual a 0, precioPorNivel = precioPorUnidades y ganancia = 0
          precioPorNivel = precioPorUnidades;
          ganancia = 0;
        } else {
          // Calcular precioPorNivel según el nivel del asesor
          switch (nivelAsesor) {
            case "Pedido Asesor Plata":
              precioPorNivel =
                parseFloat(precioPublico) * 0.7 * parseInt(cantidadUnidades);
              break;
            case "Pedido Asesor Oro":
              precioPorNivel =
                parseFloat(precioPublico) * 0.65 * parseInt(cantidadUnidades);
              break;
            case "Pedido Coordinador":
              precioPorNivel =
                parseFloat(precioPublico) *
                0.65 *
                0.9 *
                parseInt(cantidadUnidades);
              break;
            default:
              precioPorNivel = precioPorUnidades;
              break;
          }
          ganancia = precioPorUnidades - precioPorNivel;
        }

        // Agregar el nuevo producto a la tabla sin enviarlo al servidor
        const tableBody = document.querySelector("#order_details_table tbody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td></td>
            <td>${nombreProducto}</td>
            <td class="cantidad-unidades">${cantidadUnidades}</td>
            <td class="puntos">${puntos}</td>
            <td class="precio-publico">${parseFloat(precioPublico).toFixed(
              2
            )}</td>
            <td class="precio-x-unidades">${precioPorUnidades.toFixed(2)}</td>
            <td class="precio-x-nivel">${precioPorNivel.toFixed(2)}</td>
            <td class="ganancia">${ganancia.toFixed(2)}</td>
            <td>
              <button class="edit-item" data-item="">Editar</button>
              <button class="delete-item" data-item="">Eliminar</button>
            </td>
          `;

        newRow.setAttribute("data-nivel-asesor", nivelAsesor);
        tableBody.appendChild(newRow);

        // Actualizar los totales
        updateSubtotals();
      }
    });
  });

  function updateSubtotals() {
    const rows = document.querySelectorAll("#order_details_table tbody tr");
    let totalCantidad = 0;
    let totalPuntos = 0;
    let totalPrecioPublico = 0;
    let totalPrecioUnidades = 0;
    let totalPrecioNivel = 0;
    let totalGanancia = 0;

    rows.forEach((row) => {
      const cantidad = parseInt(
        row.querySelector(".cantidad-unidades").textContent.trim()
      );
      const puntos = parseFloat(
        row.querySelector(".puntos").textContent.trim()
      );
      const precioPublico = parseFloat(
        row.querySelector(".precio-publico").textContent.trim()
      );
      const precioUnidades = parseFloat(
        row.querySelector(".precio-x-unidades").textContent.trim()
      );
      const precioNivel = parseFloat(
        row.querySelector(".precio-x-nivel").textContent.trim()
      );
      const ganancia = parseFloat(
        row.querySelector(".ganancia").textContent.trim()
      );

      totalCantidad += cantidad;
      totalPuntos += puntos;
      totalPrecioPublico += precioPublico * cantidad;
      totalPrecioUnidades += precioUnidades;
      totalPrecioNivel += precioNivel;
      totalGanancia += ganancia;
    });

    document.getElementById("total-cantidad").textContent = totalCantidad;
    document.getElementById("total-puntos").textContent =
      totalPuntos.toFixed(0);
    document.getElementById("total-precio-publico").textContent =
      totalPrecioPublico.toFixed(2);
    document.getElementById("total-precio-unidades").textContent =
      totalPrecioUnidades.toFixed(2);
    document.getElementById("total-precio-nivel").textContent =
      totalPrecioNivel.toFixed(2);
    document.getElementById("total-ganancia").textContent =
      totalGanancia.toFixed(2);
  }
});
