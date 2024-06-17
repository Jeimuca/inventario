const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');

const router = Router();

// GET method route para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuarios');
    }
});

// POST method route para crear un nuevo usuario
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('estado', 'El estado debe ser "Activo" o "Inactivo"').isIn(['Activo', 'Inactivo']),
    check('rol', 'El rol debe ser "Administrador" o "Docente"').isIn(['Administrador', 'Docente']),
], async (req, res) => {
    try {
        // Validar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Verificar si el usuario ya existe por su email
        const existeUsuario = await Usuario.findOne({ email: req.body.email });
        if (existeUsuario) {
            return res.status(400).send('El email ya está registrado');
        }

        // Crear un nuevo usuario
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const usuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: hashedPassword,
            estado: req.body.estado,
            rol: req.body.rol,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        // Guardar el usuario en la base de datos
        await usuario.save();
        res.status(201).send(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear el usuario');
    }
});

module.exports = router;



