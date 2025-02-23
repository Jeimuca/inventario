const { Schema, model } = require('mongoose');
const EstadoEquipo = require('./EstadoEquipo');

const InventarioSchema = Schema({
    serial: { type: String, required: true, unique: true },
    modelo: { type: String, required: true },
    descripcion: { type: String, required: true },
    foto_url: { type: String }, // URL de la foto del equipo
    color: { type: String, required: true },
    fechaCompra: { type: Date, required: true },
    precio: { type: Number, required: true },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }, // Referencia al usuario a cargo

    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: true
    }, // Referencia a la marca del equipo

    EstadoEquipo: {
        type: Schema.Types.ObjectId,
        ref: 'EstadoEquipo',
        required: true
    }, // Referencia al estado del equipo

    tipoEquipo: {
        type: Schema.Types.ObjectId,
        ref: 'TipoEquipo',
        required: true
    }, // Referencia al tipo de equipo

    fechaCreacion: {type: Date, required: true},
    fechaActualizacion: {type: Date, required: true}

})

module.exports = model('Inventario', InventarioSchema);