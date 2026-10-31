const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Actualización automática con Dokploy!',
    version: '2.0.0',
    institucion: 'Universidad del Quindío',
    curso: 'Administración de Infraestructura de TI',
    fecha: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ estado: 'saludable', version: '2.0.0' });
});

app.get('/db', async (req, res) => {
  try {
    const c = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    const [rows] = await c.query('SELECT NOW() AS ahora');
    await c.end();
    res.json({ conexion: 'ok', ...rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, '0.0.0.0', () => console.log(`Servidor en puerto ${port}`));
