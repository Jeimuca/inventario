const { Router } = require('express');
const Marca = require('../models/Marca');
const { validationResult, check } = require('express-validator');

const router = Router();

// GET method route para obtener todas las marcas
router.get('/', async (req, res) => {
    try {
        const marcas = await Marca.find();
        res.json(marcas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener marcas');
    }
});

// POST method route para crear una nueva marca
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

        // Verificar si la marca ya existe por su nombre
        const existeMarca = await Marca.findOne({ nombre: req.body.nombre });
        if (existeMarca) {
            return res.status(400).send('La marca ya está registrada');
        }

        // Crear una nueva marca
        const marca = new Marca({
            nombre: req.body.nombre,
            estado: req.body.estado,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        // Guardar la marca en la base de datos
        await marca.save();
        res.status(201).send(marca);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear la marca');
    }
});

module.exports = router;
