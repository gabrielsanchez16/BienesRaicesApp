import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
const protegerRuta = async (req,res,next) => {
    
    //Verificar si hay un token 

    const {_token} = req.cookies

    if(!_token){
        return res.render('auth/login')
    }

    //Comprobar un token
    try{

        const decoded = jwt.verify(_token,process.env.SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        //almacenar el usuario en el req
        if(usuario){
            req.usuario = usuario
        }else{
            return res.redirect('/auth/login', {
                csrfToken: req.csrfToken(),
            })
        }
        return next();
    }catch(error){
        return res.clearCookie('_token').redirect('/auth/login')
    }

}


export default protegerRuta;