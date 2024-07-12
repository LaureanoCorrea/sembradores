document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-item");

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const productId = this.getAttribute("data-item");
      const asesorId = row.getAttribute("data-asesor-id");
      const pedidoId = row.getAttribute("data-pedido-id");
      const cantidadActual = parseFormattedNumber(row.querySelector(".cantidad-unidades").textContent.trim());
      const puntosActual = parseFormattedNumber(row.querySelector(".puntos").textContent.trim());
      const nivelAsesor = row.getAttribute("data-nivel-asesor");
      const precioPublicoUnitario = parseFormattedNumber(row.querySelector(".precio-publico").textContent.trim());

      // Mostrar el formulario de edición
      Swal.fire({
        title: "Editar Ítem",
        html: `
            <form id="modalForm">
                <label for="cantidadUnidades">Cantidad de Unidades:</label>
                <input type="number" id="cantidadUnidades" name="cantidadUnidades" value="${cantidadActual}" inputmode="numeric" pattern="[0-9]*" required>
                <label for="puntos">Puntos:</label>
                <input type="number" id="puntos" name="puntos" value="${puntosActual}" inputmode="numeric" pattern="[0-9]*" required>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: () => {
          const cantidadUnidades = document.getElementById("cantidadUnidades").value;
          const puntos = document.getElementById("puntos").value;

          // Validar que los valores sean numéricos
          if (!/^\d+(\.\d+)?$/.test(cantidadUnidades) || !/^\d+(\.\d+)?$/.test(puntos)) {
            Swal.showValidationMessage("Por favor, ingrese solo valores numéricos.");
            return false;
          }

          return { cantidadUnidades, puntos };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { cantidadUnidades, puntos } = result.value;

          // Actualizar en la interfaz primero
          row.querySelector(".cantidad-unidades").textContent = formatNumber(parseFloat(cantidadUnidades));
          row.querySelector(".puntos").textContent = formatNumber(parseFloat(puntos));

          // Calcular precios y ganancias en base a los datos en la interfaz
          let precioPorUnidades = precioPublicoUnitario * parseFloat(cantidadUnidades);
          let precioPorNivel;
          let ganancia;

          if (parseFloat(puntos) === 0) {
            // Si puntos es igual a 0, precioPorNivel = precioPorUnidades y ganancia = 0
            precioPorNivel = precioPorUnidades;
            ganancia = 0;
          } else {
            // Calcular precioPorNivel según el nivel del asesor
            switch (nivelAsesor) {
              case "Pedido Asesor Plata":
                precioPorNivel = precioPublicoUnitario * 0.7 * parseFloat(cantidadUnidades);
                break;
              case "Pedido Asesor Oro":
                precioPorNivel = precioPublicoUnitario * 0.65 * parseFloat(cantidadUnidades);
                break;
              case "Pedido Coordinador":
                precioPorNivel = precioPublicoUnitario * 0.65 * 0.9 * parseFloat(cantidadUnidades);
                break;
              default:
                precioPorNivel = parseFormattedNumber(row.querySelector(".precio-x-nivel").textContent.trim().replace(/\./g, '').replace(',', '.'));
                break;
            }

            ganancia = precioPorUnidades - precioPorNivel;
          }

          // Actualizar en la interfaz
          row.querySelector(".precio-x-unidades").textContent = formatCurrency(precioPorUnidades);
          row.querySelector(".precio-x-nivel").textContent = formatCurrency(precioPorNivel);
          row.querySelector(".ganancia").textContent = formatCurrency(ganancia);

          // Llamar a la función de actualización de totales
          updateSubtotals();
        }
      });
    });
  });
});

function parseFormattedNumber(value) {
  return parseFloat(value.replace(/\./g, '').replace(',', '.'));
}

function formatNumber(number) {
  return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrency(amount) {
  return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}