import {Sequelize} from 'sequelize'
import {Categoria, Precio, Propiedad} from '../models/index.js'

const inicio = async (req, res) => {

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

    

    res.render('inicio', {
        pagina: 'Inicio',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        casas,
        departamentos,
        terrenos
    })
} 

const categorias = async(req, res) => {
    const {id} = req.params

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)

    if(!categoria){
        return res.redirect('/404')
    }

    const propiedades = await Propiedad.findAll({
        where:{
            categoriaId: id
        },
        include:[
            {model: Precio, as:'precio'}
        ]
    })

        res.render('categoria', {
            pagina:`${categoria.nombre}s en Venta`,
            propiedades,
            csrfToken: req.csrfToken(),
        })

} 


const noEncontrado= (req, res) => {
    res.render('404',{
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken(),
    })
} 


const buscador = async (req, res) => {
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

    res.render('busqueda',{
        pagina: `Resultados de ${termino}`,
        propiedades,
        csrfToken: req.csrfToken(),
    })

} 



export {
    inicio,
    categorias,
    buscador,
    noEncontrado
}