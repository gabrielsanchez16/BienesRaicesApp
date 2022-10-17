import Propiedad from './Propiedad.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'

//automaticamente sequelize crea la llave foranea pero podemos pasarle el nombre que queramos
Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'})
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})
Propiedad.hasMany(Mensaje, {foreignKey: 'propiedadId'})

Mensaje.belongsTo(Propiedad, {foreignKey: 'propiedadId'})
Mensaje.belongsTo(Usuario, {foreignKey: 'usuarioId'})

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario,
    Mensaje
}