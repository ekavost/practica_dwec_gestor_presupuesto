let presupuesto = 0;
let gastos = [];
let idGasto = 0;

let comprobarPositivo = (numero) => typeof numero === "number" && numero >= 0;

let actualizarPresupuesto = (valor) => {
  if (comprobarPositivo(valor) == true) return (presupuesto = valor);
  else {
    console.log("Valor no válida");
    return -1;
  }
};

let mostrarPresupuesto = () => `Tu presupuesto actual es de ${presupuesto} €`;

function listarGastos() {}
function anyadirGasto() {}
function borrarGasto() {}
function calcularTotalGastos() {}
function calcularBalance() {}

function CrearGasto(descripcion, valor) {
  this.descripcion = descripcion;
  comprobarPositivo(valor) ? (this.valor = valor) : (this.valor = 0);

  this.mostrarGasto = function () {
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
  };

  this.actualizarDescripcion = function (newDescripcion) {
    return (this.descripcion = newDescripcion);
  };
  this.actualizarValor = function (newValor) {
    if (comprobarPositivo(newValor)) return (this.valor = newValor);
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
