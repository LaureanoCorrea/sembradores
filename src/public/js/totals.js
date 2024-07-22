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
    const cantidadUnidades = parseFloat(row.querySelector(".unidades").textContent.trim().replace(',', ''));
    const puntos = parseFloat(row.querySelector(".puntos").textContent.trim().replace(',', ''));
    const precioPublico = parseFloat(row.querySelector(".pPublico").textContent.trim().replace(',', ''));
    const nivelAsesor = row.dataset.nivelAsesor;

    const precioXUnidades = cantidadUnidades * precioPublico;

    const { precioPorNivel, ganancia } = calculatePriceAndProfit(precioPublico, cantidadUnidades, nivelAsesor, puntos);

    row.querySelector(".pUnidades").textContent = formatCurrency(precioXUnidades);
    row.querySelector(".pPublico").textContent = formatCurrency(precioPublico);
    row.querySelector(".puntos").textContent = (puntos);
    row.querySelector(".ganancia").textContent = formatCurrency(ganancia);
    row.querySelector(".pNivel").textContent = formatCurrency(precioPorNivel);

    totalCantidad += cantidadUnidades;
    totalPuntos += puntos;
    totalPrecioPublico += precioPublico;
    totalPrecioUnidades += precioXUnidades;
    totalGanancia += ganancia;
    totalPrecioNivel += precioPorNivel;
  });

  document.getElementById("tCantidad").textContent = (totalCantidad);
  document.getElementById("tPuntos").textContent = (totalPuntos);
  // document.getElementById("tPublico").textContent = formatCurrency(totalPrecioPublico);
  document.getElementById("tUnidades").textContent = formatCurrency(totalPrecioUnidades);
  document.getElementById("tGanancia").textContent = formatCurrency(totalGanancia);
  document.getElementById("tNivel").textContent = formatCurrency(totalPrecioNivel);
}

function calculatePriceAndProfit(precioPublico, cantidadUnidades, nivelAsesor, puntos) {
  let precioPorUnidades = precioPublico * cantidadUnidades;
  let precioPorNivel;
  let ganancia;

  if (parseFloat(puntos) === 0) {
    precioPorNivel = precioPorUnidades;
    ganancia = 0;
  } else {
    switch (nivelAsesor) {
      case "Pedido Asesor Plata":
        precioPorNivel = precioPublico * 0.7 * cantidadUnidades;
        break;
      case "Pedido Asesor Oro":
        precioPorNivel = precioPublico * 0.65 * cantidadUnidades;
        break;
      case "Pedido Coordinador":
        precioPorNivel = precioPublico * 0.65 * 0.9 * cantidadUnidades;
        break;
      default:
        precioPorNivel = precioPorUnidades;
        break;
    }
    ganancia = precioPorUnidades - precioPorNivel;
  }

  return { precioPorNivel, ganancia };
}

function formatCurrency(amount) {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  });
}

function formatNumber(number) {
  return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
