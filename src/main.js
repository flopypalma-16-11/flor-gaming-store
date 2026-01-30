import { getGames } from './api.js';
import { addToCart, setupCartListeners } from './cart.js';
import { setupAuthListeners } from './auth.js';

const gamesContainer = document.getElementById('games-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Función reutilizable para cargar juegos
async function loadGames(filter = '') {
    gamesContainer.innerHTML = '<p>Cargando juegos...</p>'; // Feedback visual
    const games = await getGames(filter);
    gamesContainer.innerHTML = ''; // Limpiamos antes de pintar

    if(games.length === 0) {
        gamesContainer.innerHTML = '<h3>No se encontraron juegos 😢</h3>';
        return;
    }

    games.forEach(game => {
        const price = Math.floor(Math.random() * 50) + 10;
        const card = document.createElement('div');
        card.classList.add('game-card');
        
        // Si no tiene imagen, ponemos una genérica
        const image = game.background_image || 'https://via.placeholder.com/300x200?text=No+Image';

        card.innerHTML = `
            <img src="${image}" alt="${game.name}">
            <div class="card-info">
                <h3>${game.name}</h3>
                <p class="price">${price}.99€</p>
                <button class="btn-add">Añadir al Carrito 🛒</button>
            </div>
        `;

        const btn = card.querySelector('.btn-add');
        btn.addEventListener('click', () => {
            addToCart(game, price);
        });

        gamesContainer.appendChild(card);
    });
}

// 1. Carga inicial (Trending)
loadGames(); 

// 2. Evento Buscador
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) loadGames(`search=${query}`);
});

// 3. Evento Categorías
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const genre = e.target.dataset.genre;
        loadGames(`genres=${genre}`);
    });
});

// 4. Activar el carrito
setupCartListeners();
setupAuthListeners();