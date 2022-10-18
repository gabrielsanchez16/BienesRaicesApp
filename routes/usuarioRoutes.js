import express from "express";
import {formularioLogin, autenticar,cerrarSesion, formularioRegister,registrar,comprobar, formularioOlvidePassword, resetPassword,comprobarToken,nuevoPassword } from '../controllers/usuarioControllers.js';

const router = express.Router();

// Routing

router.route('/login')
    .get(formularioLogin)
    .post(autenticar)

router.route('/cerrar-sesion')
    .post(cerrarSesion)


router.route('/register')
    .get(formularioRegister)
    .post(registrar)

router.get('/comprobar/:token', comprobar)

router.route('/olvide-password')
    .get(formularioOlvidePassword )
    .post(resetPassword)

//Almacena el nuevo password

router.route('/olvide-password/:token')
    .get(comprobarToken)
    .post(nuevoPassword)




export default router