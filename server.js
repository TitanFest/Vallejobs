// server.js

const express = require('express');
const { testConnection, sequelize } = require('./database');
require('dotenv').config();

// Cargar asociaciones (esto importa todos los modelos internamente)
require('./models/associations');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API Vallejobs!');
});

app.use('/Usuarios/', require('./routes/users'));
app.use('/Trabajos/', require('./routes/ofertas'));
app.use('/Categoria/', require('./routes/categoria'));
app.use('/Postulaciones/', require('./routes/postulaciones'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

const startServer = async () => {
    try {
        await testConnection();
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();