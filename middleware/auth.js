const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');

exports.verifyToken = async (req, res, next) =>{
    
    try {
        //validacion con token
        /*
        const token = req.cookies.jwt;
        console.log('Token: '+token)
        if (!token) 
            return res.status(401).json({ error: 'token no es válido' });

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded._id;

        const usuario = await Usuario.findById(req.userId, {password: 0});
        if(!usuario)
            return res.status(401).json({ error: 'usuario no encontrado' });

        next()*/
        //validacion con el headers
        if(!req.headers.authorization)
            return res.status(401).json("No autorizado");
        
        const token = req.headers.authorization.substr(7);
        if(token !== ''){
            const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
            req.userId = decoded._id;

            const usuario = await Usuario.findById(req.userId, {password: 0});
            if(!usuario)
                return res.status(401).json({ error: 'usuario no encontrado' });
            
            next()
        }else{
            return res.status(400).json({error: 'token no válido'})
        }

    } catch (error) {
        return res.status(400).json({error: 'token no es válido'})
    }
}

exports.adminAuth = async (req,res,next) => {
    console.log('id user: '+req.userId);
    try {
        const usuario = await Usuario.findById(req.userId);
        const role = await Rol.findOne({_id: usuario.role});

        console.log(usuario.nombre);
        console.log(role.nombre);
        //const roles = await Rol.fin({_id: {$in: usuario.role}})  // + de 1 rol
        if(role.nombre === "admin" || role.nombre === "productor"){
            next() // continuamos
        }else{
            return res.status(400).json({error: 'no cuenta con los permisos suficientes'})
        }   
    } catch (error) {
        return res.status(400).json({error: 'token no es válido'});
    }
}


exports.userAuth = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.userId);
        const role = await Rol.findOne({_id: usuario.role});
        if(role.nombre === "productor" || role.nombre === "cliente"){
            next(); // continuamos
            return;
        }      
    } catch (error) {
        return res.status(400).json({error: 'token no es válido'});
    }
}