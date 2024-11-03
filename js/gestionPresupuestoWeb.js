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
  divGasto.append(divFecha);

  let divValor = document.createElement("div");
  divValor.className = "gasto-valor";
  divValor.innerHTML = gasto.valor;
  divGasto.append(divValor);

  let divEtiquetas = document.createElement("div");
  divEtiquetas.className = "gasto-etiquetas";
  for (const etiqueta of gasto.etiquetas) {
    let spanEtiqueta = document.createElement("span");
    spanEtiqueta.className = "gasto-etiquetas-etiqueta";
    spanEtiqueta.innerHTML = etiqueta + " ";
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
  titulo.innerHTML = "Gastos agrupados por " + periodo;
  divGrupo.append(titulo);

  for (const key in agrup) {
    let divAgrupGastos = document.createElement("div");
    divAgrupGastos.className = "agrupacion-dato";

    let spanNombre = document.createElement("span");
    spanNombre.className = "agrupacion-dato-clave";
    spanNombre.innerHTML = key + ": ";
    divAgrupGastos.append(spanNombre);

    let spanValor = document.createElement("span");
    spanValor.className = "agrupacion-dato-valor";
    spanValor.innerHTML = agrup[key].toFixed(2);
    divAgrupGastos.append(spanValor);

    divGrupo.append(divAgrupGastos);
  }
}

export { mostrarDatoEnId, mostrarGastoWeb, mostrarGastosAgrupadosWeb };
