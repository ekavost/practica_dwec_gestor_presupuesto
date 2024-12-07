"use strict";

import * as gestionPresupuesto from "./gestionPresupuesto.js";

let controlesPrincipales = document.querySelector("#controlesprincipales");
let plantillaFormulario = document.querySelector("#formulario-template").content.cloneNode(true);
let formulario = plantillaFormulario.querySelector("form");

let btnActualizarPresupuesto = document.querySelector("#actualizarpresupuesto");
let btnAnyadirGasto = document.querySelector("#anyadirgasto");
let btnActualizarGastoForm = document.querySelector("#anyadirgasto-formulario");

btnActualizarPresupuesto.addEventListener("click", actualizarPresupuestoWeb);
btnAnyadirGasto.addEventListener("click", nuevoGastoWeb);
btnActualizarGastoForm.addEventListener("click", nuevoGastoWebFormulario);

function nuevoGastoWebFormulario() {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let descripcion = this.descripcion.value;
    let valor = Number(this.valor.value);
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
  controlesPrincipales.after(plantillaFormulario);
}
function mostrarDatoEnId(valor, idElemento) {
  document.getElementById(idElemento).innerHTML = valor;
}
function mostrarGastoWeb(idElemento, gasto) {
  let doc = document.getElementById(idElemento);

  let divGasto = document.createElement("div");
  divGasto.className = "gasto";
  doc.append(divGasto);

  let divDescripcion = document.createElement("div");
  divDescripcion.className = "gasto-descripcion";
  divDescripcion.innerText = gasto.descripcion;

  let divFecha = document.createElement("div");
  divFecha.className = "gasto-fecha";
  divFecha.innerText = new Date(gasto.fecha).toLocaleDateString();

  let divValor = document.createElement("div");
  divValor.className = "gasto-valor";
  divValor.innerText = gasto.valor;

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

  divGasto.append(divDescripcion, divFecha, divValor, divEtiquetas);

  let btnEdit = document.createElement("button");
  btnEdit.setAttribute("type", "button");
  btnEdit.textContent = "Editar";
  btnEdit.className = "gasto-editar";

  let btnRemove = document.createElement("button");
  btnRemove.setAttribute("type", "button");
  btnRemove.textContent = "Borrar";
  btnRemove.className = "gasto-borrar";

  let btnEditForm = document.createElement("button");
  btnEditForm.setAttribute("type", "button");
  btnEditForm.textContent = "Editar (formulario)";
  btnEditForm.className = "gasto-editar-formulario";

  let gastoAEditar = new EditarHandle();
  gastoAEditar.gasto = gasto;

  let gastoABorrar = new BorrarHandle();
  gastoABorrar.gasto = gasto;

  let gastoAEditarEnForm = new EditarHandleformulario();
  gastoAEditarEnForm.gasto = gasto;
  gastoAEditarEnForm.div = divGasto;
  gastoAEditarEnForm.btnSubmit = btnEditForm;

  btnEditForm.addEventListener("click", gastoAEditarEnForm);
  divEtiquetas.after(btnEditForm);

  btnEdit.addEventListener("click", gastoAEditar);
  btnEditForm.after(btnEdit);

  btnRemove.addEventListener("click", gastoABorrar);
  btnEdit.after(btnRemove);
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
function EditarHandleformulario() {
  this.handleEvent = function () {
    this.div.append(plantillaFormulario);
    this.btnSubmit.setAttribute("disabled", "true");
    formulario.descripcion.value = this.gasto.descripcion;
    formulario.valor.value = this.gasto.valor;
    formulario.fecha.value = new Date(this.gasto.fecha).toISOString().substring(0, 10);
    formulario.etiquetas.value = this.gasto.etiquetas;

    let gastoEditado = new GastoEditado();
    gastoEditado.gasto = this.gasto;

    let formACancelar = new CancelarForm();
    formACancelar.formulario = formulario;
    formACancelar.activarBtn = this.btnSubmit;

    formulario.addEventListener("submit", gastoEditado);

    let btnCancelarForm = formulario.querySelector("button.cancelar");
    btnCancelarForm.addEventListener("click", formACancelar);

    function GastoEditado() {
      this.handleEvent = function () {
        this.gasto.actualizarDescripcion(formulario.descripcion.value);
        this.gasto.actualizarValor(+formulario.valor.value);
        this.gasto.actualizarFecha(formulario.fecha.value);
        this.gasto.anyadirEtiquetas(...formulario.etiquetas.value.split(","));
        repintar();
      };
    }
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

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
