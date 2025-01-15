"use strict";

import * as gestionPresupuesto from "./gestionPresupuesto.js";

const url = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/";
let username = document.getElementById("nombre_usuario");

let controlesPrincipales = document.querySelector("#controlesprincipales");
let btnActualizarPresupuesto = document.querySelector("#actualizarpresupuesto");
let btnAnyadirGasto = document.querySelector("#anyadirgasto");
let btnActualizarGastoForm = document.querySelector("#anyadirgasto-formulario");
let btnGuardarGastos = document.querySelector("#guardar-gastos");
let btnCargarGastos = document.querySelector("#cargar-gastos");
let btnCargarGastosApi = document.querySelector("#cargar-gastos-api");
let formFiltrado = document.querySelector("#formulario-filtrado");

btnActualizarPresupuesto.addEventListener("click", actualizarPresupuestoWeb);
btnAnyadirGasto.addEventListener("click", nuevoGastoWeb);
btnActualizarGastoForm.addEventListener("click", nuevoGastoWebFormulario);
btnGuardarGastos.addEventListener("click", guardarGastosWeb);
btnCargarGastos.addEventListener("click", cargarGastosWeb);
btnCargarGastosApi.addEventListener("click", cargarGastosApi);
formFiltrado.addEventListener("submit", filtrarGastosWeb);

function mostrarDatoEnId(valor, idElemento) {
  document.getElementById(idElemento).innerHTML = valor;
}

function mostrarGastoWeb(idElemento, gasto) {
  let doc = document.getElementById(idElemento);
  let divGasto = document.createElement("div");
  divGasto.className = "gasto";
  divGasto.innerHTML = `
  <div class="gasto-descripcion">${gasto.descripcion}</div>
  <div class="gasto-fecha">${new Date(gasto.fecha).toLocaleDateString()}</div> 
  <div class="gasto-valor">${gasto.valor}</div>`;
  doc.append(divGasto);

  let divEtiquetas = document.createElement("div");
  divEtiquetas.className = "gasto-etiquetas";
  for (const etiqueta of gasto.etiquetas) {
    let spanEtiqueta = document.createElement("span");
    spanEtiqueta.className = "gasto-etiquetas-etiqueta";
    spanEtiqueta.innerText = etiqueta + " ";
    divEtiquetas.append(spanEtiqueta);

    let etiquetaABorrar = new BorrarEtiquetasHandle();
    etiquetaABorrar.gasto = gasto;
    etiquetaABorrar.etiqueta = etiqueta;
    spanEtiqueta.addEventListener("click", etiquetaABorrar);
  }
  divGasto.append(divEtiquetas);

  let btnEdit = document.createElement("button");
  btnEdit.setAttribute("type", "button");
  btnEdit.textContent = "Editar";
  btnEdit.className = "gasto-editar";

  let btnRemove = document.createElement("button");
  btnRemove.setAttribute("type", "button");
  btnRemove.textContent = "Borrar";
  btnRemove.className = "gasto-borrar";

  let btnRemoveApi = document.createElement("button");
  btnRemoveApi.setAttribute("type", "button");
  btnRemoveApi.textContent = "Borrar (API)";
  btnRemoveApi.className = "gasto-borrar-api";

  let btnEditForm = document.createElement("button");
  btnEditForm.setAttribute("type", "button");
  btnEditForm.textContent = "Editar (formulario)";
  btnEditForm.className = "gasto-editar-formulario";

  divGasto.append(btnEdit, btnRemove, btnRemoveApi, btnEditForm);

  let gastoAEditar = new EditarHandle();
  gastoAEditar.gasto = gasto;

  let gastoABorrar = new BorrarHandle();
  gastoABorrar.gasto = gasto;

  let gastoABorrarApi = new BorrarHandleApi();
  gastoABorrarApi.gasto = gasto;

  let gastoAEditarEnForm = new EditarHandleformulario();
  gastoAEditarEnForm.gasto = gasto;
  gastoAEditarEnForm.div = divGasto;
  gastoAEditarEnForm.btnSubmit = btnEditForm;

  btnEditForm.addEventListener("click", gastoAEditarEnForm);
  btnEdit.addEventListener("click", gastoAEditar);
  btnRemove.addEventListener("click", gastoABorrar);
  btnRemoveApi.addEventListener("click", gastoABorrarApi);
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {
  let doc = document.getElementById(idElemento);
  let divGrupo = document.createElement("div");
  divGrupo.className = "agrupacion";
  divGrupo.innerHTML = `<h1>Gastos agrupados por ${periodo}</h1>`;
  doc.append(divGrupo);

  for (const key in agrup) {
    let divAgrupGastos = document.createElement("div");
    divAgrupGastos.className = "agrupacion-dato";
    divAgrupGastos.innerHTML = `
    <span class="agrupacion-dato-clave">${key + ": "}</span>
    <span class="agrupacion-dato-valor">${agrup[key].toFixed(2)}</span>
  </div>`;
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

function nuevoGastoWebFormulario() {
  let plantillaFormulario = document.querySelector("#formulario-template").content.cloneNode(true);
  let formulario = plantillaFormulario.querySelector("form");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let descripcion = this.descripcion.value;
    let valor = +this.valor.value;
    let fecha = this.fecha.value;
    let etiquetas = this.etiquetas.value.split(", ");

    let newGasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);
    gestionPresupuesto.anyadirGasto(newGasto);

    repintar();
    btnActualizarGastoForm.removeAttribute("disabled");
  });

  let formACancelar = new CancelarForm();
  formACancelar.formulario = formulario;
  formACancelar.activarBtn = this;

  let btnCancelarForm = formulario.querySelector("button.cancelar");
  btnCancelarForm.addEventListener("click", formACancelar);

  this.setAttribute("disabled", "true");
  controlesPrincipales.append(plantillaFormulario);
}

