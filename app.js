// Precios en centavos para evitar errores de decimales
var productos = [
  { id: 1, ico: "🥖", nombre: "Pan francés", centavos: 50 },
  { id: 2, ico: "🫓", nombre: "Tortillas (5)", centavos: 100 },
  { id: 3, ico: "🥚", nombre: "Huevo", centavos: 125 },
  { id: 4, ico: "🫘", nombre: "Frijoles 1 lb", centavos: 500 },
  { id: 5, ico: "🥛", nombre: "Leche", centavos: 800 },
  { id: 6, ico: "☕", nombre: "Café", centavos: 400 },
  { id: 7, ico: "🥤", nombre: "Gaseosa", centavos: 500 },
  { id: 8, ico: "🧼", nombre: "Jabón", centavos: 350 }
];

var BILLETES = [5, 10, 20, 50, 100, 200];
var cuenta = {};
var paga = 0;

var contProductos = document.getElementById("productos");
var lista = document.getElementById("lista");
var totalEl = document.getElementById("total");
var resultado = document.getElementById("resultado");
var contBilletes = document.getElementById("billetes");
var otro = document.getElementById("otro");

function q(centavos) {
  return "Q " + (centavos / 100).toFixed(2);
}

function buscar(id) {
  return productos.filter(function (p) { return p.id === id; })[0];
}

function calcularTotal() {
  var t = 0;
  for (var id in cuenta) {
    t += buscar(Number(id)).centavos * cuenta[id];
  }
  return t;
}

function dibujarProductos() {
  productos.forEach(function (p) {
    var b = document.createElement("button");
    b.className = "prod";
    b.innerHTML = '<span class="ico">' + p.ico + '</span>' + p.nombre +
                  '<span class="precio">' + q(p.centavos) + '</span>';
    b.addEventListener("click", function () { cambiar(p.id, 1); });
    contProductos.appendChild(b);
  });
}

function dibujarBilletes() {
  BILLETES.forEach(function (v) {
    var b = document.createElement("button");
    b.textContent = "Q" + v;
    b.addEventListener("click", function () {
      paga = v * 100;
      otro.value = "";
      actualizar();
    });
    contBilletes.appendChild(b);
  });
}

function cambiar(id, delta) {
  cuenta[id] = (cuenta[id] || 0) + delta;
  if (cuenta[id] <= 0) { delete cuenta[id]; }
  actualizar();
  if (delta > 0 && navigator.vibrate) { navigator.vibrate(30); }
}

function actualizar() {
  lista.innerHTML = "";
  var ids = Object.keys(cuenta);
  if (ids.length === 0) {
    lista.innerHTML = '<li class="vacio">Sin productos todavía</li>';
  }
  ids.forEach(function (id) {
    var p = buscar(Number(id));
    var li = document.createElement("li");
    li.innerHTML = '<span>' + p.ico + ' ' + p.nombre + '</span>' +
      '<span class="cant"><button data-m="-">−</button><span>' + cuenta[id] +
      '</span><button data-m="+">+</button></span>' +
      '<span>' + q(p.centavos * cuenta[id]) + '</span>';
    li.querySelector('[data-m="-"]').addEventListener("click", function () { cambiar(p.id, -1); });
    li.querySelector('[data-m="+"]').addEventListener("click", function () { cambiar(p.id, 1); });
    lista.appendChild(li);
  });

  var total = calcularTotal();
  totalEl.textContent = q(total);

  var botones = contBilletes.querySelectorAll("button");
  botones.forEach(function (b, i) {
    b.className = (paga === BILLETES[i] * 100) ? "sel" : "";
  });

  resultado.className = "resultado";
  if (total === 0) {
    resultado.textContent = "Agrega productos para empezar";
  } else if (paga === 0) {
    resultado.textContent = "Elige con cuánto paga el cliente";
  } else if (paga >= total) {
    resultado.className = "resultado ok";
    resultado.innerHTML = 'Vuelto para el cliente<span class="grande">' + q(paga - total) + '</span>';
  } else {
    resultado.className = "resultado falta";
    resultado.innerHTML = 'Todavía faltan<span class="grande">' + q(total - paga) + '</span>';
  }
}

otro.addEventListener("input", function () {
  var v = parseFloat(otro.value);
  paga = isNaN(v) || v < 0 ? 0 : Math.round(v * 100);
  actualizar();
});

document.getElementById("btnNueva").addEventListener("click", function () {
  cuenta = {};
  paga = 0;
  otro.value = "";
  actualizar();
});

dibujarProductos();
dibujarBilletes();
actualizar();
// Registrar Service Worker para instalar la aplicación
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js")
      .then(function () {
        console.log("Aplicación lista para instalar");
      })
      .catch(function (error) {
        console.error("Error al registrar Service Worker:", error);
      });
  });
}
