//  IMPORTS
const { parseContent, normalizerType } = require('./utils/helpers/helpers.js');
require('dotenv').config();
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const app = express();


//  MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));


// Rutas absolutas a los archivos de datos
const MOVIE_ROUTE = path.join(__dirname, 'data', 'peliculas.txt');
const SERIES_ROUTE = path.join(__dirname, 'data', 'series.txt');



//  RUTAS
app.get('/catalogo', async (req, res) => {
    // primero obtenemos la query con el parámetro "tipo"
    // si el parametro "tipo" no está , entonces lanza error
    const tipo = normalizerType(req.query.tipo);
    if (!tipo) {
        return res.status(400).json({ error: 'El parámetro "tipo" debe ser pelicula(s) o serie(s)' });
    }

    //    como hay solo dos tipos de parametros , pelicula y serie y si no es ninguna , lanza error
    if (tipo !== 'peliculas' && tipo !== 'series') {
        return res.status(400).json({ error: 'El parámetro "tipo" debe ser "pelicula(s) o serie(s)"' });
    }
    // 3) Elegir el archivo correcto según el tipo ya validado
    const pathToFile = tipo === 'peliculas' ? MOVIE_ROUTE : SERIES_ROUTE;

    try {

        const fileContents = await fs.readFile(pathToFile, 'utf-8');
        const items = parseContent(fileContents, tipo);
        console.log(items)
        return res.status(200).json(items);

    } catch (err) {

        console.error('Error leyendo archivo:', err);
        return res.status(500).json({ error: 'Error interno al leer el catálogo' });
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