const express = require('express');
const conectarBD = require('./config/db');
const createRol = require('./config/rol');
const cors = require('cors');
var cookieParser = require('cookie-parser');

const usuarios = require('./routes/usuario');
const productos = require('./routes/producto');
const auths = require('./routes/auth');
//const { adminAuth, userAuth } = require("./middleware/auth.js");

const app = express();  // se crea el servidor

conectarBD(); // establece la conexion con la BD
createRol(); //

app.use(express.json());  //permite trabajar con json
app.use(cookieParser());
app.use(cors());
app.use('/api/tienda/usuarios',usuarios);  //ruta de inicio del back
app.use('/api/tienda/productos',productos); 
app.use('/api/tienda/auth', auths);

app.get('/api/tienda',(req,res)=>{
    res.json({mensaje: "Bienvenido"});
})

/*rutas protegidas
app.use('/api/tienda/auth/login/user',userAuth, auths);
app.use('/api/tienda/auth/login/admin',adminAuth, auths);
*/

//puerto al cual se conecta el back

const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, () =>{
    console.log(`El servidor está en el puerto ${PORT}`);
});

// Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
  })