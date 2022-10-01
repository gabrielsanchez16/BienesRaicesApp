import {DataTypes} from 'sequelize'
import db from '../config/db.js'


const Propiedad = db.define('propiedades',{
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    calle: {
        type: DataTypes.STRING(60),
        allowNull:false
    },
    lat:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lng:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

})


export default Propiedad;