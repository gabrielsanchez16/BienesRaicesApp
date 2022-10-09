import express from "express"
import { body } from 'express-validator'
import {admin,crear,guardar, agregarImagen, almacenarImagen}from '../controllers/propiedadController.js'
import protegerRuta from "../middlewares/protegerRuta.js"
import upload from '../middlewares/subirImagen.js'

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
                .notEmpty().withMessage('La descripcion no puede ser vacia')
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
    
export default router