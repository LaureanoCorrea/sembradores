document.addEventListener("DOMContentLoaded", function () {
  function handleDelete() {
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
        updateSubtotals(); // <--- assumes this function is defined elsewhere
        Swal.fire("Eliminado!", "Producto eliminado correctamente.", "success");
      }
    });
  }

  function assignDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".delete-item");
    deleteButtons.forEach((button) => {
      button.removeEventListener("click", handleDelete);
      button.addEventListener("click", handleDelete);
    });
  }

  // Asignar event listeners al cargar la página
  assignDeleteListeners();
  // Exponer la función para que pueda ser llamada desde add.js
  window.assignDeleteListeners = assignDeleteListeners;
});
