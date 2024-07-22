document.getElementById("botoncsv").addEventListener("click", function () {
    Swal.fire({
      title: "Información del CSV",
      html: `
        <form id="modalForm">
          <label for="ciclo">Ciclo:</label>
          <input type="text" id="ciclo" name="ciclo" required>
          <label for="semana">Semana:</label>
          <input type="text" id="semana" name="semana" required>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Subir CSV",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        const ciclo = document.getElementById("ciclo").value;
        const semana = document.getElementById("semana").value;
        if (!ciclo || !semana) {
          Swal.showValidationMessage("Por favor ingrese el ciclo y la semana.");
          return false;
        }
        return { ciclo, semana };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { ciclo, semana } = result.value;
        document.getElementById("cicloInput").value = ciclo;
        document.getElementById("semanaInput").value = semana;
        document.getElementById("fileInput").click();
      }
    });
  });
  
  document.getElementById("fileInput").addEventListener("change", function () {
    if (this.files.length > 0) {
      document.getElementById("uploadForm").submit();
    }
  });
  