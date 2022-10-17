import express from "express";
import {propiedades} from '../controllers/apiControllers.js'
const router = express.Router()


router.route("/propiedades")
    .get(propiedades)



export default router;