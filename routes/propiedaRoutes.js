import express from "express"
import {admin,crear}from '../controllers/propiedadController.js'


const router = express.Router()



router.route('/mis-propiedades')
    .get(admin)

router.route('/propiedades/crear')
    .get(crear)


   
    
export default router