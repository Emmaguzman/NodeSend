const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const usuarioController = require('../controllers/usuarioController')


router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no es valido').isEmail(),
        check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.nuevoUsuario
);

module.exports = router;