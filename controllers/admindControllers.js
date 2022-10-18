import {Sequelize} from 'sequelize'
import {Categoria, Precio, Propiedad} from '../models/index.js'

const inicioAdmind = async (req, res) => {

    const [categorias, precios, casas, departamentos,terrenos] = await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [{
                model: Precio,
                as:'precio'
            }],
            order: [['createdAt','DESC' ]]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 3
            },
            include: [{
                model: Precio,
                as:'precio'
            }],
            order: [['createdAt','DESC' ]]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 4
            },
            include: [{
                model: Precio,
                as:'precio'
            }],
            order: [['createdAt','DESC' ]]
        }),
    ]) 

    

    res.render('inicio-admin', {
        pagina: 'Inicio',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        casas,
        departamentos,
        terrenos
    })
} 

const categoriasAdmind = async(req, res) => {
    const {id} = req.params

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)

    if(!categoria){
        return res.redirect('/inicio/404')
    }

    const propiedades = await Propiedad.findAll({
        where:{
            categoriaId: id
        },
        include:[
            {model: Precio, as:'precio'}
        ]
    })

        res.render('categorias-admin', {
            pagina:`${categoria.nombre}s en Venta`,
            propiedades,
            csrfToken: req.csrfToken(),
        })

} 


const noEncontradoAdmind= (req, res) => {
    res.render('404-admin',{
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken(),
    })
} 


const buscadorAdmind = async (req, res) => {
    const {termino} = req.body
    
    // Validar que no este vacio el buscador

    if(!termino.trim()){
        return res.redirect('back')
    }

    //Consultar las Propiedades
    const propiedades = await Propiedad.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include:[{
            model:Precio, as:'precio'
        }]
    })

    res.render('busqueda-admin',{
        pagina: `Resultados de ${termino}`,
        propiedades,
        csrfToken: req.csrfToken(),
    })

} 



export {
    inicioAdmind,
    categoriasAdmind,
    buscadorAdmind,
    noEncontradoAdmind
}