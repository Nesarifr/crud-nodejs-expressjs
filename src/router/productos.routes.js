import Express  from "express";

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerProducts = Express.Router();

routerProducts.use(Express.json());
routerProducts.use(Express.urlencoded({extended: true}))

/* ------------------------------ GET: '/' ------------------------------ */
// Me permite listar todos los productos disponibles
/* -------------- (disponible para usuarios y administradores) -------------- */

routerProducts.get('/', async (req, res)=>{
    try{
        logger.info("Se crean elementos random")
            const {animal, datatype, image} = faker
            const arrayElementsRandom = [];
            for(let i=0 ; i<5; i++){
                arrayElementsRandom.push({
                    id:datatype.uuid(),
                    title: animal.cat(),
                    price: datatype.number({ min: 10, max: 100}),
                    thumbnail:image.cats(150, 150, true)
                })
            }
            return res.json({arrayElementsRandom})
        }
    catch(error){
        logger.error("error en productos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})
/* ------------------------------ GET: '/:id?' ------------------------------ */
// Me permite listar todos los productos disponibles ó un producto por su id 
/* -------------- (disponible para usuarios y administradores) -------------- */

routerProducts.get('/:id', async (req, res)=>{
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
