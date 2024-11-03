import {
  mostrarPresupuesto,
  actualizarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  filtrarGastos,
  agruparGastos,
} from "./gestionPresupuesto.js";

import { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb } from "./gestionPresupuestoWeb.js";

let newPresupuesto = actualizarPresupuesto(1500);
let stringPresupuesto = mostrarPresupuesto(newPresupuesto);
mostrarDatoEnId(stringPresupuesto, "presupuesto");

let gasto1 = new CrearGasto("Compra carne", 23.44, "2021-10-06", "casa", "comida");
let gasto2 = new CrearGasto("Compra fruta y verdura", 14.25, "2021-09-06", "supermercado", "comida");
let gasto3 = new CrearGasto("Bonobús", 18.6, "2020-05-26", "transporte");
let gasto4 = new CrearGasto("Gasolina", 60.42, "2021-10-08", "transporte", "gasolina");
let gasto5 = new CrearGasto("Seguro hogar", 206.45, "2021-09-26", "casa", "seguros");
let gasto6 = new CrearGasto("Seguro coche", 195.78, "2021-10-06", "transporte", "seguros");

anyadirGasto(gasto1);
anyadirGasto(gasto2);
anyadirGasto(gasto3);
anyadirGasto(gasto4);
anyadirGasto(gasto5);
anyadirGasto(gasto6);

let totalGastos = calcularTotalGastos();
mostrarDatoEnId(totalGastos.toFixed(2), "gastos-totales");

let totalBalance = calcularBalance();
mostrarDatoEnId(totalBalance.toFixed(2), "balance-total");

let listaCompletoGastos = listarGastos();
for (const gasto of listaCompletoGastos) {
  mostrarGastoWeb("listado-gastos-completo", gasto);
}

let listaGastosFiltro1 = filtrarGastos({ fechaDesde: "2021-09-01", fechaHasta: "2021-09-30" });
for (const gasto of listaGastosFiltro1) {
  mostrarGastoWeb("listado-gastos-filtrado-1", gasto);
}

let listaGastosFiltro2 = filtrarGastos({ valorMinimo: 50 });
for (const gasto of listaGastosFiltro2) {
  mostrarGastoWeb("listado-gastos-filtrado-2", gasto);
}

let listaGastosFiltro3 = filtrarGastos({ valorMinimo: 200, etiquetas: ["seguro"] });
for (const gasto of listaGastosFiltro3) {
  mostrarGastoWeb("listado-gastos-filtrado-3", gasto);
}

let listaGastosFiltro4 = filtrarGastos({ valorMaximo: 50, etiquetas: ["comida", "transporte"] });
for (const gasto of listaGastosFiltro4) {
  mostrarGastoWeb("listado-gastos-filtrado-4", gasto);
}

let gastosAgrupDia = agruparGastos("dia");
mostrarGastosAgrupadosWeb("agrupacion-dia", gastosAgrupDia, "día");
let gastosAgrupMes = agruparGastos("mes");
mostrarGastosAgrupadosWeb("agrupacion-mes", gastosAgrupMes, "mes");
let gastosAgrupAnyo = agruparGastos("anyo");
mostrarGastosAgrupadosWeb("agrupacion-anyo", gastosAgrupAnyo, "año");
