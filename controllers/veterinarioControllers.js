import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import IDGenerator from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req,res) => {
    const { email , nombre } = req.body;

    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario) {
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({ msg: error.message}) //cambiamos status del mensaje y si hay un mail repetido esto me lo devuelve como error
    // usamos return porque asi no ejecuta las lineas por debajo si encuentra el erorr
    }

    try {
        // guardar nuevo veterinario-registro
        const veterinario = new Veterinario(req.body) //nueva instancia de veterinarios con toda la info correspondiente 
        const veterinarioGuardado = await veterinario.save();

        // envia el mail
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });


        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }

};  

const perfil = (req,res) => {
    const {veterinario} =  req
    res.json({perfil: veterinario})
}


const confirmar = async (req,res) => {
    const {token} = req.params

    const usuarioConfirmar = await Veterinario.findOne({token})

    if(!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(404).json({msg : error.message}) // si el token no existe no esta confirmado el usuario 
    }

    try {
        usuarioConfirmar.token = null; // si el token si existe  esta confirmado el usuario 
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()

        res.json({msg:"Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }

}

const autenticar = async (req,res) => {
    const {email,password} = req.body

    const usuario = await Veterinario.findOne({email})
    if(!usuario) {
        const error = new Error("usuario no existe")
        return res.status(404).json({msg : error.message}) // si el mail no existe 
    }
    
    //corroborar si usuario esta autenticado 
    if(!usuario.confirmado) {
        const error = new Error("La cuenta no ha sido confirmada")
        return res.status(403).json({msg : error.message}) // si el mail no existe 
    }

    // autenticar usuario
    if( await usuario.compararFuncion(password)) {
            
            res.json({
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                token: generarJWT(usuario.id),
            })

        } else {
            const errores = new Error("Password incorrecto")
            return res.status(403).json({msg : errores.message}) // si el mail no existe 
        }
    }


const olvidePassword = async (req,res) => {
    const {email} = req.body
    const existeVeterinario = await Veterinario.findOne({email})

    if (!existeVeterinario) {
        const error = new Error("El usuario no existe")
        return res.status(400).json({msg: error.message})
    }
    try {
        existeVeterinario.token = IDGenerator()
        await existeVeterinario.save()
        
        //enviar mail
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        })
        
        res.json({ msg: "Hemos enviado un email con las intrucciones"})

    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req,res) => {
    const {token} = req.params;

    const tokenValido = await Veterinario.findOne({token})

    // persona accedio a su mail y abrio correctamente el enlace
    if(tokenValido) {
        //el usuario existe
        res.json( {msg: "Token valido y usuario existe"} )
    } else {
        const error = new Error("token no valido")
        return res.status(400).json({msg: error.message})
    }
}

const nuevoPassword = async (req,res) => {
    //validamos token denuevo por si alguien entra en url y cambia el token en algun lugar
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario) {
        const error = new Error("Token no valido")
        return res.status(400).json({msg: error.message})   
    }

    try {
        //token de uso unico por si alguien quiere cambiar password de user.
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();

        res.json({msg: "Password modificado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req,res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario) {
        const error = new Error("hubo un error")
        return res.status(400).json( {msg: error.message} )
    }


    const {email} = req.body
    if(veterinario.email !== req.body.email) {
        const existeUser = await Veterinario.findOne({email})
        if(existeUser) {
            const error = new Error("Ya existe el usuario")
            return res.status(400).json({ msg: error.message })
        }
    }


    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre
        veterinario.email = req.body.email || veterinario.email
        veterinario.web = req.body.web || veterinario.web
        veterinario.telefono = req.body.telefono || veterinario.telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
}


const actualizarPassword = async (req,res) => {
    // leer los datos
    const { id } = req.veterinario
    const { pwd_actual,pwd_nuevo } = req.body

    // comprobar que existe
    const veterinario = await Veterinario.findById(id)
    if(!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }

    // comprobar el password
    if (await veterinario.compararFuncion(pwd_actual)) {
        veterinario.password = pwd_nuevo
        await veterinario.save()
        return res.json({msg: "Password cambiado exitosamente"})
    } else {
        const error = new Error("El password actual es Incorrecto")
        return res.status(400).json({msg: error.message})
    }
}


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}