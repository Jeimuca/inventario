const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');

const router = Router();



// POST method route para crear un nuevo usuario
router.post('/', [
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),

], async (req, res) => {
    try {
        // Validar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        // Verificar si el usuario ya existe por su email
        const usuario = await Usuario.findOne({ email: req.body.email });
        if (usuario) {
            return res.status(400).json({ mensaje: 'usuario no encontrado' });
        }

        const esIgual = bcrypt.compareSync(req.body.password, usuario.password);
        if (!esIgual) {
            return res.status(400).json({ mensaje: 'usuario no encontrado' });
        }

        res.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear el usuario');
    }
});

module.exports = router;