import Express  from "express";

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerLogin = Express.Router();

routerLogin.use(Express.json());
routerLogin.use(Express.urlencoded({extended: true}))

/* ------------------------------ GET: '/' ------------------------------ */
// Me permite listar todos los productos disponibles
/* -------------- (disponible para usuarios y administradores) -------------- */

routerLogin.get('/', async (req, res)=>{
    try{
        logger.info("Se accede a todos los productos.")
        const existeProducto = await products.getAll()
        if(existeProducto.length){
            res.json(await products.getById(parseInt(id)))
        } else return res.json({error: 'No existe el archivo solicitado'})
    }
    catch(error){
        logger.error("error en productos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})