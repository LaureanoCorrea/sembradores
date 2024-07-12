document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-item");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");

      // Mostrar una confirmación antes de eliminar
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Eliminar la fila de la tabla
          row.remove();
          // Llamar a la función de actualización de subtotales
          updateSubtotals();
          Swal.fire("Eliminado!", "Producto eliminado correctamente.", "success");
        }
      });
    });
  });
});
