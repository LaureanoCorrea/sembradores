document.addEventListener("DOMContentLoaded", function () {
  function handleEdit() {
    const row = this.closest("tr");
    const cantidadActual = parseFloat(
      row.querySelector(".unidades").textContent.trim().replace(",", "")
    );
    const puntosActual = parseFloat(
      row.querySelector(".puntos").textContent.trim().replace(",", "")
    );
    const nivelAsesor = row.getAttribute("data-nivel-asesor");
    const precioPublicoUnitario = parseFloat(
      row.querySelector(".pPublico").textContent.trim().replace(",", "")
    );

    Swal.fire({
      title: "Editar Ítem",
      html: `
          <form id="modalForm">
            <label for="cantidadUnidades">Cantidad de Unidades:</label>
            <input type="number" id="cantidadUnidades" name="cantidadUnidades" value="${cantidadActual}" required>
            <label for="puntos">Puntos:</label>
            <input type="number" id="puntos" name="puntos" value="${puntosActual}" required>
          </form>
        `,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const cantidadUnidades =
          document.getElementById("cantidadUnidades").value;
        const puntos = document.getElementById("puntos").value;

        if (
          !/^\d+(\.\d+)?$/.test(cantidadUnidades) ||
          !/^\d+(\.\d+)?$/.test(puntos)
        ) {
          Swal.showValidationMessage(
            "Por favor, ingrese solo valores numéricos."
          );
          return false;
        }

        return { cantidadUnidades, puntos };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { cantidadUnidades, puntos } = result.value;

        row.querySelector(".unidades").textContent =
          parseFloat(cantidadUnidades);
        row.querySelector(".puntos").textContent = parseFloat(puntos);

        updateSubtotals();
      }
    });
  }

  function assignEditListeners() {
    const editButtons = document.querySelectorAll(".edit-item");
    editButtons.forEach((button) => {
      button.removeEventListener("click", handleEdit);
      button.addEventListener("click", handleEdit);
    });
  }

  // Asignar event listeners al cargar la página
  assignEditListeners();
  // Exponer la función para que pueda ser llamada desde add.js
  window.assignEditListeners = assignEditListeners;
});
