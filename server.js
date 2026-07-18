//  IMPORTS
require('dotenv').config();
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const app = express();


//  MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));



//  RUTAS
app.get('/catalogo', async (req, res) => {
    // primero obtenemos la query con el parámetro "tipo"
    const { tipo } = req.query;

    // si el parametro "tipo" no está , entonces lanza error
    if (!tipo) {
        return res.status(400).json({ error: 'Falta el parámetro "tipo" en la query string' });
    }

    //    como hay solo dos tipos de parametros , pelicula y serie y si no es ninguna , lanza error
    if (tipo !== 'peliculas' && tipo !== 'series') {
        return res.status(400).json({ error: 'El parámetro "tipo" debe ser "peliculas" o "series"' });
    }

    try {

        const contenido = await fs.readFile(rutaArchivo, 'utf-8');
        console.log(contenido)

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