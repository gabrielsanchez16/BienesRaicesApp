import sequelize from 'sequelize'
import bcrypt from 'bcrypt' 
import db from '../config/db.js'
import {v4 as uuidv4} from 'uuid'

const Usuario = db.define('usuarios',{
    id: {
        primaryKey: true,
        type: sequelize.DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
    },
    nombre: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    token:  sequelize.DataTypes.STRING,
    confirmado: sequelize.DataTypes.BOOLEAN
},{
    hooks: {
        beforeCreate: async function(usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt)
        }
    },
    scopes: { //los scopes sirven para eliminar informacion que no queremos que vean en alguna consulta
        eliminarPassword:{
            attributes:{
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
})


//Metodos Personalizados

Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default Usuario