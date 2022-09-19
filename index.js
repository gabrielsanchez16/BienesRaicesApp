import  express  from "express"; //module con js
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import usuariosRoutes from "./routes/usuarioRoutes.js";
import db from './config/db.js'
import dotenv from 'dotenv'
dotenv.config({path: ".env"})
// Crear la app

const app = express();

//Habilitar lectura de datos de formularios

app.use(express.urlencoded({extended:true}))

//Habilitar Cookie parser

app.use( cookieParser())


//Habilitar CSURF

app.use(csurf({cookie:true}))

//Conexion a la base de datos

try {
    await db.authenticate();
    db.sync()
    console.log('conexion correcta a la base de datos')
}catch(error){
    console.log(error)
}

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta Publica

app.use(express.static('public'))

//Routing

app.use('/auth', usuariosRoutes)


//Definir un puerto y arrancar el proyecto


app.listen(process.env.PORT || 3000, () => {
    console.log(`El servidor esta funcionando en el puerto ${process.env.PORT}`);
})

/*

distintas maneras de importar express 

const express = require('express') //common js

// Crear la app

const app = express();

// Routing

app.get('/', function(req, res){
    res.json({msg: "hola mundo express"})
})

//Definir un puerto y arrancar el proyecto

const port = 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})

*/