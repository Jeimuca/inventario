const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');

const router = Router();

// GET method route para obtener todos los estados de equipos
router.get('/', async (req, res) => {
    try {
        const estadosEquipos = await EstadoEquipo.find();
        res.json(estadosEquipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener estados de equipos');
    }
});

// POST method route para crear un nuevo estado de equipo
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

        // Verificar si el estado de equipo ya existe por su nombre
        const existeEstadoEquipo = await EstadoEquipo.findOne({ nombre: req.body.nombre });
        if (existeEstadoEquipo) {
            return res.status(400).send('El estado de equipo ya está registrado');
        }

        // Crear un nuevo estado de equipo
        const estadoEquipo = new EstadoEquipo({
            nombre: req.body.nombre,
            estado: req.body.estado,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        // Guardar el estado de equipo en la base de datos
        await estadoEquipo.save();
        res.status(201).send(estadoEquipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear el estado de equipo');
    }
});

module.exports = router;
