const express=require('express');
const conectarDB=require('./config/db')
const cors=require('cors')
//crear el servidor
const app=express();

conectarDB();
console.log("Comendando node send")
//Habilitar cors
console.log(`Aceptado ${process.env.FRONTEND_URL}`)
const opcionesCors={
    origin:process.env.FRONTEND_URL
}
app.use(cors(opcionesCors));

//puerto de la app
const port= process.env.PORT || 4000;

//Habilitar json req
app.use(express.json());

//Habilitar carpeta publica
app.use(express.static('uploads'))

//rutas app
app.use('/api',require('./routes/index'));

//arrancar app
app.listen(port,()=>{
    console.log(`EL servidor esta funcionando en el puerto ${port}`)
})