
const formMovie = document.getElementById('formMovie');

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

            console.log(data.error, 'error 1')
            return;
        }
        console.log(`"${data.nombre}" agregada con éxito`)

        formMovie.reset();

    } catch (err) {
        console.log('error 2', err)

    }
});

