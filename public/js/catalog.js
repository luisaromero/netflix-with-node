// mostrar la data
let currentData = [];
let currentType = '';

document.getElementById('btnMovies').addEventListener('click', () => {
    getCatalog('peliculas');
});

document.getElementById('btnSeries').addEventListener('click', () => {
    getCatalog('series');
});

async function getCatalog(tipo) {
    try {

        const response = await fetch(`/catalogo?tipo=${tipo}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        currentData = data;
        currentType = tipo;

        createSortOptions(tipo);
        renderCards(data, tipo);

    } catch (error) {
        results.innerHTML = `<p>${error.message}</p>`;
    }
}
function createSortOptions(tipo) {
    const select = document.getElementById('sortSelect');

    if (tipo === 'peliculas') {
        select.innerHTML = `
            <option value="nombre">Nombre</option>
            <option value="director">Director</option>
            <option value="anio">Año</option>
        `;
    } else {
        select.innerHTML = `
            <option value="nombre">Nombre</option>
            <option value="anioEstreno">Año estreno</option>
            <option value="temporadas">Temporadas</option>
        `;
    }
}



function renderCards(items, tipo) {

    const results = document.getElementById('results');

    results.innerHTML = items.map(item => {

        if (tipo === 'peliculas') {
            return `
                <article class="card">
                    <div class="icon">🎬</div>

                    <h3>${item.nombre}</h3>

                    <p>
                        <strong>Director:</strong>
                        ${item.director}
                    </p>

                    <p>
                        <strong>Año:</strong>
                        ${item.anio}
                    </p>
                </article>
            `;
        }

        return `
            <article class="card">
                <div class="icon">📺</div>

                <h3>${item.nombre}</h3>

                <p>
                    <strong>Año estreno:</strong>
                    ${item.anioEstreno}
                </p>

                <p>
                    <strong>Temporadas:</strong>
                    ${item.temporadas}
                </p>
            </article>
        `;

    }).join('');
}
document.getElementById('sortSelect').addEventListener('change', (event) => {

    const field = event.target.value;

    currentData.sort((a, b) => {

        if (typeof a[field] === 'string') {
            return a[field].localeCompare(b[field]);
        }

        return a[field] - b[field];
    });

    renderCards(currentData, currentType);
});