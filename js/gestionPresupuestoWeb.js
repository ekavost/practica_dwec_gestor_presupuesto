"use strict";
import * as gestionPresupuesto from "./gestionPresupuesto.js";

document.getElementById("actualizarpresupuesto").addEventListener("click", actualizarPresupuestoWeb);
document.getElementById("anyadirgasto").addEventListener("click", nuevoGastoWeb);

function mostrarDatoEnId(valor, idElemento) {
  document.getElementById(idElemento).innerHTML = valor;
}
function mostrarGastoWeb(idElemento, gasto) {
  // TODO
  let doc = document.getElementById(idElemento);

  let divGasto = document.createElement("div");
  divGasto.className = "gasto";
  doc.append(divGasto);

  let divDescripcion = document.createElement("div");
  divDescripcion.className = "gasto-descripcion";
  divDescripcion.innerText = gasto.descripcion;
  divGasto.append(divDescripcion);

  let divFecha = document.createElement("div");
  divFecha.className = "gasto-fecha";
  divFecha.innerText = new Date(gasto.fecha).toLocaleDateString();
  divGasto.append(divFecha);

  let divValor = document.createElement("div");
  divValor.className = "gasto-valor";
  divValor.innerText = gasto.valor;
  divGasto.append(divValor);

  let divEtiquetas = document.createElement("div");
  divEtiquetas.className = "gasto-etiquetas";
  for (const etiqueta of gasto.etiquetas) {
    let spanEtiqueta = document.createElement("span");
    spanEtiqueta.className = "gasto-etiquetas-etiqueta";
    spanEtiqueta.innerText = etiqueta + " ";
    divEtiquetas.append(spanEtiqueta);
  }
  divGasto.append(divEtiquetas);
}
function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
  let doc = document.getElementById(idElemento);

  let divGrupo = document.createElement("div");
  divGrupo.className = "agrupacion";
  doc.append(divGrupo);

  let titulo = document.createElement("h1");
  titulo.innerText = "Gastos agrupados por " + periodo;
  divGrupo.append(titulo);

  for (const key in agrup) {
    let divAgrupGastos = document.createElement("div");
    divAgrupGastos.className = "agrupacion-dato";

    let spanNombre = document.createElement("span");
    spanNombre.className = "agrupacion-dato-clave";
    spanNombre.innerText = key + ": ";
    divAgrupGastos.append(spanNombre);

    let spanValor = document.createElement("span");
    spanValor.className = "agrupacion-dato-valor";
    spanValor.innerText = agrup[key].toFixed(2);
    divAgrupGastos.append(spanValor);
    divGrupo.append(divAgrupGastos);
  }
}
function repintar() {
  mostrarDatoEnId(gestionPresupuesto.mostrarPresupuesto(), "presupuesto");
  mostrarDatoEnId(gestionPresupuesto.calcularTotalGastos(), "gastos-totales");
  mostrarDatoEnId(gestionPresupuesto.calcularBalance(), "balance-total");

  document.getElementById("listado-gastos-completo").innerHTML = "";

  for (const gasto of gestionPresupuesto.listarGastos()) {
    mostrarGastoWeb("listado-gastos-completo", gasto);
  }
}
function actualizarPresupuestoWeb() {
  let newPresupuesto = Number(prompt("Introduce un presupuesto"));
  gestionPresupuesto.actualizarPresupuesto(newPresupuesto);
  repintar();
}
function nuevoGastoWeb() {
  let descripcion = prompt("Descripción");
  let valor = Number(prompt("Valor"));
  let fecha = prompt("Fecha");
  let etiquetas = prompt("Etiquetas").split(", ");

  let newGasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);

  gestionPresupuesto.anyadirGasto(newGasto);
  repintar();
}
function EditarHandle() {
  // TODO
}
function BorrarHandle() {
  // TODO
}
function BorrarEtiquetasHandle() {
  // TODO
}
export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
