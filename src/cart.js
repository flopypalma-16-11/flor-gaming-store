// Importamos Auth y Base de Datos
import { auth, db, collection, addDoc } from './firebase.js';

// --- 1. MEMORIA DEL CARRITO ---
let cart = [];

// --- 2. ELEMENTOS DEL DOM ---
const cartCountElement = document.getElementById('cart-count');
const modal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

// --- 3. AÑADIR AL CARRITO ---
export function addToCart(game, price) {
    const existingItem = cart.find(item => item.id === game.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: game.id,
            name: game.name,
            image: game.background_image,
            price: price,
            quantity: 1
        });
    }
    updateCartCounter();
    alert(`¡${game.name} añadido! 🎮`);
}

// --- 4. ACTUALIZAR CONTADOR ---
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;
}

// --- 5. PINTAR EL CARRITO ---
function renderCart() {
    cartItemsContainer.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center">Tu carrito está vacío 😢</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>Cant: ${item.quantity} x ${item.price}€</p>
                    </div>
                </div>
                <strong>${itemTotal.toFixed(2)}€</strong>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }

    totalPriceElement.innerText = total.toFixed(2) + '€';
}

// --- 6. EVENTOS (Aquí está la magia nueva) ---
export function setupCartListeners() {
    const cartIcon = document.getElementById('cart-icon');
    const closeBtn = document.querySelector('.close-btn');
    const checkoutBtn = document.getElementById('btn-checkout');

    cartIcon.addEventListener('click', () => {
        renderCart();
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // BOTÓN DE PAGAR CON REGISTRO EN BASE DE DATOS 📝
    checkoutBtn.addEventListener('click', async () => {
        // 1. Validaciones
        if (cart.length === 0) {
            alert("Carrito vacío 👻");
            return;
        }
        if (!auth.currentUser) {
            alert("🔒 Inicia sesión para guardar tu pedido.");
            modal.classList.add('hidden');
            document.getElementById('auth-modal').classList.remove('hidden');
            return;
        }

        // 2. Feedback visual (Cargando...)
        const originalText = checkoutBtn.innerText;
        checkoutBtn.innerText = "Guardando pedido...";
        checkoutBtn.style.backgroundColor = "#ccc";
        checkoutBtn.disabled = true;

        try {
            // 3. CREAMOS EL TICKET (Objeto de datos)
            const order = {
                user: auth.currentUser.email, // Quién compra
                date: new Date().toISOString(), // Cuándo compra
                items: cart, // Qué compra
                total: parseFloat(totalPriceElement.innerText) // Cuánto paga
            };

            // 4. GUARDAMOS EN FIREBASE (En la colección 'orders')
            const docRef = await addDoc(collection(db, "orders"), order);
            console.log("Pedido guardado con ID: ", docRef.id);

            // 5. REDIRECCIÓN A STRIPE
            // (Esperamos 1 seg para que el usuario vea que se procesó)
            // ... (dentro del setTimeout en setupCartListeners) ...
            
            // COMENTAMOS O BORRAMOS LO DE STRIPE
            // const stripeLink = 'https://buy.stripe.com/test_...';
            
            // USAMOS NUESTRA PASARELA PROPIA
            // 1. Cogemos el precio total (quitándole el símbolo €)
            const totalValue = totalPriceElement.innerText.replace('€', '');
            
            // 2. Redirigimos a checkout.html pasando el precio en la URL
            window.location.href = `checkout.html?total=${totalValue}`;
            
            // ...

        } catch (error) {
            console.error("Error al guardar pedido: ", error);
            alert("Hubo un error al procesar el pedido. Inténtalo de nuevo.");
            checkoutBtn.innerText = originalText;
            checkoutBtn.disabled = false;
            checkoutBtn.style.backgroundColor = "#6d28d9";
        }
    });
}