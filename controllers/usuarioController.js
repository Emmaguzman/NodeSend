const bcrypt=require('bcryptjs');

const { validationResult } = require('express-validator');

const Usuario=require('../models/Usuario');


exports.nuevoUsuario=async(req,res)=>{

    //mostrar mensajes de error de express validator
    const errores=validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            msg:"Error De Validacion",
            errores:errores.array()
        });
    }
    

    //Verificar si el usuario ya esta registrado
    const {email,password}=req.body;
    let usuario=await Usuario.findOne({email});

    if(usuario){
        res.status(400).json({
            ok:false,
            msg:"El usuario ya esta registrado"
            }
        );
        return;
    }
    //crear un nuevo usuario
    usuario= new Usuario(req.body);
    const salt=await bcrypt.genSalt();
    usuario.password=await bcrypt.hash(password,salt)
    await usuario.save();
    res.json({
        ok:true,
        msg:"Usuario creado correctamente"
    })

}