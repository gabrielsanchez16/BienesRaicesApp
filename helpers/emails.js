import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure:true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
        console.log(datos)
        const {email, nombre, token} = datos
      

      await transport.sendMail({
        from: '"BienesRaicesTurin" <gabrielpelota.8@gmail.com>',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaicesTurin',
        text: 'Confirma tu cuenta en BienesRaicesTurin',
        html: `
            <h1>Hola ${nombre}, Bienvenido a BienesRaicesTurin </h1>
            
            <p>Tu cuenta ya esta lista, solo presiona para confirmar la cuenta en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}/auth/comprobar/${token}">Confirmar Cuenta</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
            `
      })
}

const emailOlvidePassword = async (datos) => {
  var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
      console.log(datos)
      const {email, nombre, token} = datos
    

    await transport.sendMail({
      from: 'BienesRaicesTurin',
      to: email,
      subject: 'Restablece tu Contraseña en BienesRaicesTurin',
      text: 'Restablece tu Contraseña en BienesRaicesTurin',
      html: `
          <h1>Hola ${nombre}, Bienvenido a BienesRaicesTurin has solicitado reestablecer tu Contraseña </h1>
          
          <p>Sigue el siguiente enlace para generer una Contraseña nueva:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8000}/auth/olvide-password/${token}">Reestablecer Contraseña</a>
          </p>

          <p>Si tu no solicitaste el cambio de la Contraseña, puedes ignorar este mensaje</p>
          `
    })
}
    
export {
    emailRegistro,
    emailOlvidePassword
}