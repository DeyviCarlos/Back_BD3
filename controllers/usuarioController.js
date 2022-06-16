//const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const Rol = require('../models/Rol');

exports.crear = async(req,res) =>{
    
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
        
        await usuario.save();
        res.json({mensaje: 'Usuario Creado correctamente'});
        //res.send(usuario);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al guardar usuario');
    }
}

exports.editarDatosPersonales = async(req, res) =>{
    try{
        const {nombre} = req.body;

        let usuario = await Usuario.findById(req.params.id);
        if(!usuario){
            return res.status(404).json({mensaje: 'Usuario no entontrado'});
        }
        usuario.nombre = nombre;

        usuario = await Usuario.findOneAndUpdate({_id: req.params.id},usuario,{new: true});
        /* 
        usuario = await Usuario.findOneAndUpdate({_id: req.params.id},{
            $set: {
                nombre: req.body.nombre,
                apellido_paterno: req.body.apellido_paterno
            }
        },{new: true}); 
        res.send(usuario);*/
        //res.json({mensaje: 'Usuario Editado correctamente'});
        res.json(
            {
                msg: "Editado correctamente",
                usuario
            });
    }catch(error){
        console.log(error);
        return res.status(500).send('Error al editar usuario');
    }
}

exports.obtener = async (req, res) =>{
    try{
        const usuarios = await Usuario.find({},{password: 0});
        res.json(usuarios);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al obtener usuario');
    }
}

exports.obtenerUsuario = async(req, res) =>{
    try{
        const usuario = await Usuario.findById(req.params.id);

        if(!usuario){
            res.status(404).json({mensaje: 'Usuario no entontrado'});
        }
        //mongoDB guarda los id con de la siguiente manera _id
        res.json(usuario);

    }catch(error){
        console.log(error);
        res.status(500).send('Error al buscar usuario');
    }
}

exports.eliminar = async(req, res) =>{
    try{
        const usuario = await Usuario.findById(req.params.id);

        if(!usuario){
            res.status(404).json({mensaje: 'Usuario no entontrado'});
        }
        //mongoDB guarda los id con de la siguiente manera _id
        await Usuario.findOneAndRemove({ _id: usuario._id});
        res.json({mensaje: 'Usuario eliminado correctamente'});

    }catch(error){
        console.log(error);
        res.status(500).send('Error al eliminar usuario');
    }
}

exports.miperfil = async (req,res) => {

    try{
        const usuario = await Usuario
        .findById(req.userId,{password: 0})
        .populate('role','nombre -_id');

        if(!usuario){
            res.status(404).json({mensaje: 'Usuario no entontrado'});
        }
        //mongoDB guarda los id con de la siguiente manera _id
        res.json(usuario);

    }catch(error){
        console.log(error);
        res.status(500).send('Usuario no encontrado');
    }
}
