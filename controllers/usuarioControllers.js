import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import { generarId, generarJwt } from '../helpers/tokens.js'
import { emailRegistro,emailOlvidePassword } from '../helpers/emails.js'
import Usuario from '../models/Usuario.js'
import {v4 as uuidv4} from 'uuid'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async(req,res) => {
    //Validaciones
    await check('email').isEmail().withMessage('El Email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La Contraseña no debe estar vacio').run(req)

    let resultado = validationResult(req)

    //verificar que el resultado este vacio



    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                email: req.body.email
            }
        })
    }
    
    const {email, password} = req.body

    //Comprobar si el usuario existe

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{msg:'El Usuario no existe'}],
            csrfToken: req.csrfToken(),
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{msg:'Tu cuenta no ha sido confirmada'}],
            csrfToken: req.csrfToken()
    })}

    //comprobar la password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            errores: [{msg:'Tus Credenciales no son correctas'}],
            csrfToken: req.csrfToken()
    })
    }

    //Autenticar el usuario
    const token = generarJwt({id:usuario.id, nombre: usuario.nombre})
    

    //Almacenar en un cookie

    return res.cookie('_token', token, {
        httpOnly: true,
    }).redirect('/mis-propiedades')

}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    //validaciones
    await check('nombre').notEmpty().withMessage('El Nombre no puede estar vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 6 }).withMessage('La Contraseña debe ser minima de 6 caracteres').run(req)
    await check('repetirPassword').equals(req.body.password).withMessage('Las Contraseñas no coinciden').run(req)


    let resultado = validationResult(req)

    //verificar que el resultado este vacio



    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/register', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    //Extraer los datos
    const { nombre, email, password } = req.body

    // Verificacion del correo que sea unico

    const existUsuario = await Usuario.findOne({ where: { email: req.body.email } })

    if (existUsuario) {
        return res.render('auth/register', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'El Usuario ya esta Registrado' }],
            csrfToken: req.csrfToken(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

    }
    //Almacenar un Usuario
    const usuario = await Usuario.create({
        id: uuidv4(),
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un Email de Confirmacion, presione en el enlace'
    })
}

//Funcion que comprueba una cuenta

const comprobar = async (req, res) => {
    const { token } = req.params

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/comprobar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, Intenta de nuevo',
            error: true
        })
    }

    //Confirmar Cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    return res.render('auth/comprobar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La Cuenta se Confirmo Correctamente',
        error: false
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera Tu Acceso a Bienes Raices',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {

    //validaciones

    await check('email').isEmail().withMessage('Eso no parece un email').run(req)


    let resultado = validationResult(req)

    //verificar que el resultado este vacio

    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/olvide-password', {
            pagina: 'Recupera Tu Acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Buscar el usuario

    const {email} = req.body

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera Tu Acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{msg: "El email no pertenece a ningun usuario"}]
        })
    }

    //Generar un token y enviar el email

    usuario.token = generarId();
    await usuario.save();

    //enviar el email

    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //Renderizar un mensaje

    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Contraseña',
        mensaje: 'Hemos enviado un Email con las Intrucciones'
    })

}


const comprobarToken = async(req, res) => {
    const {token} = req.params

    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auth/comprobar-cuenta', {
            pagina: 'Reestablece tu Contraseña',
            mensaje: 'Hubo un error al validar tu informacion, Intenta de nuevo',
            error: true
        })
    }

    //Mostrar formulario para modificar el password

    res.render("auth/resetPassword", {
        pagina: 'Reestablece Tu Contraseña',
        csrfToken: req.csrfToken(),
    })
}

const nuevoPassword = async(req,res) => {

    //Validaciones
    await check('password').isLength({ min: 6 }).withMessage('La Contraseña debe ser minimo de 6 caracteres').run(req)
    await check('repetirPassword').equals(req.body.password).withMessage('Las Contraseñas no coinciden').run(req)

    let resultado = validationResult(req)

    //verificar que el resultado este vacio



    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/resetPassword', {
            pagina: 'Reestablece Tu Contraseña',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
        })
    }
    //Identificar

    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({where:{token}})

    //Hashear nueva password

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null

    await usuario.save()

    res.render('auth/comprobar-cuenta', {
        pagina: 'Contraseña Reestablecida',
        mensaje: 'La Contraseña se guardo correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegister,
    registrar,
    comprobar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}