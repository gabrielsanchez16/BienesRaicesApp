import sequelize from 'sequelize'
import bcrypt from 'bcrypt' 
import db from '../config/db.js'


const Usuario = db.define('usuarios',{
    id: {
        primaryKey: true,
        type: sequelize.DataTypes.UUID,
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
    }
})


//Metodos Personalizados

Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default Usuario