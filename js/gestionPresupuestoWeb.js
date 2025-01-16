"use strict";

import * as gestionPresupuesto from "./gestionPresupuesto.js";

const urlApi = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/";
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
  let divGasto = createElement("div", "gasto");
  divGasto.innerHTML = `
  <div class="gasto-descripcion">${gasto.descripcion}</div>
  <div class="gasto-fecha">${new Date(gasto.fecha).toLocaleDateString()}</div> 
  <div class="gasto-valor">${gasto.valor}</div>`;
  doc.append(divGasto);

  let divEtiquetas = createElement("div", "gasto-etiquetas");
  for (const etiqueta of gasto.etiquetas) {
    let spanEtiqueta = createElement("span", "gasto-etiquetas-etiqueta", etiqueta + " ");
    divEtiquetas.append(spanEtiqueta);

    let etiquetaABorrar = new BorrarEtiquetasHandle();
    etiquetaABorrar.gasto = gasto;
    etiquetaABorrar.etiqueta = etiqueta;
    spanEtiqueta.addEventListener("click", etiquetaABorrar);
  }
  divGasto.append(divEtiquetas);

  let btnEdit = createElement("button", "gasto-editar", "Editar");
  btnEdit.setAttribute("type", "button");

  let btnRemove = createElement("button", "gasto-borrar", "Borrar");
  btnRemove.setAttribute("type", "button");

  let btnRemoveApi = createElement("button", "gasto-borrar-api", "Borrar (API)");
  btnRemoveApi.setAttribute("type", "button");

  let btnEditForm = createElement("button", "gasto-editar-formulario", "Editar (formulario)");
  btnEditForm.setAttribute("type", "button");

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
  let divGrupo = createElement("div", "agrupacion");
  divGrupo.innerHTML = `<h1>Gastos agrupados por ${periodo}</h1>`;
  doc.append(divGrupo);

  for (const key in agrup) {
    let divAgrupGastos = createElement("div", "agrupacion-dato");
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

  let btnEnviarGastoApi = formulario.querySelector("button.gasto-enviar-api");
  btnEnviarGastoApi.addEventListener("click", async function () {
    let descripcion = formulario.descripcion.value;
    let valor = +formulario.valor.value;
    let fecha = formulario.fecha.value;
    let etiquetas = formulario.etiquetas.value.split(", ");

    let newGasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...etiquetas);
    let urlGastos = urlApi + username.value;
    await fetch(urlGastos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGasto),
    });
    cargarGastosApi();
  });

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

    let formAEnviar = new EnviarFormApi();
    formAEnviar.formulario = formulario;
    formAEnviar.gasto = this.gasto;

    formulario.addEventListener("submit", gastoEditado);

    let btnCancelarForm = formulario.querySelector("button.cancelar");
    btnCancelarForm.addEventListener("click", formACancelar);

    let btnEnviarFormApi = formulario.querySelector("button.gasto-enviar-api");
    btnEnviarFormApi.addEventListener("click", formAEnviar);
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
    const urlGasto = urlApi + username.value + "/" + this.gasto.gastoId;
    try {
      const response = await fetch(urlGasto, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      cargarGastosApi();
    } catch (error) {
      console.error("Error al borrar el gasto:", error);
    }
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

function EnviarFormApi() {
  this.handleEvent = async function () {
    this.gasto.actualizarDescripcion(this.formulario.descripcion.value);
    this.gasto.actualizarValor(+this.formulario.valor.value);
    this.gasto.actualizarFecha(this.formulario.fecha.value);
    this.gasto.anyadirEtiquetas(...this.formulario.etiquetas.value.split(","));
    const urlGasto = urlApi + username.value + "/" + this.gasto.gastoId;

    try {
      const response = await fetch(urlGasto, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.gasto),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      cargarGastosApi();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
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
  const urlGastos = urlApi + username.value;
  try {
    let response = await fetch(urlGastos);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    let gasto = await response.json();
    gestionPresupuesto.cargarGastos(gasto);
    repintar();
  } catch (error) {
    console.error("Error al cargar los gastos:", error);
  }
}

function createElement(type, className, text = "") {
  let element = document.createElement(type);
  element.className = className;
  element.textContent = text;
  return element;
}

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
