function mostrarDatoEnId(valor, idElemento) {
  let doc = document.getElementById(idElemento);
  doc.innerHTML = valor;
}
function mostrarGastoWeb(idElemento, gasto) {
  let doc = document.getElementById(idElemento);

  let divGasto = document.createElement("div");
  divGasto.className = "gasto";
  doc.append(divGasto);

  let divDescripcion = document.createElement("div");
  divDescripcion.className = "gasto-descripcion";
  divDescripcion.innerHTML = gasto.descripcion;
  divGasto.append(divDescripcion);

  let divFecha = document.createElement("div");
  divFecha.className = "gasto-fecha";
  divFecha.innerHTML = new Date(gasto.fecha).toLocaleDateString();
  divDescripcion.append(divFecha);

  let divValor = document.createElement("div");
  divValor.className = "gasto-valor";
  divValor.innerHTML = gasto.valor;
  divFecha.append(divValor);

  let divEtiquetas = document.createElement("div");
  divEtiquetas.className = "gasto-etiquetas";
  for (const etiqueta of gasto.etiquetas) {
    let spanEtiqueta = document.createElement("span");
    spanEtiqueta.className = "gasto-etiquetas-etiqueta";
    spanEtiqueta.innerHTML = etiqueta + " ";
    divEtiquetas.append(spanEtiqueta);
  }
  divValor.append(divEtiquetas);
}
function mostrarGastosAgrupadosWeb(idElenento, agrup, periodo) {}

export { mostrarDatoEnId, mostrarGastoWeb };
