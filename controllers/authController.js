const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Rol = require('../models/Rol');

exports.login = async(req,res) =>{
    console.log(req.body.email);
    console.log(req.body.password);
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: 'ok', msj: 'Usuario o contaseña incorrecta'});
    }
    try{
        //obtenemos un usuario de la BD
        let usuario = await Usuario.findOne({email: email});
        
        console.log(usuario);
        if(usuario){
            //se compara la contraseña del login con el password encriptado
            const passwordValido = await bcrypt.compare(password,usuario.password);
            if(!passwordValido)
                return res.status(400).json({error: 'ok', msj: 'Usuario o contaseña incorrecta'}); 
            
            const jwtToken = jwt.sign(
                {
                    _id: usuario._id,
                }, 
                process.env.TOKEN_SECRET,
                {
                  expiresIn: '24h',
                }
            );
            
            res.cookie("jwt", jwtToken, {
                httpOnly: true,
                maxAge: 24*60*60*1000, //24hrs
              }
            );
            //res.json(usuario);
            //res.json({msj: 'Acceso Valido', usuario});
            res.json(
                {
                    mensaje: "logeado",
                    jwtToken
                }
            );
            /*/
            res.header('auth-token').json(
                {
                    user: {
                        _id: usuario._id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        role: usuario.role
                    },
                    jwtToken
                }
            );*/   
        }else{
            return res.status(400).send('Usuario o contraseña incorrecta');
        }  
    }catch(error){
        console.log(error);
        return res.status(400).send('Usuario o contraseña incorrecta');
    }
}

exports.register = async(req,res) =>{
    
    const {nombre,email,password} = req.body;

 
    if(!nombre || !email || !password){
        return res.status(400).json({msj: 'Digite todos los campos'});
    }
    try{
        let usuario;
        //guardamos un usuario en la BD
        usuario = new Usuario();

        usuario.nombre = nombre;
        usuario.email = email;

        const validaremail = await Usuario.findOne({email: email});

        if(validaremail){
            return res.status(409).json({msj: 'Email ya existe'});
        }

        usuario.password = await bcrypt.hash(password,10);

        //modo sincrono
        //usuario.password = bcrypt.hashSync(password,10);
        /*
        if(roles){
            const roles_asignados = await Rol.find({name: {$in: roles}});
            usuario.role = roles_asignados.map( rol => rol._id);
        }else{
            const rol = await Rol.find({nombre: "invitado"});
            console.log(rol);
            usuario.role = [rol._id];
        }*/
        const rol = await Rol.findOne({nombre: "invitado"});
        usuario.role = rol._id;

        const saveUSer = await usuario.save();

        const jwtToken = jwt.sign(
            {
                id: saveUSer._id,
            }, 
            process.env.TOKEN_SECRET,
            {
              expiresIn: '24h',
            }
        );
        res.cookie("jwt", jwtToken, {
            httpOnly: true,
            maxAge: 24*60*60*1000, // 3hrs in ms
        });

        res.json({
            mensaje: 'Usuario registrado correctamente',
            jwtToken
        });
        //res.send(usuario);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al guardar usuario');
    }
}
/*
exports.logout = async(req, res) =>{
    res.cookie("jwt", "", { maxAge: "1" });
    res.redirect("/api/tienda");
    res.json({mensaje: "sesion cerrada"});
}*/
