const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise','mysql2');
const app = express();
const path = require('path');//N
const moment=require('moment')
// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname)));//N
// Configuración de express-session
const session = require('express-session');
 app.use(session({
  secret: 'miSecreto', // Cambia esto a una cadena segura en un entorno de producción
  resave: false,
  saveUninitialized: true,
}));
// Configurar conexión a la base de datos
const db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'manzanamp'
  }

// Ruta para manejar el registro de usuarios
 app.post('/crear', async (req, res) => {
  const { Nombre, Tipo,Documento,Man } = req.body;

  try {
    // Verificar si el usuario ya existe
    const conect= await mysql.createConnection(db)
    const [rows] = await conect.execute('SELECT * FROM usuario WHERE Documento = ? AND Tipo=?', [Documento,Tipo])
    
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
      await conect.execute('INSERT INTO usuario (Nombre, Tipo,Documento,Id_M1) VALUES (?, ?,?,?)', [Nombre, Tipo,Documento,Man]);

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
      await conect.end()
    }
     // Cerrar la conexión
     await conect.end()
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
}); 


// Ruta para manejar el login
app.post('/iniciar', async (req, res) => {
  const { Tipo, Documento } = req.body;

  try {
    const conect= await mysql.createConnection(db)
    // Verificar las credenciales
    const [rows] = await conect.execute('SELECT * FROM usuario WHERE Tipo = ? AND Documento = ?', [Tipo, Documento]);   
     
    console.log(rows)
    if (rows.length > 0) {
      // Redirigir a la página después del inicio de sesión exitoso      
      const [rows2] = await conect.execute('SELECT manzanas.Nombre FROM usuario INNER JOIN manzanas ON usuario.Id_M1= manzanas.Id_M  WHERE usuario.Nombre = ?', [rows[0].Nombre]); 
      req.session.usuario = rows[0].Nombre;
      req.session.Documento = Documento;
      const usuario = { nombre: rows[0].Nombre };
      console.log(usuario)
      res.locals.usuario = usuario;
      res.locals.Documento = Documento;
      res.sendFile(path.join(__dirname, 'usuario.html'));
      await conect.end()
    } else {
      // Redirigir a la página de inicio de sesión con un mensaje de error
      res.status(401).send('paila');
    }
    await conect.end()
  } catch (error) {
    console.error('Error en el servidor:', error);
    // Redirigir a la página de inicio de sesión con un mensaje de error
    res.status(500).send('error');
  }
}); 
app.get('/obtener-usuario', (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.json({ nombre: usuario });
  } else {
    res.status(401).send('Usuario no autenticado');
  }
});
// Ruta para obtener los servicios del usuario
app.post('/obtener-servicios-usuario', async (req, res) => {
  const usuario = req.session.usuario 
  
  //res.send(usuario);
  console.log(usuario)
  try {
    const conect= await mysql.createConnection(db)
    // Modifica la consulta según tu esquema de base de datos
    const [serviciosData] = await conect.execute('SELECT servicios.Nombre FROM servicios INNER JOIN m_s ON m_s.Id_S1=servicios.Id_S INNER JOIN manzanas on m_s.Id_M1= manzanas.Id_M INNER JOIN usuario ON manzanas.Id_M=usuario.Id_M1 WHERE usuario.Nombre = ?', [usuario]);
    console.log(serviciosData)
    // Enviar los servicios al cliente
    res.json({ servicios: serviciosData.map(row => row.Nombre) });

    // Cerrar la conexión
   await conect.end();
  }
   catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para guardar los servicios seleccionados por el usuario
app.post('/guardar-servicios-usuario', async (req, res) => {
  const usuario = req.session.usuario
  const Documento= req.session.Documento
  const {  servicios, fechaHora } = req.body;
  console.log("hola",usuario)
  console.log(servicios)
  console.log(Documento)
  try {
    // Conectar a la base de datos usando mysql2/promise
    const conect= await mysql.createConnection(db)
    const [IDS] = await conect.query('SELECT servicios.`Id_S` FROM servicios WHERE servicios.`Nombre`=?;', [servicios]);
    const [IDU] = await conect.execute('SELECT usuario.`Id` FROM usuario WHERE usuario.`Documento`=?', [Documento]);
    console.log(IDU[0].Id,IDU)
    // Insertar los nuevos servicios seleccionados
      await conect.query('INSERT INTO solicitudes (`Fecha`,`Id1`,`CodigoS`) VALUES(?,?,?)', [fechaHora,IDU[0].Id,IDS[0].Id_S]);
    // Enviar una respuesta exitosa al cliente
    res.status(200).send('Servicios guardados exitosamente');
    // Cerrar la conexión
    await conect.end();
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
});
app.post('/obtener-servicios-guardados', async (req, res) => {
  const usuario = req.session.usuario;
  const Documento= req.session.Documento
  try {
    // Conectar a la base de datos y consultar los servicios guardados por el usuario
    const conect = await mysql.createConnection(db);
    const [IDU] = await conect.execute('SELECT usuario.`Id` FROM usuario WHERE usuario.`Documento`=?', [Documento]);
    const [serviciosGuardadosData] = await conect.execute('SELECT servicios.Nombre, solicitudes.`Fecha`,solicitudes.`Id_solicitudes` FROM servicios INNER JOIN m_s ON m_s.`Id_S1` = servicios.`Id_S` INNER JOIN manzanas ON m_s.`Id_M1`=manzanas.Id_M INNER JOIN usuario ON manzanas.Id_M = usuario.`Id_M1` INNER JOIN solicitudes ON usuario.`Id`=solicitudes.`Id1` WHERE solicitudes.`Id1`=? AND servicios.`Id_S`=solicitudes.`CodigoS`;', [IDU[0].Id]);
    console.log(serviciosGuardadosData)
    console.log(IDU[0].Id) 
  
    
  /* const serviciosFormateados = serviciosGuardadosData.map(servicio => {
      // Aquí formateas la fecha y hora utilizando moment.js
      const fechaHoraFormateada = moment(servicio.fechaHora).format('YYYY-MM-DD HH:mm:ss ');
      
      // Devuelves el servicio con la fecha y hora formateadas
      return {
        ...servicio,
        fechaHora: fechaHoraFormateada
      };
    });
    console.log("bb",fechaHoraFormateada) */
    const serviciosGuardadosFiltrados = serviciosGuardadosData.map(servicio => ({
      Nombre: servicio.Nombre,
      Fecha: servicio.Fecha,
      id: servicio.Id_solicitudes
      // Agrega más propiedades si es necesario
    }));
    
    // Enviar los datos de los servicios guardados al cliente
    res.json({ serviciosGuardados: serviciosGuardadosFiltrados

    });

    // Cerrar la conexión
    await conect.end();
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
});
app.delete('/eliminar-servicio/:id', async (req, res) => {
  const servicioId = req.params.id;
  console.log("hola",servicioId)
  try {
      // Realizar la lógica para eliminar el servicio de la base de datos
      // Por ejemplo:
      // await Servicio.findByIdAndDelete(servicioId); // Utiliza el método correspondiente de tu modelo de servicio
      // Luego, envía una respuesta exitosa al cliente
      res.status(200).send('Servicio eliminado exitosamente');
  } catch (error) {
      console.error('Error al eliminar servicio:', error);
      res.status(500).send('Error al eliminar servicio');
  }
});
// Ruta para cerrar sesión
app.post('/cerrar-sesion', (req, res) => {
  // Destruir la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.status(500).send('Error al cerrar sesión');
    } else {
      // Redirigir a la página de inicio de sesión o cualquier otra página deseada
      res.status(200).send('Sesión cerrada correctamente');
    }
  });
});
  app.listen(3000, () => {
    console.log(`Servidor Node.js escuchando`);
  })