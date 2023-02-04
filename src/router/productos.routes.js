import Express  from "express";
import logger from "../logs/logger.js";
import { ContenedorDaoProductos } from "../daos/index.js";
import { faker } from '@faker-js/faker';
import parsedArgs from "minimist";
import cluster from  "cluster"
const numeroCPUs = 4 // pruebo con un maximo de 3 cpu

/* ------------------------ configuracion del routerProducts ------------------------ */
export const routerProducts = Express.Router();

const modoCluster = process.argv[5] == "CLUSTER"
faker.setLocale('es')
routerProducts.use(Express.json());
routerProducts.use(Express.urlencoded({extended: true}))

/* ------------------------------ GET: '/' ------------------------------ */
// Me permite listar todos los productos disponibles
/* -------------- (disponible para usuarios y administradores) -------------- */
routerProducts.get('/', async (req, res)=>{
    try{
        if(modoCluster){
            logger.info("Se hacen pruebas en modo cluster")
            if(cluster.isPrimary){
                // logger.info(" es primary")
                //crear los subproceso del cluster
                if(cluster.workers.length<=numeroCPUs){
                    cluster.fork()
                }
                logger.info("Se pide lista completa de productos")
                const listProducts = await ContenedorDaoProductos.getAll()
         
                cluster.on("exit",(worker,error)=>{
                    //detectamos que algun subproceso falla
                    console.log(`El subproceso ${worker.process.pid} dejo de funcionar`);
                    cluster.fork();//creamos un nuevo subproceso que remplaza al que fallo
                });
                res.json(listProducts)
            } else {
                logger.info("Se pide lista completa de productos " )
                const listProducts = await ContenedorDaoProductos.getAll()
                return res.json(listProducts)
            }
        } else {

            logger.info("Se pide lista completa de productos" )
                const listProducts = await ContenedorDaoProductos.getAll()
                // const listProducts = JSON.stringify(await ContenedorDaoProductos.getAll())
                // return res.render('home', {productos: JSON.parse(listProducts), user: "Visita"}) para handlebars
                return res.json(listProducts)
        }
    }
    catch(error){
        logger.error("error en productos get "+ error)
        res.status(500).send('Error en el servidor')
    }
})
/* ------------------------------ GET: '/:id?' ------------------------------ */
// Me permite listar todos los productos disponibles ó un producto por su id 
/* -------------- (disponible para usuarios y administradores) -------------- */
routerProducts.get('/:id', async (req, res)=>{
    try{
        const {id} = req.params
        const existeProducto = await ContenedorDaoProductos.getById(id)
        if(existeProducto.length){
            logger.info("Se busca el producto por ID: " +id)
            res.json(existeProducto)
        } else return res.json({error: 'No existe el archivo solicitado'})
    }
    catch(error){
        logger.error("Error en productos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})

/* -------------------------------- POST: '/' ------------------------------- */
/* ------------------ Para incorporar productos al listado ------------------ */
/* -------------------- (disponible para administradores) ------------------- */
routerProducts.post('/', async (req, res)=> {
    try{
        const loadProduct = req.body
        const nuevoId = await ContenedorDaoProductos.save(loadProduct)
        logger.info(`Se crea un nuevo producto con id: ${nuevoId} llamado: ${loadProduct.title}`);
        return res.json({
            id: nuevoId,
            nuevoProducto: loadProduct
        })
    }catch(error){
        logger.error("Error: " + error)
        res.status(500).send('Error en el servidor' + error)
    }    
})

/* ------------------------------- PUT: '/:id' ------------------------------ */
/* --------------------- Actualiza un producto por su id -------------------- */
/* -------------------- (disponible para administradores) ------------------- */
routerProducts.put('/:id',  async (req, res)=>{
    try{
        const {id} = req.params
        const upDate = req.body
        const actualizacion = await ContenedorDaoProductos.updateById( upDate, parseInt(id))
        if(actualizacion){
            logger.info(`Se actualizo el elemento: ` + await ContenedorDaoProductos.getById(id));
            res.json({message: "Se actualizo el elemento solicitado con id:"+id})
        } else res.json({error: "No se pudo actualizar el producto solicitado"})
    }
    catch(error){
        logger.error("Error: " + error)
        res.status(500).send('Error en el servidor')
    }
})

/* ----------------------------- DELETE: '/:id' ----------------------------- */
/* ----------------------- Borra un producto por su id ---------------------- */
/* -------------------- (disponible para administradores) ------------------- */
routerProducts.delete('/:id',  async (req, res)=>{
    try{
        const {id} = req.params
        const productoID=await ContenedorDaoProductos.getById(id)
        if(productoID.length){ //getById devuelve null en caso de que no exita el elemento con ID
            await ContenedorDaoProductos.deletedById(parseInt(id))
            logger.info(`Se borra el elemento con id : ${id}`);
            res.json({message: "Producto eliminado"})
        } else {
            res.json({error: "El producto no existe"})
        }
    }
    catch(error){
        logger.error("Error: " + error)
        res.status(500).send('Error en el servidor')
    }
    
})