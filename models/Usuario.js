const { Mongoose } = require("mongoose");

const {Schema,model}=require('mongoose')

const UsuarioSchema=Schema({
    ingreso:{
        type:Date,
        default: Date.now
    },
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true, //convierte a lower
        trim:true //saca los espacios 
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
});

module.exports=model('Usuarios',UsuarioSchema);