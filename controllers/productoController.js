const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');


exports.crear = async(req,res) =>{
    try{
        let producto;

        //guardamos un usuario en la BD
        producto = new Producto(req.body);

        await producto.save();
        //res.json({mensaje: 'Usuario Creado correctamente'});
        res.send(producto);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al guardar el producto');
    }
}

//Transaccion: Agregar producto 
exports.agregarProducto = async(req, res) => {
    
    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        
        const transactionResults = await session.withTransaction(
        async () => {

            const {descripcion,precio,categoria,unidadmedida} = req.body;
            const id_usuario = req.userId;

            const producto = new Producto();
            producto.descripcion = descripcion;
            producto.precio = precio;
            producto.categoria = categoria;
            producto.unidadMedida = unidadmedida;

            await producto.save({ session });

            let idproducto = await Producto.findOne({descripcion: descripcion},null,{session});

            let isusuario = await Usuario.findOne(
                { _id: id_usuario},
                null,
                {session}
            );

            if(!isusuario){
                res.status(404).json({mensaje: 'usuario no entontrado'});
                await session.abortTransaction();
                return;
            }

            isusuario = await Usuario.updateOne(
                {_id: id_usuario},
                { $addToSet: { produc: { _id: idproducto.id ,descripcion: idproducto.descripcion} }
                },
                { session }
            );

        },transactionOptions);
    
        if (transactionResults) {
            console.log("successfully created.");
            //res.json({mensaje: 'producto agregado correctamente'});
            res.json("Producto Agragado correctamente");
        } else {
            console.log("transaccion abortada.");
            res.status(500).send(err);
        }
    } catch (err) {
        res.status(500).send(err);
        console.log("transacción abortada"+err);
    }
    finally {
        await session.endSession();
    }
}

//Editar producto
exports.editar = async(req, res) =>{
    try{
        const {descripcion, precio,estado} = req.body; 

        let producto = await Producto.findById(req.params.id);
        if(!producto){
            res.status(404).json({mensaje: 'Producto no entontrado'});
        }

        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.estado = estado;
        
        producto = await Producto.findOneAndUpdate({_id: req.params.id},producto,{new: true});
        /* 
        res.send(producto);*/
        //res.json({mensaje: 'producto Editado correctamente'});
        res.json(producto);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al editar Producto');
    }
}

//Obtener la lista de producto y mis productos
exports.obtener = async (req, res) =>{
    try{

        const producto = await Producto.find();

        res.json(producto);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al obtener producto');
    }
}

//Obtenre 1 prodructo
exports.obtenerProducto = async(req, res) =>{
    try{
        const producto = await Producto.findById(req.params.id);

        if(!producto){
            res.status(404).json({mensaje: 'Producto no entontrado'});
        }
        //mongoDB guarda los id con de la siguiente manera _id
        res.json(producto);

    }catch(error){
        console.log(error);
        res.status(500).send('Error al buscar producto');
    }
}
//mis productos
exports.obtener = async (req, res) =>{
    try{
        const producto = await Producto.find();
        res.json(producto);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al obtener producto');
    }
}

exports.misProductos = async function (req, res) {
    try {
      const productos = await Producto.aggregate(
        [{ "$lookup": { "from": "Usuario", "localField": "idVendedor", "foreignField": "ruc", "as": "Usuario" } },
        { "$project": { "_id": 0, "Usuario": { "_id": 0, "clave": 0, "correo": 0, "telefono": 0, "ruc": 0 } } },
        { "$unwind": { "path": "$Usuario", "preserveNullAndEmptyArrays": true } },
        { "$project": { "nombreVendedor": "$Usuario.nombre", "idVendedor": 1, "nombre": 1, "categoria": 1, "precio": 1, "unidadDeMedida": 1, "calificacion": 1 } }]);
      res.json(productos);
    } catch (error) {
      res.status(500).send(error);
    }
  };

//Eliminar Producto
exports.eliminar = async(req, res) =>{
    try{
        const producto = await Producto.findById(req.params.id);

        if(!producto){
            res.status(404).json({mensaje: 'producto no entontrado'});
        }
        //mongoDB guarda los id con de la siguiente manera _id
        await Producto.findOneAndRemove({ _id: req.params.id});
        res.json({mensaje: 'producto eliminado correctamente'});

    }catch(error){
        console.log(error);
        res.status(500).send('Error al eliminar producto');
    }
}
//Transaccion: Eliminar Producto
exports.eliminarProducto = async(req, res) => {
    
    const session = await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        
        const transactionResults = await session.withTransaction(
        async () => {

            const idProducto = req.params.id;
            
            const producto = await Producto.findById(idProducto);

            if(!producto){
                res.status(404).json({mensaje: 'producto no entontrado'});
            }
            


            let idproducto = await Producto.findOneAndRemove({_id: idProducto},null,{session});

            let isusuario = await Usuario.findOne(
                { email: email},
                null,
                {session}
            );

            if(!isusuario){
                res.status(404).json({mensaje: 'usuario no entontrado'});
                await session.abortTransaction();
                return;
            }

            isusuario = await Usuario.updateOne(
                {email: email},
                { $addToSet: { produc: { _id: idproducto.id ,descripcion: idproducto.descripcion} }
                },
                { session }
            );

        },transactionOptions);
    
        if (transactionResults) {
            console.log("successfully delete.");
            //res.json({mensaje: 'producto agregado correctamente'});
            res.json(req.body)
        } else {
            console.log("transaccion abortada.");
            res.status(500).send(err);
        }
    } catch (err) {
        res.status(500).send(err);
        console.log("transacción abortada"+err);
    }
    finally {
        await session.endSession();
    }
}

//Agregar Comentario al producto
exports.agregarComentario = async function (req, res) {
    try {
      const productoPrevio = await Producto.findOne({ "nombre": req.query.nombre, "idVendedor": req.query.idVendedor })
      if (productoPrevio) {
        productoPrevio.comentarios.push(req.body.comentario)
        productoPrevio.save();
        res.json(productoPrevio);
      }
      else
        res.status(500).send(error);
    }
    catch (error) {
      res.status(500).send(error);
    }
  };
