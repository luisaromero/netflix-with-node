//  IMPORTS
const { parseContent,
    normalizerType,
    isDuplicate,
    isValidNumber,
    newLineToPost,
    deleteByName } = require('./utils/helpers/helpers.js');

require('dotenv').config();
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const app = express();


//  MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Rutas absolutas a los archivos de datos
const MOVIE_ROUTE = path.join(__dirname, 'data', 'peliculas.txt');
const SERIES_ROUTE = path.join(__dirname, 'data', 'series.txt');

function getFilePathByType(type) {
    return type === 'peliculas' ? MOVIE_ROUTE : SERIES_ROUTE;
}




//  RUTAS
app.get('/catalogo', async (req, res) => {
    // primero obtenemos la query con el parámetro "tipo"
    // si el parametro "tipo" no está , entonces lanza error
    const tipo = normalizerType(req.query.tipo);
    //    como hay solo dos tipos de parametros , pelicula y serie y si no es ninguna , lanza error

    if (!tipo) {
        return res.status(400).json({ error: 'El parámetro "tipo" debe ser pelicula(s) o serie(s)' });
    }

    // 3) Elegir el archivo correcto según el tipo ya validado

    try {

        const fileContents = await fs.readFile(getFilePathByType(tipo), 'utf-8');
        const items = parseContent(fileContents, tipo);
        console.log(items)
        return res.status(200).json(items);

    } catch (err) {

        console.error('Error leyendo archivo:', err);
        return res.status(500).json({ error: 'Error interno al leer el catálogo' });
    }
});

app.post('/catalogo', async (req, res) => {
    const tipo = normalizerType(req.body.tipo);

    if (!tipo) {
        return res.status(400).json({
            error: 'El campo "tipo" debe ser pelicula(s) o serie(s)'
        });
    }

    const { nombre, director, anio, anioEstreno, temporadas } = req.body;

    if (!nombre || !nombre.trim()) {
        return res.status(400).json({
            error: 'El campo "nombre" es obligatorio'
        });
    }

    let newItem;

    if (tipo === 'peliculas') {

        if (!director || !director.trim()) {
            return res.status(400).json({
                error: 'El campo "director" es obligatorio'
            });
        }

        if (!isValidNumber(anio)) {
            return res.status(400).json({
                error: 'El campo "anio" debe ser un entero válido'
            });
        }

        newItem = {
            nombre: nombre.trim(),
            director: director.trim(),
            anio: Number(anio)
        };

    } else {

        if (!isValidNumber(anioEstreno)) {
            return res.status(400).json({
                error: 'El campo "anioEstreno" debe ser un entero válido'
            });
        }

        if (!isValidNumber(temporadas)) {
            return res.status(400).json({
                error: 'El campo "temporadas" debe ser un entero válido'
            });
        }

        newItem = {
            nombre: nombre.trim(),
            anioEstreno: Number(anioEstreno),
            temporadas: Number(temporadas)
        };
    }

    try {
        const filePath = getFilePathByType(tipo);

        const content = await fs.readFile(filePath, 'utf-8');
        const items = parseContent(content, tipo);

        if (isDuplicate(items, tipo, newItem)) {
            return res.status(409).json({
                error: `Ya existe un registro "${newItem.nombre}" (${tipo === 'peliculas'
                    ? newItem.anio
                    : newItem.anioEstreno
                    })`
            });
        }

        const lineToSave = newLineToPost(tipo, newItem) + '\n';

        await fs.appendFile(filePath, lineToSave);

        return res.status(201).json(newItem);

    } catch (err) {
        console.error('Error escribiendo archivo:', err);

        return res.status(500).json({
            error: 'Error interno al guardar el nuevo registro'
        });
    }
});

//  /catalogo /: nombre ? tipo = pelicula(s) | serie(s)

app.delete('/catalogo/:nombre', async (req, res) => {
    const tipo = normalizerType(req.query.tipo);
    if (!tipo) {
        return res.status(400).json({ error: 'El parámetro "tipo" debe ser pelicula(s) o serie(s)' });
    }

    const nameToDelete = decodeURIComponent(req.params.nombre).trim();
    if (!nameToDelete) {
        return res.status(400).json({ error: 'El nombre no puede estar vacío' });
    }
    // en try colocamos la logica que ya no depende del usuario
    try {
        const filePath = getFilePathByType(tipo);
        const content = await fs.readFile(filePath, 'utf-8');
        const items = parseContent(content, tipo);

        const updatedCatalog = deleteByName(items, nameToDelete);

        // si el el file actual de peli o series es el mismo que retorna updatedCatalog 
        // que se supone deberia ser el nuevo array entonces el nombre no se encontró dentro del file

        if (updatedCatalog.length === items.length) {
            return res.status(404).json({ error: `No se encontró "${nameToDelete}" en el catálogo` });
        }

        const newContent = updatedCatalog.map(item => newLineToPost(tipo, item)).join('\n');
        await fs.writeFile(filePath, updatedCatalog.length ? newContent + '\n' : '');

        return res.status(200).json({ mensaje: 'Eliminado con éxito', nombre: nameToDelete });

    } catch (err) {
        console.error('Error eliminando registro:', err);
        return res.status(500).json({ error: 'Error interno al eliminar el registro' });
    }
});



// ==========================================
//  MANEJO DE ERRORES (siempre al final)
// ==========================================

//el usuario puso una ruta que no está declarada arriba
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// evita que el servidor entero se caiga , por cualquiera sea el error que no hayamos declarado
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor'
    });
});


//ARRANQUE DEL SERVIDOR

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});