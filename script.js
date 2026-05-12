/* ============================================================
   MYPODS — script.js
   ============================================================ */

/* ── NÚMERO DE WHATSAPP ──────────────────────────────────────
   Cambia este número por el tuyo (código de país sin el +)
   Ejemplo Colombia: 573001234567
   ─────────────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '573209776284';

/* ── MAPA DE COLORES ─────────────────────────────────────────
   Agrega aquí los colores que uses en tus productos.
   Clave: código hex  →  Valor: nombre legible
   ─────────────────────────────────────────────────────────── */
const nombreColores = {
  '#FFFFFF': 'Blanco',
  '#000000': 'Negro',
  '#888888': 'Gris',
  '#1C1C1E': 'Negro espacial',
  '#C8B8A2': 'Arena',
  '#4A5E3A': 'Verde bosque',
  '#80091B': 'Vino tinto',
  '#D4B896': 'Nude',
  '#87CEEB': 'Azul cielo',
};

/* ── PRODUCTOS ───────────────────────────────────────────────
   Cada objeto es un producto. Campos:
   - nombre    : nombre del producto
   - categoria : 'cargadores' | 'cables' | 'audifonos' | 'accesorios'
                 (o cualquier categoría nueva que añadas)
   - precio    : string con el precio, ej. "$35.000"
   - descripcion: texto de descripción
   - variantes : array de strings con las variantes (tallas, versiones…)
   - colores   : array de códigos hex disponibles
   - emoji     : emoji que aparece cuando no hay imagen
   - imagen    : ruta a la imagen principal, ej. "img/cargador.jpg"
                 (deja "" si no tienes imagen todavía)
   - imagenes  : array con rutas de imágenes adicionales para el carrusel
                 (deja [] si solo tienes una o ninguna imagen)
   - badge     : "Nuevo" | "Agotado" | "" (sin badge)
   ─────────────────────────────────────────────────────────── */
