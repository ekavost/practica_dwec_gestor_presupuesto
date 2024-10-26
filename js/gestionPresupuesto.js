"use strict";

let presupuesto = 0;
let gastos = [];
let idGasto = 0;

let comprobarPositivo = (numero) =>
  Number.isFinite(numero) && numero >= 0 ? numero : false;
let ComprobarFecha = (fecha) => Date.parse(fecha);

function actualizarPresupuesto(valor) {
  if (!comprobarPositivo(valor)) {
    console.log("Valor no válida");
    return -1;
  } else return (presupuesto = valor);
}

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function listarGastos() {
  return gastos;
}

function anyadirGasto(gasto) {
  gasto.id = idGasto;
  idGasto++;
  gastos.push(gasto);
}

function borrarGasto(id) {
  gastos = gastos.filter((gasto) => gasto.id !== id);
}

function calcularTotalGastos() {
  return gastos.reduce((total, gasto) => (total += gasto.valor), 0);
}

function calcularBalance() {
  return presupuesto - calcularTotalGastos();
}
//TODO
function filtrarGastos() {}
//TODO
function agruparGastos() {}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.descripcion = descripcion;
  this.valor = comprobarPositivo(valor) || 0;
  this.fecha = ComprobarFecha(fecha) || new Date();
  this.etiquetas = [...etiquetas];

  this.mostrarGasto = function () {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
  };

  this.mostrarGastoCompleto = function () {
    let listaEtiquetas = this.etiquetas.reduce(
      (output, etiqueta) => output.concat("- ", etiqueta, "\n"),
      ""
    );
    let fechaAux = new Date(this.fecha);

    return `Gasto correspondiente a ${this.descripcion} con valor ${
      this.valor
    } €.\nFecha: ${fechaAux.toLocaleString()}\nEtiquetas:\n${listaEtiquetas}`;
  };

  this.actualizarFecha = function (newFecha) {
    this.fecha = ComprobarFecha(newFecha) || this.fecha;
  };

  this.actualizarDescripcion = function (newDescripcion) {
    this.descripcion = newDescripcion;
  };

  this.actualizarValor = function (newValor) {
    this.valor = comprobarPositivo(newValor) || this.valor;
  };

  this.anyadirEtiquetas = function (...newEtiquetas) {
    for (let etiqueta of newEtiquetas)
      if (!this.etiquetas.includes(etiqueta)) {
        this.etiquetas.push(etiqueta);
      }
  };

  this.borrarEtiquetas = function (...etiquetasToRemove) {
    this.etiquetas = this.etiquetas.filter(
      (etiqueta) => !etiquetasToRemove.includes(etiqueta)
    );
  };
  //TODO
  this.obtenerPeriodoAgrupacion = function (periodo) {
    let fecha = new Date(this.fecha);
    let anyo = `${fecha.getFullYear()}`;
    let mes = ("0" + (fecha.getMonth() + 1).toString()).slice(-2);
    let dia = ("0" + fecha.getDate().toString()).slice(-2);

    if (periodo === "anyo") return anyo;
    else if (periodo === "mes") return `${anyo}-${mes}`;
    else if (periodo === "dia") return `${anyo}-${mes}-${dia}`;
  };
}

// // NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// // Las funciones y objetos deben tener los nombres que se indican en el enunciado
// // Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export {
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
};
