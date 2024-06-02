const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
// Configuración de express-session
/* app.use(session({
  secret: 'miSecreto', // Cambia esto a una cadena segura en un entorno de producción
  resave: false,
  saveUninitialized: true,
})); */
// Configurar conexión a la base de datos
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pepe'
  });
  db.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
  });
/*   // Manejar el formulario POST registrar usuario
app.post('/crear', (req, res) => {
    const { Nombre, Tipo, Documento } = req.body;
 
    const insertQuery = `INSERT INTO usuario (Nombre, Tipo, Documento) VALUES (?, ?, ?)`
  
    db.query(insertQuery, [Nombre, Tipo, Documento], (err, result) => {
      console.log('Datos insertados correctamente');
      res.status(201).send(`OK   `);
    }); 
  if (err) {
    console.error('Error al insertar datos: ' + err.stack);
    res.status(500).send('Error interno del servidor');
    return;
  }
}) */


// Ruta para manejar el registro de usuarios
 app.post('/crear', async (req, res) => {
  const { Nombre, Tipo,Documento } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [rows] = await db.query('SELECT * FROM usuario WHERE Documento = ? AND Tipo=?', [Documento,Tipo]);

    if (rows.length > 0) {
      res.status(409).send(`
      <script>
        // Mostrar un alert al cargar la página
        window.onload = function() {
          alert('Usuario ya existe');
          window.location.href = '/inicio.html';
        };
      </script>
    `);
    } else {
      // Insertar un nuevo usuario
      await db.query('INSERT INTO usuario (Nombre, Tipo,Documento) VALUES (?, ?,?)', [Nombre, Tipo,Documento]);

      // Redirigir a la página de inicio después del registro exitoso
      res.status(201).send(`
        <script>
          // Mostrar un alert al cargar la página
          window.onload = function() {
            alert('Datos guardados');
            window.location.href = '/inicio.html';
          };
        </script>
      `);
      
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
}); 


// Ruta para manejar el login
app.post('/iniciar', async (req, res) => {
  const { Tipo, Documento } = req.body;

  try {
    // Verificar las credenciales
    const [rows] = await db.query('SELECT * FROM usuario WHERE Tipo = ? AND Documento = ?', [Tipo, Documento]);   
     
    console.log(rows)
    if (rows.length > 0) {
      // Redirigir a la página después del inicio de sesión exitoso
      /* res.status(200).send('ok'); */
      res.redirect(`/bienvenida?usuario=${rows[0].Nombre}`);
    } else {
      // Redirigir a la página de inicio de sesión con un mensaje de error
      res.status(401).send('paila');
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    // Redirigir a la página de inicio de sesión con un mensaje de error
    res.status(500).send('error');
  }
}); 
app.get('/bienvenida', (req, res) => {
  // Renderizar la página de bienvenida con los detalles del usuario
  res.sendFile(__dirname + '/usuario.html');
});
  app.listen(3000, () => {
    console.log(`Servidor Node.js escuchando`);
  })