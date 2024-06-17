const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { validationResult, check } = require('express-validator');

const router = Router();

// GET method route para obtener todos los registros de inventario
router.get('/', async (req, res) => {
    try {
        const inventario = await Inventario.find();
        res.json(inventario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener registros de inventario');
    }
});

// POST method route para crear un nuevo registro en el inventario
router.post('/', [
    check('serial', 'El serial es obligatorio').not().isEmpty(),
    check('modelo', 'El modelo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('foto_url', 'La URL de la foto no es válida').optional({ nullable: true }).isURL(),
    check('color', 'El color es obligatorio').not().isEmpty(),
    check('fechaCompra', 'La fecha de compra es obligatoria y debe ser una fecha válida').isDate(),
    check('precio', 'El precio es obligatorio y debe ser un número mayor a cero').isFloat({ gt: 0 }),
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('marca', 'El marca es obligatorio').not().isEmpty(),
    check('EstadoEquipo', 'El EstadoEquipo es obligatorio').not().isEmpty(),
    check('tipoEquipo', 'El tipoEquipo es obligatorio').not().isEmpty(),
], async (req, res) => {
    try {
        // Validar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Verificar si ya existe un equipo con el mismo serial
        const existeEquipo = await Inventario.findOne({ serial: req.body.serial });
        if (existeEquipo) {
            return res.status(400).send('Ya existe un equipo con este serial');
        }

        // Crear un nuevo registro de inventario
        const equipo = new Inventario({
            serial: req.body.serial,
            modelo: req.body.modelo,
            descripcion: req.body.descripcion,
            foto_url: req.body.foto_url || '', // Si no se proporciona, se establece como cadena vacía
            color: req.body.color,
            fechaCompra: req.body.fechaCompra,
            precio: req.body.precio,
            fechaRegistro: new Date(),
        });

        // Guardar el registro de inventario en la base de datos
        await equipo.save();
        res.status(201).send(equipo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear el registro de inventario');
    }
});

module.exports = router;

