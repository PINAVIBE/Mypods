
const WHATSAPP_NUMBER = '573209776284';

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
    variantes: ['Compatible'],
    colores: ['#FFFFFF'],
    emoji: '🎧',
    imagen: 'img/airpods pro 2.jpg',
    imagenes: ["img/airpods pro 2.jpg", "img/airpods pro 2.2.jpg", "img/airpods pro 2.3.jpg"],
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
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.innerHTML = `<span style="font-size:4rem">${currentProduct.emoji}</span>`;
    wrap.ontouchstart = null; wrap.ontouchmove = null; wrap.ontouchend = null;
    wrap.onmousedown = null; wrap.onmouseup = null; wrap.onmouseleave = null;
    return;
  }
  wrap.style.display = 'block';

  carruselImgs = imgs;
  carruselIdx  = 0;
  buildCarrusel(name);
}

function buildCarrusel(name) {
  const wrap = document.getElementById('modalImgWrap');

  const slides = carruselImgs.map((src, i) =>
    `<div class="c-slide" style="min-width:100%;height:100%;flex-shrink:0;">
       <img src="${src}" alt="${name} ${i+1}" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;">
     </div>`
  ).join('');

  const dots = carruselImgs.length > 1
    ? `<div class="carrusel-dots" id="carruselDots">
         ${carruselImgs.map((_, i) => `<span class="cdot ${i === 0 ? 'active' : ''}"></span>`).join('')}
       </div>`
    : '';

  const navs = carruselImgs.length > 1
    ? `<button class="carrusel-nav prev" onclick="moveCarrusel(-1)">‹</button>
       <button class="carrusel-nav next" onclick="moveCarrusel(1)">›</button>`
    : '';

  wrap.innerHTML = `
    <div id="cTrack" style="display:flex;width:100%;height:100%;transition:transform .35s cubic-bezier(.4,0,.2,1);will-change:transform;touch-action:pan-y;">
      ${slides}
    </div>
    ${navs}
    ${dots}
  `;

  // Eventos touch en el wrap (no el track) para no perderlos al reconstruir
  wrap._touchStartX = 0;
  wrap._touchStartY = 0;
  wrap._swiping = false;

  wrap.ontouchstart = e => {
    wrap._touchStartX = e.touches[0].clientX;
    wrap._touchStartY = e.touches[0].clientY;
    wrap._swiping = true;
    // Quitar transición para que siga el dedo en tiempo real
    document.getElementById('cTrack').style.transition = 'none';
  };

  wrap.ontouchmove = e => {
    if (!wrap._swiping) return;
    const dx = e.touches[0].clientX - wrap._touchStartX;
    const dy = e.touches[0].clientY - wrap._touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
      const base = -(carruselIdx * 100);
      const pct  = (dx / wrap.offsetWidth) * 100;
      document.getElementById('cTrack').style.transform = `translateX(calc(${base}% + ${dx}px))`;
    }
  };

  wrap.ontouchend = e => {
    if (!wrap._swiping) return;
    wrap._swiping = false;
    const track = document.getElementById('cTrack');
    track.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1)';
    const dx = e.changedTouches[0].clientX - wrap._touchStartX;
    if (Math.abs(dx) > 50) {
      moveCarrusel(dx < 0 ? 1 : -1);
    } else {
      // Volver a la posición original sin cambiar índice
      track.style.transform = `translateX(-${carruselIdx * 100}%)`;
    }
  };

  // Mouse drag (escritorio)
  let mouseStartX = 0, mouseDown = false;
  wrap.onmousedown  = e => { mouseStartX = e.clientX; mouseDown = true; };
  wrap.onmouseup    = e => {
    if (!mouseDown) return;
    mouseDown = false;
    const dx = e.clientX - mouseStartX;
    if (Math.abs(dx) > 50) moveCarrusel(dx < 0 ? 1 : -1);
  };
  wrap.onmouseleave = () => { mouseDown = false; };
}

function updateCarrusel() {
  const track = document.getElementById('cTrack');
  if (!track) return;
  track.style.transform = `translateX(-${carruselIdx * 100}%)`;

  // Actualizar dots
  const dots = document.querySelectorAll('#carruselDots .cdot');
  dots.forEach((d, i) => d.classList.toggle('active', i === carruselIdx));
}

function moveCarrusel(dir) {
  carruselIdx = (carruselIdx + dir + carruselImgs.length) % carruselImgs.length;
  updateCarrusel();
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
