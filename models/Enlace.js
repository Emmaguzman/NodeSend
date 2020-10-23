const mongoose=require('mongoose');
const {Schema,model} = require("mongoose");

const EnlacesShema=new Schema({    
    nombre:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    nombre_original:{
        type:String,
        required:true
    },
    descargas:{
        type:Number, 
        default:1       
    },
    autor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuarios',
        default:null
    },
    password:{
        type:String,
        default:null
    },
    creado:{
        type:Date,
        default:Date.now
    }
});


module.exports=model('Enlaces',EnlacesShema)