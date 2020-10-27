const express=require('express');
const router=express.Router();

const auth = require('../middlewares/auth');

const archivosController=require('../controllers/archivosController');
router.post('/',
    auth,
    archivosController.subirArchivos
);

router.get('/:archivo',
archivosController.descargar,
archivosController.borrarArchivos
);
module.exports=router;