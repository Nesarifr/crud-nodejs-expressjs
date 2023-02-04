import express from 'express';
import * as HttpServer from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import parsedArgs from "minimist";
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';

import logger from './src/logs/logger.js';
import { envConfig } from './src/config/envConfig.js';
import {routerProducts} from './src/router/productos.routes.js'
import {routerCarrito} from './src/router/carritos.routes.js'
import {routerLogin} from './src/router/login.routes.js'
import {routerRegister} from './src/router/register.routes.js'
import {routerHome} from './src/router/home.routes.js'

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
//configuracion se la sesion
app.use(session({
    //donde se guardan las sesiones
    store: MongoStore.create({
        mongoUrl: envConfig.MONGOURL_SESSION
    }),
    secret:"claveSecreta",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize()) 
app.use(passport.session())

/* ------------------- rutas /api/productos ------------------- */
app.use('/', routerHome );
app.use('/api/productos', routerProducts );
app.use('/api/carrito', routerCarrito );
app.use('/api/login', routerLogin );
app.use('/api/register', routerRegister );


/* ---------------------- definicion motor de plantilla --------------------- */
app.engine('hbs', engine({extname: 'hbs'}))
app.set('views', path.join(__dirname,'/src/public/views')) //ubicacion de templates
app.set('view engine', 'hbs') // definitar motor para express

/* -------------------- Se crea el servidor y se enciende ------------------- */
httpServer.listen(PORT, ()=> logger.info(`Server listening on port ${PORT}`));