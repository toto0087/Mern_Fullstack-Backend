import nodemailer from "nodemailer"

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {nombre,email,token} = datos

      // enviar mail 
      const info = await transport.sendMail({
        from: "APV - ADM DE VETERINARIA",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `<p> Hola ${nombre}, comprueba tu cuenta en APV. </p>
          <p> Tu cuenta esta lista, solo tenes que comprabarla en el siguiente enlace:  
          <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta </a> </p>
          <p> Si no creaste esta cuenta ignora el mensaje </p>        
          `  
      })
    console.log("Mensaje enviado: %s", info.messageId)
}

export default emailRegistro