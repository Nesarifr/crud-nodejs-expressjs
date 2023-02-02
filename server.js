import express from 'express';
import * as HttpServer from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import parsedArgs from "minimist";
import logger from './src/logs/logger.js';
import {routerProducts} from './src/router/productos.routes.js'
import {routerCarrito} from './src/router/carritos.routes.js'
import {routerLogin} from './src/router/login.routes.js'
import {routerRegister} from './src/router/register.routes.js'


/* ------------------- constantes necesarias del servidor ------------------- */
const options = {default:{p:8080}, alias:{p:"puerto"}}
const objArguments = parsedArgs(process.argv.slice(2), options);
const app = express();
const httpServer = new HttpServer.createServer(app); 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 8080;

/* ------------------------------- configuracion del servidor ------------------------------- */
app.use(express.static(__dirname + '/src/public')) 
app.use(express.json());
app.use(express.urlencoded({extended: true}))




/* ------------------- rutas /api/productos ------------------- */
app.use('/api/productos', routerProducts );
app.use('/api/carrito', routerCarrito );
app.use('/api/login', routerLogin );
app.use('/api/register', routerRegister );



/* -------------------- Se crea el servidor y se enciende ------------------- */
httpServer.listen(PORT, ()=> logger.info(`Server listening on port ${PORT}`));