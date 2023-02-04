import Express  from "express";
import logger from "../logs/logger.js";

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerHome = Express.Router();

routerHome.use(Express.json());
routerHome.use(Express.urlencoded({extended: true}))


/* ------------------------------ GET: '/' ------------------------------ */
// Me permite listar todos los productos disponibles
/* -------------- (disponible para usuarios y administradores) -------------- */
routerHome.get('/', async (req, res)=>{
    try{
        let user;
        if(req.isAuthenticated()){
            user=req.session.username
        } else {
            user = "Visita"
        }
        return res.redirect('api/productos')
        }
    catch(error){
        logger.error("error en la pagina principal "+ error)
        res.status(500).send('Error en el servidor')
    }
})