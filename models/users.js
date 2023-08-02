const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Elimina los espacios en blanco
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, // No se puede repetir
        lowercase: true, // Convierte el texto a minusculas
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    register: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model('User', UsersSchema);