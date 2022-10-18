import express from 'express'
import {inicioAdmind, categoriasAdmind, noEncontradoAdmind, buscadorAdmind} from '../controllers/admindControllers.js'
import protegerRutas from '../middlewares/protegerRuta.js'


const router = express.Router()

//Pagina de Inicio
router.route('/')
    .get(protegerRutas,inicioAdmind)

//Categorias 

router.route('/categorias/:id')
    .get(protegerRutas,categoriasAdmind)

//Pagina 404

router.route('/404')
    .get(protegerRutas,noEncontradoAdmind)

//Buscador

router.route('/buscador')
    .post(protegerRutas,buscadorAdmind)


export default router;