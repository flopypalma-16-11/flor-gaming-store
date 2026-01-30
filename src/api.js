// Aquí ponemos tu llave maestra
const API_KEY = '9dcfb7627c0640f5a6c8e34869108120'; 
const BASE_URL = 'https://api.rawg.io/api';

// Ahora la función acepta un "filtro" opcional
export async function getGames(query = '') {
    try {
        let url = `${BASE_URL}/games?key=${API_KEY}&page_size=20`;

        // Si escribimos algo en el buscador...
        if (query.startsWith('search=')) {
            url += `&search=${query.split('=')[1]}`;
        } 
        // Si pulsamos un botón de categoría...
        else if (query.startsWith('genres=')) {
            url += `&genres=${query.split('=')[1]}`;
        }
        // Si no, por defecto trae los mejores valorados (Trending)
        else {
            url += `&ordering=-rating`; 
        }

        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error cargando juegos:", error);
        return [];
    }
}