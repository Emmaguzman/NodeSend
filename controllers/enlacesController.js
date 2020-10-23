const Enlaces = require('../models/Enlace');

const { validationResult } = require('express-validator');
const shortid = require('shortid');
const bcryptjs=require('bcryptjs');


exports.nuevoEnlace = async (req, res, next) => {
    const errores=validationResult(req);
    //revisar si hay errores
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            msg:"Error De Validacion",
            errores:errores.array()
        });
    }


    //Crear un Objeto enlace
    const { nombre_original, nombre } = req.body;

    const enlace = new Enlaces();
    //Usuario no autenticado
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    //SI el usuario esta autenticado
    if (req.usuario) {
        const { password, descargas } = req.body;
        //asignar a enlace el numero de descargas
        if (descargas) {
            enlace.descargas = descargas;
        }
        //asignar un password
        if (password) {            
            const salt=await bcryptjs.genSalt();          
            enlace.password =await bcryptjs.hash(password,salt);
        }
        //asignar el autor
        enlace.autor = req.usuario.id
    }


    //Almacenar en la BD
   
    try {
        await enlace.save();
        return res.status(200).json({
            ok: true,
            msg: `${enlace.url}`
        })
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'ERRORR!'
        })
    }

    console.log(enlace);
}

exports.obtenerEnlace=async(req,res,next)=>{

    //  console.log(req.params.url);
    const {url}=req.params;
    const enlace=await Enlaces.findOne({url});    
    if(!enlace){
        res.status(404).json({
            ok:false,
            msg:"ENLACE NO ENCONTRADO"
        });
        return next();
    }
    //verificar si existe el enlace
    res.status(200).json({
        ok:true,
        archivo:enlace.nombre
    })

    const {descargas,nombre}=enlace;
    //si las descargas son iguales a 1 -borrar entrada y borrar archivo
    if(descargas===1){
        console.log('si solo 1')
        //eliminar el archivo
       req.archivo=nombre;
        //eliminar la entrada de la bd
        await Enlaces.findOneAndRemove(req.params.url);
        next();
    }else{
        //si las descargas son > a 1 - restar 1
        console.log(`Tenemos ${descargas} archivos`)
        enlace.descargas--;
        enlace.save();
    }

    
}