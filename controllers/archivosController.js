const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');



exports.subirArchivos = async (req, res, next) => {
    //***********CONFIGURACION MULTER***********/
    const configuracionMulter = {
        //PARA ARCHIVOS  Auth=10MB noAuth=1MB
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                //const extension = file.mimetype.split('/')[1];
                //---------------------
                //Tomar el ultimo . para la extencion
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`);
            }
            //PARA FILTRAR ARCHIVOS QUE NO QUEREMOS QUE SE SUBAN
            // fileFilter:(req,file,cb)=>{
            //     if(file.mimetype==='application/pdf'){
            //         return cb(null,true);
            //     }
            //}
        })
    }
    //--------------------------------
    const upload = multer(configuracionMulter).single('archivo');
    //--------------------------------

    upload(req, res, async (err) => {
        console.log(req.file);
        if (!err) {
            res.json({
                ok: true,
                archivo: req.file.filename
            });
        } else {
            console.log(err)
            return next()
        }

    })

}
exports.borrarArchivos = async (req, res, next) => {
    console.log(req.archivo)

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log(`archivo Eliminado`)
    } catch (error) {
        console.log(error)
    }
}

//descarga un archivo
exports.descargar = async (req, res, next) => {
    //Obtiene el enlace
    const { archivo } = req.params
    const enlace = await Enlaces.findOne({ nombre: archivo });

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    //Eliminar el archivo y la entrada en la bd
    const { descargas, nombre } = enlace;
    //console.log(descargas , nombre)
    //si las descargas son iguales a 1 -borrar entrada y borrar archivo
    if (descargas === 1) {
        console.log('si solo 1')
        //eliminar el archivo
        req.archivo = nombre;
        //eliminar la entrada de la bd
        await Enlaces.findOneAndRemove(enlace.id);
        next();
    } else {
        //si las descargas son > a 1 - restar 1
        console.log(`Tenemos ${descargas} archivos`)
        enlace.descargas--;
        await enlace.save();
    }
}


