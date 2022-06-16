const mongoose = require('mongoose');

const RolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Rol',RolSchema);