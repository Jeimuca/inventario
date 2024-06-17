
const express = require('express');
const { getConnection } = require('./db/connection-bd');


const app = express();
const port = 3000;

// Conexión a la base de datos
getConnection();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/auth', require('./router/auth'));
app.use('/usuario', require('./router/usuario')); 
app.use('/marca', require('./router/marca')); 
app.use('/tipoEquipo', require('./router/tipoEquipo')); 
app.use('/estadoEquipo', require('./router/estadoEquipo'));

// Middleware para manejar rutas no encontradas
//app.use((req, res, next) => {
    //res.status(404).send('Ruta no encontrada');
//});

// Middleware para manejar errores
//app.use((err, req, res, next) => {
    //console.error(err.stack);
    //res.status(500).send('Error interno del servidor');
//});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});



