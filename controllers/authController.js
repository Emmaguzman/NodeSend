const Usuario = require('../models/Usuario');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res, next) => {


    //mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: "Error De Validacion",
            errores: errores.array()
        });
    }

    //buscar el usuario para ver si esta registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        res.status(401).json({
            ok: false,
            msg: "el usuario no existe"
        })
        return next();
    }

    //verificar el password y autenticar al usuario
    if (bcryptjs.compareSync(password, usuario.password)) {
        //Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre
        },
            process.env.JwtSecret,
            {
                expiresIn: '5h'
            }

        );
        res.json({
            ok: true,
            token
        })

        res.status(200).json({
            ok: true,
            msg: usuario
        });
    } else {
        res.status(401).json({
            ok: false,
            msg: "Password incorrecto"
        })
        return next();
    }


}
exports.usuarioAutenticado = async (req, res, next) => {
  //console.log(req.usuario)
    
  res.status(200).json({
        ok:true,
        usuario:req.usuario
  })
}