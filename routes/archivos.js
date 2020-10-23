const express=require('express');
const router=express.Router();

const auth = require('../middlewares/auth');

const archivosController=require('../controllers/archivosController');
router.post('/',
    auth,
    archivosController.subirArchivos
);
module.exports=router;