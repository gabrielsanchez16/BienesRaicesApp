import {DataTypes} from 'sequelize'
import {v4 as uuidv4} from 'uuid'
import db from '../config/db.js'

const Categoria = db.define('categorias', {
    id:{
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull:false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})


export default Categoria;