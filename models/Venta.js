const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    nombreProducto: {
        type: String,
        required: true
    },
    cantidad: {
        type: String,
        required: true,
        unique: true
    },
    precio:{
        type: String,
        required: true,
    },
    fecha:{
        type: Date,
        required: true,
    },
    idComprador:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    idVendedor:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Venta',VentaSchema);