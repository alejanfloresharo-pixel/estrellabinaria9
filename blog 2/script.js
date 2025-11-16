// script.js - carga posts.json y gestiona paginación
const POSTS_URL = 'posts.json';
const POSTS_PER_PAGE = 9;
let posts = [];
let currentPage = 1;
const postsGrid = document.getElementById('posts-grid');
const pagination = document.getElementById('pagination');

fetch(POSTS_URL)
  .then(r => r.json())
  .then(data => {
    // ordenar por fecha (desc)
    posts = data.sort((a,b) => new Date(b.date) - new Date(a.date));
    renderPage(1);
  })
  .catch(err => {
    postsGrid.innerHTML = '<p>No se pudieron cargar las entradas.</p>';
    console.error(err);
  });

function renderPage(page){
  currentPage = page;
  const start = (page-1)*POSTS_PER_PAGE;
  const slice = posts.slice(start, start + POSTS_PER_PAGE);

  postsGrid.innerHTML = slice.map(p => cardHTML(p)).join('');
  renderPagination();
  // agrega listeners para abrir post
  document.querySelectorAll('.post-card').forEach(el => {
    el.addEventListener('click', () => {
      const slug = el.dataset.slug;
      location.href = `post.html?post=${slug}`;
    });
  });
}

function cardHTML(p){
  // si no hay imagen, usa una placeholder
  const img = p.image ? `assets/images/${p.image}` : 'assets/images/placeholder.jpg';
  return `
    <div class="post-card" data-slug="${p.slug}" role="button" aria-label="${p.title}">
      <img src="${img}" alt="${p.title}">
      <h3 class="post-title">${p.title}</h3>
      <p class="post-date">${p.date}</p>
      <p class="post-desc">${p.excerpt}</p>
    </div>
  `;
}

function renderPagination(){
  const total = Math.ceil(posts.length / POSTS_PER_PAGE);
  let html = '';
  if (total <= 1) { pagination.innerHTML = ''; return; }

  // botón anterior
  html += `<button class="page-btn" ${currentPage===1? 'disabled':''} onclick="renderPage(${currentPage-1})">◀</button>`;

  for (let i=1;i<=total;i++){
    html += `<button class="page-btn ${i===currentPage? 'active':''}" onclick="renderPage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" ${currentPage===total? 'disabled':''} onclick="renderPage(${currentPage+1})">▶</button>`;
  pagination.innerHTML = html;
}

// Hacer functions globales para los onclick en botones
window.renderPage = renderPage;
