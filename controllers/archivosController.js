const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

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
exports.borrarArchivos = async (req, res) => {
    console.log(req.archivo)

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log( `archivo Eliminado`)
    } catch (error) {        
        console.log(error)
    }
}
