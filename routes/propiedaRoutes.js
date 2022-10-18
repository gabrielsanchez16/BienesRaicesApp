import express from "express"
import { body } from 'express-validator'
import {admin,crear,guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstadoPropiedad, mostrarPropiedad,enviarMensaje,verMensajes, mostrarPropiedadAdmin, enviarMensajeAdmin
}from '../controllers/propiedadController.js'
import protegerRuta from "../middlewares/protegerRuta.js"
import upload from '../middlewares/subirImagen.js'
import identificarUsuario from '../middlewares/identificarUsuario.js'

const router = express.Router()



router.route('/mis-propiedades')
    .get(protegerRuta,admin)

router.route('/propiedades/crear')
    .get(protegerRuta,crear)
    .post(
            protegerRuta,
            body('titulo')
                .notEmpty().withMessage('El titulo del anuncio es Obligatorio'),
            body('descripcion')
                .notEmpty().withMessage('La descripcion no puede estar vacia')
                .isLength({max: 250}).withMessage('La Descripcion es muy Larga'),
            body('categoria')
                .notEmpty().withMessage('Seleccione la categoria'),
            body('precio')
                .notEmpty().withMessage('Seleccione un rango de precios'),
            body('habitaciones')
                .isNumeric().withMessage('Seleccione la cantidad de habitaciones'),
            body('estacionamiento')
                .isNumeric().withMessage('Seleccione la cantidad de estacionamientos'),
            body('wc')
                .isNumeric().withMessage('Seleccione la cantidad de baños'),
            body('lat')
                .notEmpty().withMessage('Ubica la propiedad en el mapa'),
            guardar
        )

router.route('/propiedades/agregar-imagen/:id')
        .get(protegerRuta,agregarImagen)
        .post(protegerRuta,upload.single('imagen'),almacenarImagen)

router.route('/propiedades/editar/:id')
        .get(protegerRuta,editar)
        .post(
            protegerRuta,
            body('titulo')
                .notEmpty().withMessage('El titulo del anuncio es Obligatorio'),
            body('descripcion')
                .notEmpty().withMessage('La descripcion no puede estar vacia')
                .isLength({max: 250}).withMessage('La Descripcion es muy Larga'),
            body('categoria')
                .notEmpty().withMessage('Seleccione la categoria'),
            body('precio')
                .notEmpty().withMessage('Seleccione un rango de precios'),
            body('habitaciones')
                .isNumeric().withMessage('Seleccione la cantidad de habitaciones'),
            body('estacionamiento')
                .isNumeric().withMessage('Seleccione la cantidad de estacionamientos'),
            body('wc')
                .isNumeric().withMessage('Seleccione la cantidad de baños'),
            body('lat')
                .notEmpty().withMessage('Ubica la propiedad en el mapa'),
            guardarCambios
            )
router.route('/propiedades/eliminar/:id')
    .post(protegerRuta,eliminar)

router.route('/propiedades/:id')
    .put(protegerRuta,cambiarEstadoPropiedad)

router.route('/propiedad/admin/:id')
        .get(protegerRuta,identificarUsuario,mostrarPropiedadAdmin)
        .post(//Almacenar los mensajes
            protegerRuta,
            identificarUsuario,
            body('mensaje').isLength({min:15}).withMessage('Muy corto el mensaje'),
        enviarMensajeAdmin
        )

//Area Publica


router.route('/propiedad/:id')
    .get(identificarUsuario,mostrarPropiedad)
    .post(//Almacenar los mensajes
        identificarUsuario,
        body('mensaje').isLength({min:15}).withMessage('Muy corto el mensaje'),
        enviarMensaje
        )

router.route('/mensajes/:id')
    .get(protegerRuta,verMensajes)


    
export default router