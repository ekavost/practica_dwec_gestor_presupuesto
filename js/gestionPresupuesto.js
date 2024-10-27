"use strict";

let presupuesto = 0;
let gastos = [];
let idGasto = 0;

let comprobarPositivo = (numero) => (Number.isFinite(numero) && numero >= 0 ? numero : false);
let comprobarFecha = (fecha) => Date.parse(fecha);

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

function filtrarGastos(filtros) {
  return gastos.filter(function (gasto) {
    let result = true;
    if (comprobarFecha(filtros.fechaDesde) && result) {
      result = gasto.fecha >= comprobarFecha(filtros.fechaDesde);
    }
    if (comprobarFecha(filtros.fechaHasta) && result) {
      result = gasto.fecha <= comprobarFecha(filtros.fechaHasta);
    }
    if (filtros.valorMinimo && result) {
      result = gasto.valor >= filtros.valorMinimo;
    }
    if (filtros.valorMaximo && result) {
      result = gasto.valor <= filtros.valorMaximo;
    }
    if (filtros.descripcionContiene && result) {
      result = gasto.descripcion.toLowerCase().includes(filtros.descripcionContiene.toLowerCase());
    }
    if (filtros.etiquetasTiene && result) {
      let resultAux = false;
      filtros.etiquetasTiene.forEach((etiqueta) => {
        if (gasto.etiquetas.includes(etiqueta)) {
          resultAux = true;
        }
      });
      result = resultAux;
    }
    return result;
  });
}

function agruparGastos(periodo = "mes", etiquetas, fechaDesde, fechaHasta) {
  let gastosFiltrados = filtrarGastos({ fechaDesde: fechaDesde, fechaHasta: fechaHasta, etiquetasTiene: etiquetas });
  return gastosFiltrados.reduce(function (acc, gasto) {
    let periodoAcc = gasto.obtenerPeriodoAgrupacion(periodo);
    if (acc[periodoAcc]) {
      acc[periodoAcc] += gasto.valor;
    } else {
      acc[periodoAcc] = gasto.valor;
    }
    return acc;
  }, {});
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.mostrarGasto = function () {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
  };

  this.mostrarGastoCompleto = function () {
    let listaEtiquetas = this.etiquetas.reduce((output, etiqueta) => output.concat("- ", etiqueta, "\n"), "");
    let fechaAux = new Date(this.fecha);

    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaAux.toLocaleString()}\nEtiquetas:\n${listaEtiquetas}`;
  };

  this.actualizarFecha = function (newFecha) {
    this.fecha = comprobarFecha(newFecha) || this.fecha;
  };

  this.actualizarDescripcion = function (newDescripcion) {
    this.descripcion = newDescripcion;
  };

  this.actualizarValor = function (newValor) {
    this.valor = comprobarPositivo(newValor) || this.valor;
  };

  this.anyadirEtiquetas = function (...newEtiquetas) {
    for (let etiqueta of newEtiquetas)
      if (!this.etiquetas.includes(etiqueta.toLowerCase())) {
        this.etiquetas.push(etiqueta.toLowerCase());
      }
  };

  this.borrarEtiquetas = function (...etiquetasToRemove) {
    this.etiquetas = this.etiquetas.filter((etiqueta) => !etiquetasToRemove.includes(etiqueta));
  };

  this.obtenerPeriodoAgrupacion = function (periodo) {
    let fecha = new Date(this.fecha);
    let anyo = `${fecha.getFullYear()}`;
    let mes = ("0" + (fecha.getMonth() + 1).toString()).slice(-2);
    let dia = ("0" + fecha.getDate().toString()).slice(-2);
    switch (periodo) {
      case "anyo":
        return anyo;
        break;
      case "mes":
        return `${anyo}-${mes}`;
        break;
      case "dia":
        return `${anyo}-${mes}-${dia}`;
        break;
    }
  };

  this.descripcion = descripcion;
  this.valor = comprobarPositivo(valor) || 0;
  this.fecha = comprobarFecha(fecha) || new Date();
  this.etiquetas = [];
  this.anyadirEtiquetas(...etiquetas);
}

// // NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// // Las funciones y objetos deben tener los nombres que se indican en el enunciado
// // Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export { mostrarPresupuesto, actualizarPresupuesto, CrearGasto, listarGastos, anyadirGasto, borrarGasto, calcularTotalGastos, calcularBalance, filtrarGastos, agruparGastos };