function EditarHandleformulario() {
  this.handleEvent = function () {
    let plantillaFormulario = document.querySelector("#formulario-template").content.cloneNode(true);
    let formulario = plantillaFormulario.querySelector("form");
    this.div.append(plantillaFormulario);

    this.btnSubmit.setAttribute("disabled", "true");

    formulario.descripcion.value = this.gasto.descripcion;
    formulario.valor.value = this.gasto.valor;
    formulario.fecha.value = new Date(this.gasto.fecha).toISOString().substring(0, 10);
    formulario.etiquetas.value = this.gasto.etiquetas;

    let gastoEditado = new EditarGasto();
    gastoEditado.gasto = this.gasto;
    gastoEditado.formulario = formulario;

    let formACancelar = new CancelarForm();
    formACancelar.formulario = formulario;
    formACancelar.activarBtn = this.btnSubmit;

    formulario.addEventListener("submit", gastoEditado);

    let btnCancelarForm = formulario.querySelector("button.cancelar");
    btnCancelarForm.addEventListener("click", formACancelar);
  };
}
function EditarHandle() {
  this.handleEvent = function () {
    let fechaAux = new Date(this.gasto.fecha);

    let descripcion = prompt("Descripción", this.gasto.descripcion);
    let valor = Number(prompt("Valor", this.gasto.valor));
    let fecha = prompt("Fecha", fechaAux.toLocaleDateString());
    let etiquetas = prompt("Etiquetas", this.gasto.etiquetas).split(", ");

    this.gasto.actualizarValor(valor);
    this.gasto.actualizarDescripcion(descripcion);
    this.gasto.actualizarFecha(fecha);
    this.gasto.anyadirEtiquetas(...etiquetas);
    repintar();
  };
}

function BorrarHandle() {
  this.handleEvent = function () {
    gestionPresupuesto.borrarGasto(this.gasto.id);
    repintar();
  };
}

function BorrarHandleApi() {
  this.handleEvent = async function () {
    const urlGasto = url + username.value + "/" + this.gasto.gastoId;
    await fetch(urlGasto, { method: "DELETE" });
    cargarGastosApi();
  };
}

function BorrarEtiquetasHandle() {
  this.handleEvent = function () {
    this.gasto.borrarEtiquetas(this.etiqueta);
    repintar();
  };
}

function CancelarForm() {
  this.handleEvent = function () {
    this.formulario.remove();
    this.activarBtn.removeAttribute("disabled");
  };
}

function EditarGasto() {
  this.handleEvent = function () {
    this.gasto.actualizarDescripcion(this.formulario.descripcion.value);
    this.gasto.actualizarValor(+this.formulario.valor.value);
    this.gasto.actualizarFecha(this.formulario.fecha.value);
    this.gasto.anyadirEtiquetas(...this.formulario.etiquetas.value.split(","));
    repintar();
  };
}

function filtrarGastosWeb(evento) {
  evento.preventDefault();

  let descripcion = document.getElementById("formulario-filtrado-descripcion").value;
  let valorMin = +document.getElementById("formulario-filtrado-valor-minimo").value;
  let valorMax = +document.getElementById("formulario-filtrado-valor-maximo").value;
  let desde = document.getElementById("formulario-filtrado-fecha-desde").value;
  let hasta = document.getElementById("formulario-filtrado-fecha-hasta").value;
  let etiquetas = document.getElementById("formulario-filtrado-etiquetas-tiene").value;

  if (etiquetas) {
    etiquetas = gestionPresupuesto.transformarListadoEtiquetas(etiquetas);
  }

  let filtros = {
    fechaDesde: desde,
    fechaHasta: hasta,
    valorMinimo: valorMin,
    valorMaximo: valorMax,
    descripcionContiene: descripcion,
    etiquetasTiene: etiquetas,
  };

  let gastosFiltrados = gestionPresupuesto.filtrarGastos(filtros);

  document.getElementById("listado-gastos-completo").innerHTML = "";
  for (const gasto of gastosFiltrados) {
    mostrarGastoWeb("listado-gastos-completo", gasto);
  }
}

function guardarGastosWeb() {
  let gastos = gestionPresupuesto.listarGastos();
  localStorage.setItem("GestorGastosDWEC", JSON.stringify(gastos));
}

function cargarGastosWeb() {
  let gastos = localStorage.getItem("GestorGastosDWEC");
  gestionPresupuesto.cargarGastos(gastos ? JSON.parse(gastos) : []);
  repintar();
}

async function cargarGastosApi() {
  const urlGastos = url + username.value;

  let response = await fetch(urlGastos);
  let gasto = await response.json();
  gestionPresupuesto.cargarGastos(gasto);
  repintar();
}

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
