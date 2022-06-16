const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: String,
        enum: ['Alimento', 'Higiene','Ropa','Hogar','Tecnologia']
    },
    unidadMedida: {
        type: String,
        enum: ['Paquete','Unidad','Kg']
    },
    estado:{
        type: Boolean,
        default: true
    },
    comentarios: [
        {    
            cuerpo: String,
            fecha: Date
        }
    ]
});

module.exports = mongoose.model('Producto',ProductoSchema);