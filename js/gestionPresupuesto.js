let presupuesto = 0;
let gastos = [];
let idGasto = 0;

let comprobarPositivo = (numero) => Number.isFinite(numero) && numero >= 0;
let ComprobarFecha = (fecha) => Date.parse(fecha);

function actualizarPresupuesto(valor) {
  if (comprobarPositivo(valor) == true) return (presupuesto = valor);
  else {
    console.log("Valor no válida");
    return -1;
  }
}

function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

function listarGastos() {
  return gastos;
}
function anyadirGasto() {}
function borrarGasto() {}
function calcularTotalGastos() {}
function calcularBalance() {}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.descripcion = descripcion;
  this.valor = comprobarPositivo(valor) ? valor : 0;
  this.fecha = ComprobarFecha(fecha) || new Date();
  this.etiquetas = [...etiquetas];

  this.mostrarGastoCompleto = function () {
    let listaEtiquetas = etiquetas.reduce(
      (texto, etiqueta) => texto.concat("- ", etiqueta, "\n"),
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
    return (this.descripcion = newDescripcion);
  };
  this.actualizarValor = function (newValor) {
    if (comprobarPositivo(newValor)) return (this.valor = newValor);
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
};
