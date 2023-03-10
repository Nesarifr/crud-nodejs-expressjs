import Express  from "express";
import logger from "../logs/logger.js";
import passportAuth  from "./middleware/autho.js";

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerLogin = Express.Router();

routerLogin.use(Express.json());
routerLogin.use(Express.urlencoded({extended: true}))

/* ------------------------------ GET: '/' ------------------------------ */
// Me permite listar todos los productos disponibles
/* -------------- (disponible para usuarios y administradores) -------------- */

routerLogin.post('/', async (req, res)=>{ passportAuth.authenticate(
                'loginStrategy', {failureRedirect: '/', failureMessage: true },
                (error, user , info)=>{
                if(error || !user){
                    return res.json(info)
                }
                if(user){
                    req.logIn(user, function(error){
                        if(error) return res.json({message:"hubo un error al autenticar al usuario"});
                        else return res.json({message: "Se logueo el user: " + req.body.email})
                })
            }
        })(req, res)
    }, )

routerLogin.delete('/logout', (req, res)=>{
    try{
        logger.info(req.sessionID)
        req.logout(err=>{
            if(err) return res.status(400).json({message:"hubo un error al cerrar sesion" + err})
        })

        return res.status(200).json({message:"Sesion cerrada!"})
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
});