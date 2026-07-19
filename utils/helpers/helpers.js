
function normalizerType(type) {
    if (type === 'pelicula' || type === 'peliculas') return 'peliculas';
    if (type === 'serie' || type === 'series') return 'series';
    return null;
}

function parseContent(txtFormat, type) {
    const arr = txtFormat
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const items = [];

    for (const line of arr) {
        const fields = line.split(',').map(field => field.trim());

        if (fields.length !== 3) {
            console.warn('Línea con formato inválido, se ignora:', line);
            continue;
        }

        if (type === 'peliculas') {
            const [nameMovie, director, year] = fields;
            items.push({ nombre: nameMovie, director: director, anio: Number(year) });
        } else {
            const [nameSerie, yearOfRelease, seasons] = fields;
            items.push({ nombre: nameSerie, anioEstreno: Number(yearOfRelease), temporadas: Number(seasons) });
        }
    }

    return items;
}

module.exports = {
    normalizerType,
    parseContent
};