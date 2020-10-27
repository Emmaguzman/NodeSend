const Enlaces = require('../models/Enlace');

const { validationResult } = require('express-validator');
const shortid = require('shortid');
const bcryptjs = require('bcryptjs');

//Generar nuevo enlace
exports.nuevoEnlace = async (req, res, next) => {
    const errores = validationResult(req);
    //revisar si hay errores
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: "Error De Validacion",
            errores: errores.array()
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
            const salt = await bcryptjs.genSalt();
            enlace.password = await bcryptjs.hash(password, salt);
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
//retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
    // console.log(req.params.url);
    const { url } = req.params;
    console.log(url);
    // Verificar si existe el enlace
    const enlace = await Enlaces.findOne({ url });
    if(!enlace) {
        res.status(404).json({msg: 'Ese Enlace no existe'});
        return next();
    }
    if(enlace.password) {
        return res.json({ password: true, enlace: enlace.url });
    }

    next();
}
//Obtener enlace por ID
exports.obtenerEnlace = async (req, res, next) => {

    //  console.log(req.params.url);
    const { url } = req.params;
    //console.log(url)
    const enlace = await Enlaces.findOne({ url });
    if (!enlace) {
        res.status(404).json({
            ok: false,
            msg: "ENLACE NO ENCONTRADO"
        });
        return next();
    }
    //verificar si existe el enlace
    res.json({ archivo: enlace.nombre,password:false })
    next();
}

//Obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res,next) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({ enlaces })
    } catch (error) {
        console.log(error)
    }
}

//Verifica si password es correcto
exports.verificarPassword=async (req,res,next)=>{
    
    const {url}=req.params;
    const {password}=req.body
    //Consultar por el enlace
    const enlace=await Enlaces.findOne({url});

    //Verificar el password
    if(bcryptjs.compareSync(password,enlace.password)){
        //Permitir al usuario descargar el archivo
        next();
    }else{
        return res.status(401).json({
            ok:false,
            msg:"PASSWORD INCORRECTO"
        })
    }
    
    
   
    

}