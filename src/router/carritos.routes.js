import Express  from "express";

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerCarrito = Express.Router();

routerCarrito.use(Express.json());
routerCarrito.use(Express.urlencoded({extended: true}))

/* ------------------------------ GET: '/:id?' ------------------------------ */
// Me permite listar todos los productos disponibles ó un producto por su id 
/* -------------- (disponible para usuarios y administradores) -------------- */

routerCarrito.get('/:id', async (req, res)=>{
    try{
        logger.info("Se busca el producto por ID")
        const {id} = req.params
        const existeProducto = await products.getById(id)
        if(existeProducto.length){
            res.json(await products.getById(parseInt(id)))
        } else return res.json({error: 'No existe el archivo solicitado'})
    }
    catch(error){
        logger.error("error en productos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})

