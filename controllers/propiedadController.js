import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad, Mensaje, Usuario } from '../models/index.js'
import {esVendedor, formatearFecha} from '../helpers/index.js'

const admin = async (req, res) => {

    const { pagina: paginaActual } = req.query
    

    const expresion = /^[1-9]$/

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.usuario

        //limites y Offset para el paginador
        const limit = 5
        const offset = ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes' },
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])



        res.render('propiedades/admin', {
            pagina: "Mis Propiedades",
            csrfToken: req.csrfToken(),
            propiedades,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error)
    }

}



//Formulario para crear propiedad

const crear = async (req, res) => {
    //Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: "Crear Propiedad",
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {

    //Validacion
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {

        //Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: "Crear Propiedad",
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //Crear un registro
    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body
    const { id: usuarioId } = req.usuario
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        })

        const { id } = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req, res) => {

    const { id } = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad no este publicada

    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visita la pagina
    if (propiedad.usuarioId !== req.usuario.id) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad,
    })
}

const almacenarImagen = async (req, res, next) => {
    const { id } = req.params

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad no este publicada

    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad pertenece a quien visita la pagina
    if (propiedad.usuarioId !== req.usuario.id) {
        return res.redirect('/mis-propiedades')
    }

    try {

        //Almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1


        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }
}

const editar = async (req, res) => {

    const { id } = req.params
    //Validar que la propiedad exista
    const propiedades = await Propiedad.findByPk(id)

    if (!propiedades) {
        res.redirect('/mis-propiedades')
    }

    //Revisar quien visita la url es el propietario
    if (propiedades.usuarioId !== req.usuario.id) {
        res.redirect('/mis-propiedades')
    }

    //Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedades.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedades
    })
}

const guardarCambios = async (req, res) => {


    //validar los campos
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {

        //Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])


        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    const { id } = req.params
    //Validar que la propiedad exista
    const propiedades = await Propiedad.findByPk(id)

    if (!propiedades) {
        res.redirect('/mis-propiedades')
    }

    //Revisar quien visita la url es el propietario
    if (propiedades.usuarioId !== req.usuario.id) {
        res.redirect('/mis-propiedades')
    }

    //Reescribir la informacion y actualizarla
    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

        propiedades.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedades.save();

        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }

}

const eliminar = async (req, res) => {
    const { id } = req.params

    //Validar que la propiedad exista
    const propiedades = await Propiedad.findByPk(id)

    if (!propiedades) {
        res.redirect('/mis-propiedades')
    }

    //Revisar quien visita la url es el propietario
    if (propiedades.usuarioId !== req.usuario.id) {
        res.redirect('/mis-propiedades')
    }


    //Eliminar la Imagen Asociada

    await unlink(`public/uploads/${propiedades.imagen}`)

    //Eliminar la propiedad

    await propiedades.destroy();
    res.redirect('/mis-propiedades')
}

//Inactivar o Activar una propiedad 

const cambiarEstadoPropiedad = async(req,res)=>{
    const { id } = req.params

    //Validar que la propiedad exista
    const propiedades = await Propiedad.findByPk(id)

    if (!propiedades) {
        res.redirect('/mis-propiedades')
    }

    //Revisar quien visita la url es el propietario
    if (propiedades.usuarioId !== req.usuario.id) {
        res.redirect('/mis-propiedades')
    }



    //Actualizar estado
    propiedades.publicado = !propiedades.publicado

    await propiedades.save()

    res.json({
        resultado:'ok'
    })

}


//Muestra una Propiedad

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params

    

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    if (!propiedad || !propiedad.publicado) {
        res.redirect('/404')
    }

    


    res.render(`propiedades/mostrar`, {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}

const mostrarPropiedadAdmin = async (req, res) => {
    const { id } = req.params

    

    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    if (!propiedad || !propiedad.publicado) {
        res.redirect('/inicio/404')
    }

    


    res.render(`propiedades/mostrar-admin`, {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}

const enviarMensajeAdmin = async(req, res)=>{
    const { id } = req.params

   
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    if (!propiedad) {
        res.redirect('/inicio/404')
    }

    //Renderizar los errores
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        res.render(`propiedades/mostrar-admin`, {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        })
    }

    //Almacenar mensaje
    const {mensaje} = req.body
    const { id:propiedadId } = req.params
    const {id: usuarioId} = req.usuario

    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })


    res.render(`propiedades/mostrar-admin`, {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado:true
    })
}

const enviarMensaje = async(req, res)=>{
    const { id } = req.params

   
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    if (!propiedad) {
        res.redirect('/404')
    }

    //Renderizar los errores
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        res.render(`propiedades/mostrar`, {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        })
    }

    //Almacenar mensaje
    const {mensaje} = req.body
    const { id:propiedadId } = req.params
    const {id: usuarioId} = req.usuario

    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })


    res.render(`propiedades/mostrar`, {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado:true
    })
}

//Leer Mensajes Recibidos 

const verMensajes = async(req,res)=>{
    const { id } = req.params

    //Validar que la propiedad exista
    const propiedades = await Propiedad.findByPk(id,{
        include: [
            { model: Mensaje, as: 'mensajes',
                include:[
                    { model:Usuario.scope('eliminarPassword'), as:'usuario'}
                ]
        }
        ]
    })

    if (!propiedades) {
        res.redirect('/mis-propiedades')
    }

    //Revisar quien visita la url es el propietario
    if (propiedades.usuarioId !== req.usuario.id) {
        res.redirect('/mis-propiedades')
    }
    res.render('propiedades/mensajes',{
        pagina: 'Mensajes',
        mensajes: propiedades.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad,
    mostrarPropiedadAdmin,
    enviarMensajeAdmin,
    cambiarEstadoPropiedad,
    enviarMensaje,
    verMensajes

}