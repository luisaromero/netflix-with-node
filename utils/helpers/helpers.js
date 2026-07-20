
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

// funcion que vela que haya un POST de una peli o serie ya que esta en el archivo
// aplicamos criterio : pueden haber pelis/serie con el mismo nombre pero de diferentes años ...
function isDuplicate(items, type, newItem) {
    return items.some(item => {
        //usamos toLoWerCase , para que no sea case sensitive 
        //comparamos si hay dentro del archivo el mismo nombre del que queremos agregar
        const sameName = item.nombre.trim().toLowerCase() === newItem.nombre.trim().toLowerCase();
        // lo mismo pero con el nombre
        // con el ternario ":" pasamos serie(s) ya que el año se llama diff
        const sameYear = type === 'peliculas'
            ? item.anio === newItem.anio
            : item.anioEstreno === newItem.anioEstreno;
        // retorna true si mismos nombres y mismos años son iguales en, otro caso es false
        return sameName && sameYear;
    });
}
// verifica si el valor ingresado no sea undefined , no sea nulo o esté en blanco y 
// si pasa esos filtros retorna true si el valor es un numero entero y que ademas sea mayor a uno
// porque una temporadas debe ser 1 o mas
function isValidNumber(value) {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ''
    ) {
        return false;
    }

    const number = Number(value);

    return Number.isInteger(number) && number >= 1;
}
// se crea un nuevo objeto para el metodo POST
function newLineToPost(type, obj) {
    return type === 'peliculas'
        ? `${obj.nombre}, ${obj.director}, ${obj.anio}`
        : `${obj.nombre}, ${obj.anioEstreno}, ${obj.temporadas}`;
}


module.exports = {
    normalizerType,
    parseContent,
    isDuplicate,
    isValidNumber,
    newLineToPost
};