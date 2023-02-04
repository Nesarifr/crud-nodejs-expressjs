import Express  from "express";
import logger from "../logs/logger.js";
import passportAuth  from "./middleware/autho.js";
import { transporterEmail, emailAdmin } from "../messages/email.js";

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerRegister = Express.Router();

routerRegister.use(Express.json());
routerRegister.use(Express.urlencoded({extended: true}))

routerRegister.post('/' ,(req, res)=>{
        try{
            passportAuth.authenticate("signupStrategy", 
            {failureMessage: true}, //req.sessions.messages
            (error, user, info)=>{
                if(error || !user) {
                    return res.json({message:info.message})
                }
            req.logIn(user, function(error){
                if(error) res.json({message:"hubo un error al autenticar al usuario"});
                
                // MENSAJERIA MAIL
                transporterEmail.sendMail({
                    from:"Server node",
                    to:emailAdmin,
                    subject:"Nuevo registro",
                    text: `Nuevo usuario se registro usuario: ${user.email}`
                },
                (error,response)=>{
                    if(error) {
                        logger.error("Hubo un error al enviar el mail: "+error)
                    } else{
                        logger.info(`Mensaje de registro del usuario ${user.email} enviado`);
                    }
                })
                
                // MENSAJERIA MAIL


                res.json({user,message:info.message})
                })
            })(req,res)
            }
            
        catch(error){
                logger.error("error en querer registrar un usuario nuevo " + error)
                res.status(500).send('Error en el servidor')
            }
})