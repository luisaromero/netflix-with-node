
const formMovie = document.getElementById('formMovie');
const formSeries = document.getElementById('formSeries');

// aqui tendremos la lógica del dom para los formularios


formMovie.addEventListener('submit', async (event) => {
    event.preventDefault(); // evita que el form recargue la página

    const newMovie = {
        tipo: 'peliculas',
        nombre: document.getElementById('movieTitle').value,
        director: document.getElementById('directorOfTheFilm').value,
        anio: document.getElementById('yearOfTheFilm').value
    };

    try {
        const postNewMovie = await fetch('http://localhost:3000/catalogo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMovie)
        });

        const data = await postNewMovie.json();

        if (!postNewMovie.ok) {
            showMessage('msgMovie', data.error, true);
            return;
        }

        showMessage(
            'msgMovie',
            `"${data.nombre}" agregada con éxito`
        );

        formMovie.reset();

    } catch (err) {
        showMessage(
            'msgMovie',
            'No se pudo conectar con el servidor',
            true
        );
    }
});

formSeries.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newSeries = {
        tipo: 'serie',
        nombre: document.getElementById('seriesName').value,
        anioEstreno: document.getElementById('yearOfRelease').value,
        temporadas: document.getElementById('seasons').value,
    };

    try {
        const postNewSeries = await fetch('http://localhost:3000/catalogo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSeries)
        });

        const data = await postNewSeries.json();

        if (!postNewSeries.ok) {
            showMessage('msgSeries', data.error, true);
            return;
        }

        showMessage(
            'msgSeries',
            `"${data.nombre}" agregada con éxito`
        );

        formSeries.reset();

    } catch (err) {
        showMessage(
            'msgSeries',
            'No se pudo conectar con el servidor',
            true
        );
    }
})

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);

    element.textContent = message;

    element.classList.remove('msg-success', 'msg-error');

    element.classList.add(
        isError ? 'msg-error' : 'msg-success'
    );
}