const productos = [
  {
    nombre: 'Cargador 20W USB-C',
    categoria: 'cargadores',
    precio: '$35.000',
    descripcion: 'Carga rápida compatible con iPhone 12 y superiores. Compacto y eficiente.',
    variantes: ['Original', 'Compatible'],
    colores: ['#FFFFFF', '#000000'],
    emoji: '🔌',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
  {
    nombre: 'Cable Lightning 1m',
    categoria: 'cables',
    precio: '$18.000',
    descripcion: 'Cable Lightning trenzado de alta durabilidad. Compatible con todos los modelos de iPhone.',
    variantes: ['1 metro', '2 metros'],
    colores: ['#FFFFFF', '#000000', '#C8B8A2'],
    emoji: '🔗',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
  {
    nombre: 'AirPods Pro (2da gen)',
    categoria: 'audifonos',
    precio: '$320.000',
    descripcion: 'Cancelación activa de ruido, audio espacial personalizado y hasta 30 horas de batería.',
    variantes: ['Talla única'],
    colores: ['#FFFFFF'],
    emoji: '🎧',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
  {
    nombre: 'Cable USB-C a Lightning',
    categoria: 'cables',
    precio: '$22.000',
    descripcion: 'Compatible con carga rápida PD. Ideal para conectar con MacBook o cargador 20W.',
    variantes: ['1 metro', '2 metros'],
    colores: ['#FFFFFF', '#888888'],
    emoji: '⚡',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
  {
    nombre: 'Cargador inalámbrico MagSafe',
    categoria: 'cargadores',
    precio: '$85.000',
    descripcion: 'Carga magnética de hasta 15W para iPhone 12 en adelante. Diseño ultrafino.',
    variantes: ['Original', 'Compatible'],
    colores: ['#FFFFFF'],
    emoji: '🧲',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
  {
    nombre: 'Funda MagSafe iPhone 15',
    categoria: 'accesorios',
    precio: '$40.000',
    descripcion: 'Funda transparente con soporte MagSafe integrado. Protege sin cubrir el diseño.',
    variantes: ['iPhone 14', 'iPhone 15', 'iPhone 15 Pro'],
    colores: ['#FFFFFF', '#1C1C1E', '#4A5E3A'],
    emoji: '📱',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
  {
    nombre: 'Adaptador Lightning a 3.5mm',
    categoria: 'accesorios',
    precio: '$15.000',
    descripcion: 'Conecta tus audífonos con cable al iPhone. Pequeño y siempre útil.',
    variantes: ['Talla única'],
    colores: ['#FFFFFF'],
    emoji: '🔊',
    imagen: '',
    imagenes: [],
    badge: '',
  },
  {
    nombre: 'AirPods 3ra generación',
    categoria: 'audifonos',
    precio: '$210.000',
    descripcion: 'Audio espacial, resistencia al agua y hasta 30 horas con el estuche de carga.',
    variantes: ['Talla única'],
    colores: ['#FFFFFF'],
    emoji: '🎵',
    imagen: '',
    imagenes: [],
    badge: 'Nuevo',
  },
];

/* ── ESTADO DEL MODAL ──────────────────────────────────────── */
let selectedSize    = '';
let selectedColor   = '';
let currentProduct  = null;
let carruselIdx     = 0;
let carruselImgs    = [];

/* ── RENDERIZAR PRODUCTOS ────────────────────────────────────
   Llena el grid con las tarjetas según el filtro activo.
   ─────────────────────────────────────────────────────────── */
function renderProductos(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  productos.forEach((p, i) => {
    if (filter !== 'all' && p.categoria !== filter) return;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = (i * 0.06) + 's';

    // Puntos de color
    const colorDots = p.colores
      .map(c => `<span class="color-dot" style="background:${c}" title="${nombreColores[c] || c}"></span>`)
      .join('');

    // Badge
    const badgeHTML = p.badge
      ? `<span class="badge ${p.badge === 'Agotado' ? 'badge-sold' : 'badge-new'}">${p.badge}</span>`
      : '';

    // Imagen o emoji
    const imgHTML = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}">`
      : `<span style="font-size:3rem">${p.emoji}</span>`;

    card.innerHTML = `
      <div class="card-img">
        ${imgHTML}
        ${badgeHTML}
      </div>
      <div class="card-body">
        <p class="card-cat">${p.categoria}</p>
        <p class="card-name">${p.nombre}</p>
        <div class="card-colors">${colorDots}</div>
        <div class="card-footer">
          <span class="card-price">${p.precio}</span>
          <button class="btn-view" onclick="openModal(${i})">Ver más</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ── CARRUSEL DE IMÁGENES ────────────────────────────────────
   Muestra las imágenes del producto con flechas de navegación.
   ─────────────────────────────────────────────────────────── */
function renderCarrusel(imgs, name) {
  const wrap = document.getElementById('modalImgWrap');

  if (!imgs || imgs.length === 0) {
    wrap.innerHTML = `<span style="font-size:4rem">${currentProduct.emoji}</span>`;
    return;
  }

  carruselImgs = imgs;
  carruselIdx  = 0;
  updateCarrusel(name);
}

function updateCarrusel(name) {
  const wrap = document.getElementById('modalImgWrap');

  const dots = carruselImgs
    .map((_, i) => `<span class="cdot ${i === carruselIdx ? 'active' : ''}"></span>`)
    .join('');

  const navs = carruselImgs.length > 1
    ? `<button class="carrusel-nav prev" onclick="moveCarrusel(-1)">‹</button>
       <button class="carrusel-nav next" onclick="moveCarrusel(1)">›</button>
       <div class="carrusel-dots">${dots}</div>`
    : '';

  wrap.innerHTML = `
    <img src="${carruselImgs[carruselIdx]}" alt="${name}" style="width:100%;height:100%;object-fit:cover;">
    ${navs}
  `;
}

function moveCarrusel(dir) {
  carruselIdx = (carruselIdx + dir + carruselImgs.length) % carruselImgs.length;
  updateCarrusel(currentProduct.nombre);
}

/* ── ABRIR MODAL ─────────────────────────────────────────────
   Recibe el índice del producto en el array y abre el modal.
   ─────────────────────────────────────────────────────────── */
function openModal(idx) {
  const p = productos[idx];
  currentProduct = p;
  selectedSize   = '';
  selectedColor  = '';

  // Datos básicos
  document.getElementById('modalCat').textContent   = p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1);
  document.getElementById('modalName').textContent  = p.nombre;
  document.getElementById('modalPrice').textContent = p.precio;
  document.getElementById('modalDesc').textContent  = p.descripcion;

  // Imágenes / carrusel
  const imgs = p.imagen
    ? (p.imagenes.length ? p.imagenes : [p.imagen])
    : [];
  renderCarrusel(imgs, p.nombre);

  // Variantes
  const sizesEl = document.getElementById('modalSizes');
  sizesEl.innerHTML = '';
  p.variantes.forEach(v => {
    const btn = document.createElement('button');
    btn.className  = 'size-chip';
    btn.textContent = v;
    btn.onclick = () => {
      document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = v;
      updateLink(p);
    };
    sizesEl.appendChild(btn);
  });

  // Colores
  const colorsEl = document.getElementById('modalColors');
  colorsEl.innerHTML = '';
  const cw = document.getElementById('colorsWrap');

  if (p.colores.length > 0) {
    cw.style.display = 'block';
    p.colores.forEach(c => {
      const btn = document.createElement('button');
      btn.className    = 'color-chip-lg';
      btn.style.background = c;
      btn.title        = nombreColores[c] || c;
      btn.onclick = () => {
        document.querySelectorAll('.color-chip-lg').forEach(x => x.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColor = c;
        updateLink(p);
      };
      colorsEl.appendChild(btn);
    });
  } else {
    cw.style.display = 'none';
  }

  updateLink(p);
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── LINK DE WHATSAPP ────────────────────────────────────────
   Construye el mensaje con los datos seleccionados.
   ─────────────────────────────────────────────────────────── */
function updateLink(p) {
  const sizeText  = selectedSize || 'Sin seleccionar';
  const colorName = selectedColor ? (nombreColores[selectedColor] || selectedColor) : '';
  const colorText = colorName ? `\nColor: ${colorName}` : '';

  const msg = encodeURIComponent(
    `Hola Mypods! Me interesa:\n📦 ${p.nombre}\n💰 ${p.precio}\n📐 ${sizeText}${colorText}\n\n¿Tienen disponibilidad?`
  );

  document.getElementById('btnOrder').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

/* ── CERRAR MODAL ────────────────────────────────────────────*/
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target.id === 'modalOverlay') closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── FILTROS ─────────────────────────────────────────────────*/
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProductos(btn.dataset.filter);
  });
});

// Para los links del navbar
function filterCat(cat) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === cat);
  });
  renderProductos(cat);
}

/* ── MENÚ HAMBURGUESA ────────────────────────────────────────*/
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

/* ── ARRANQUE ────────────────────────────────────────────────*/
renderProductos();