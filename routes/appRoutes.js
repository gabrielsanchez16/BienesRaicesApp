import express from 'express'
import {inicio, categorias, noEncontrado, buscador} from '../controllers/appControllers.js'
const router = express.Router()

//Pagina de Inicio
router.route('/')
    .get(inicio)


//Categorias 

router.route('/categorias/:id')
    .get(categorias)

//Pagina 404

router.route('/404')
    .get(noEncontrado)

//Buscador

router.route('/buscador')
    .post(buscador)


export default router;