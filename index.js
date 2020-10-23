const express=require('express');
const conectarDB=require('./config/db')
//crear el servidor
const app=express();

conectarDB();
console.log("Comendando node send")
//puerto de la app
const port= process.env.PORT || 4000;

//Habilitar json req
app.use(express.json());

//rutas app
app.use('/api',require('./routes/index'));

//arrancar app
app.listen(port,()=>{
    console.log(`EL servidor esta funcionando en el puerto ${port}`)
})