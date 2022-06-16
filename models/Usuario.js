const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol'
    },
    produc:[{
        descripcion: {type: String}
    }]
});

module.exports = mongoose.model('Usuario',UsuarioSchema);