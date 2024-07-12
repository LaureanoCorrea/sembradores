document.addEventListener("DOMContentLoaded", function () {
  updateSubtotals();
});

function updateSubtotals() {
  let totalCantidad = 0;
  let totalPuntos = 0;
  let totalPrecioPublico = 0;
  let totalPrecioUnidades = 0;
  let totalGanancia = 0;
  let totalPrecioNivel = 0;

  const rows = document.querySelectorAll("#order_details_table tbody tr");

  rows.forEach((row) => {
    totalCantidad += parseFloat(parseFormattedNumber(row.querySelector(".cantidad-unidades").textContent.trim()));
    totalPuntos += parseFloat(parseFormattedNumber(row.querySelector(".puntos").textContent.trim()));
    totalPrecioPublico += parseFloat(parseFormattedNumber(row.querySelector(".precio-publico").textContent.trim()));
    totalPrecioUnidades += parseFloat(parseFormattedNumber(row.querySelector(".precio-x-unidades").textContent.trim()));
    totalGanancia += parseFloat(parseFormattedNumber(row.querySelector(".ganancia").textContent.trim()));
    totalPrecioNivel += parseFloat(parseFormattedNumber(row.querySelector(".precio-x-nivel").textContent.trim()));
  });

  document.getElementById("total-cantidad").textContent = formatNumber(totalCantidad);
  document.getElementById("total-puntos").textContent = formatNumber(totalPuntos);
  document.getElementById("total-precio-publico").textContent = formatCurrency(totalPrecioPublico);
  document.getElementById("total-precio-unidades").textContent = formatCurrency(totalPrecioUnidades);
  document.getElementById("total-ganancia").textContent = formatCurrency(totalGanancia);
  document.getElementById("total-precio-nivel").textContent = formatCurrency(totalPrecioNivel);
}

function parseFormattedNumber(value) {
  // Reemplazar comas por puntos para los decimales y eliminar otros caracteres no numéricos
  const cleanedValue = value.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
  const number = parseFloat(cleanedValue);

  return isNaN(number) ? 0 : number;
}

function formatNumber(number) {
  // Formatear número con separador de miles usando coma
  return number.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: false,
  }).replace(/\./g, ',');
}

function formatCurrency(amount) {
  // Formatear cantidad monetaria con separador de miles usando coma y dos decimales
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
    useGrouping: true
  }).replace(/\./g, ',');
}
