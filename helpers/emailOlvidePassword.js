import nodemailer from "nodemailer"

const emailOlvidePassword = async (datos) => {
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
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p> Hola ${nombre}, has solicitado reestablecer tu password. </p>
          <p> Clickea el siguiente link para generar un nuevo password:  
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>
          <p> Si no creaste esta cuenta ignora el mensaje </p>        
          `  
      })
    console.log("Mensaje enviado: %s", info.messageId)
}

export default emailOlvidePassword