const jwt=require('jsonwebtoken');
require('dotenv').config()

module.exports=(req,res,next)=>{
      //Pedir el token por header
      const authHeader = req.get('Authorization');
      if (authHeader) {
          //console.log("No hay token");
          //Obtener token
          const token = authHeader.split(' ')[1];
          //combrobar JWT
          if(token){
          try {
              const usuario = jwt.verify(token, process.env.JwtSecret);
              req.usuario=usuario;
          } catch (error) {
              res.status(401).json({
                  ok:false,
                  msg:"TOKEN NO VALIDO"
              })
          }
        }
      }
  
      return next();
    
}