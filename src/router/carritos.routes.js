import Express, { json }  from "express";
import logger from "../logs/logger.js";
import { ContenedorDaoCarritos } from "../daos/index.js";
import {twilioPhone, twilioCliente, twilioWapp,adminWapp} from "../messages/twilio.js";
import { checkLogin } from "./middleware/checkLogin.js";
import { checkAdminRole } from "./middleware/checkRole.js";


/* ------------------------ configuracion del routerCarrito ------------------------ */
export const routerCarrito = Express.Router();


routerCarrito.use(Express.json());
routerCarrito.use(Express.urlencoded({extended: true}))

/* ------------------------------ GET: '/' ------------------------------ */
// Me permite listar todos los carritos disponibles
/* -------------- (disponible para usuarios y administradores) -------------- */
routerCarrito.get('/', checkLogin, checkAdminRole , async (req, res)=>{
    try{
        logger.info("Se pide lista completa de carritos")
            const listCarritos = await ContenedorDaoCarritos.getAll()
            console.log(req.user.email);
            return res.json({listCarritos})
        }
    catch(error){
        logger.error("Error en carritos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})

/* ------------------------------ GET: '/:id?' ------------------------------ */
// Me permite listar todos los carritos disponibles ó un carrito por su id 
/* -------------- (disponible para usuarios y administradores) -------------- */
routerCarrito.get('/:id', async (req, res)=>{
    try{
        const {id} = req.params
        const existeCarrito = await ContenedorDaoCarritos.getById(id)
        if(existeCarrito.length){
            logger.info("Se busca el carrito por ID: " +id)
            res.json(existeCarrito)
        } else return res.json({error: 'No existe el archivo solicitado'})
    }
    catch(error){
        logger.error("Error en carritos get id "+ error)
        res.status(500).send('Error en el servidor')
    }
})

/* -------------------------------- POST: '/' ------------------------------- */
/* ------------------ Para incorporar carritos al listado ------------------ */
/* --------------------  ------------------- */
routerCarrito.post('/', async (req, res)=> {
    try{
        const loadCarrito = {userID: req.user.email , productos: req.body }
        const nuevoId = await ContenedorDaoCarritos.save(loadCarrito)
        logger.info(`Se crea un nuevo carrito con id: ${nuevoId}`);
        return res.json({
            id: nuevoId,
            nuevoProducto: loadCarrito
        })
    }catch(error){
        logger.error("Error: " + error)
        res.status(500).send('Error en el servidor' + error)
    }    
})



/* -------------------------------- POST: '/comprar' ------------------------------- */
/* ------------------ Para incorporar carritos al listado ------------------ */
/* --------------------  ------------------- */
routerCarrito.post('/comprar', async (req, res)=> {
    try{
        const userID =  req.user.email
        const existeCarrito = await ContenedorDaoCarritos.getById(userID)
        if(existeCarrito.length){
            // SMS
            twilioCliente.messages.create({
                body: "Registro exitoso ",
                from: twilioPhone,
                to: req.user.telefono
            },
                (error) => {
                    if (error) {
                        logger.error("Hubo un erro al enviar el mensaje al usuario")
                    } else {
                        logger.info("Mensaje enviado correctamente")
                    }
                })

            // WHATSAPP
            twilioCliente.messages.create({
                body: `Registro exitoso ${existeCarrito}` ,
                from: `whatsapp:${twilioWapp}`,
                to: `whatsapp:${req.user.telefono}`
            },
                (error) => {
                    if (error) {
                        logger.error("Hubo un erro al enviar el mensaje al usuario")
                    } else {
                        logger.info("Mensaje enviado correctamente")
                    }
                })
            await ContenedorDaoCarritos.deletedById(userID)
            return res.json({message: "Compra efectuada con exito"})
        } else {
            return res.json({message: "El carrito esta vacio"})
        }
    }catch(error){
        logger.error("Error: " + error)
        res.status(500).send('Error en el servidor' + error)
    }    
})




/* ----------------------------- DELETE: '/:id' ----------------------------- */
/* ----------------------- Borra un carrito por su id ---------------------- */
/* -------------------- (disponible para administradores) ------------------- */
routerCarrito.delete('/:id',  async (req, res)=>{
    try{
        const {id} = req.params
        const carritoId=await ContenedorDaoCarritos.getById(id)
        if(carritoId.length){ //getById devuelve null en caso de que no exita el elemento con ID
            await ContenedorDaoCarritos.deletedById(parseInt(id))
            logger.info(`Se borra el elemento con id : ${id}`);
            res.json({message: "Carrito eliminado"})
        } else {
            res.json({error: "El carrito no existe"})
        }
    }
    catch(error){
        logger.error("Error: " + error)
        res.status(500).send('Error en el servidor')
    }
    
})
