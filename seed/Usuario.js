import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'Gabriel Sanchez',
        email: 'gsanchezalarcon52@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios;