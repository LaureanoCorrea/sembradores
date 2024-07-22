document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("botonadd");

  addButton.addEventListener("click", function () {
    const firstRow = document.querySelector("#order_details_table tbody tr");
    const nivelAsesor = firstRow
      ? firstRow.getAttribute("data-nivel-asesor")
      : null;

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

        const tableBody = document.querySelector("#order_details_table tbody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td></td>
            <td>${nombreProducto}</td>
            <td class="unidades">${parseFloat(cantidadUnidades)}</td>
            <td class="puntos">${parseFloat(puntos)}</td>
            <td class="pPublico">${parseFloat(precioPublico)}</td>
            <td class="pUnidades"></td>
            <td class="pNivel"></td>
            <td class="ganancia"></td>
            <td>
              <button class="edit-item" data-item="">Editar</button>
              <button class="delete-item" data-item="">Borrar</button>
            </td>
          `;

        newRow.setAttribute("data-nivel-asesor", nivelAsesor);
        tableBody.appendChild(newRow);

        assignEditListeners();
        assignDeleteListeners();

        updateSubtotals();
      }
    });
  });
});
