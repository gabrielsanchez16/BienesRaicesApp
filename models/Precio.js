import {DataTypes} from 'sequelize'
import {v4 as uuidv4} from 'uuid'
import db from '../config/db.js'

const Precio = db.define('precios', {
    id:{
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull:false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


export default Precio;