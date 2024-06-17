const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');

const router = Router();

// GET method route para obtener todos los tipos de equipos
router.get('/', async (req, res) => {
    try {
        const tiposEquipos = await TipoEquipo.find();
        res.json(tiposEquipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener tipos de equipos');
    }
});

// POST method route para crear un nuevo tipo de equipo
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'El estado debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo']),
], async (req, res) => {
    try {
        // Validar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Verificar si el tipo de equipo ya existe por su nombre
        const existeTipoEquipo = await TipoEquipo.findOne({ nombre: req.body.nombre });
        if (existeTipoEquipo) {
            return res.status(400).send('El tipo de equipo ya está registrado');
        }

        // Crear un nuevo tipo de equipo
        const tipoEquipo = new TipoEquipo({
            nombre: req.body.nombre,
            estado: req.body.estado,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        // Guardar el tipo de equipo en la base de datos
        await tipoEquipo.save();
        res.status(201).send(tipoEquipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear el tipo de equipo');
    }
});

module.exports = router;
