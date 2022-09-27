import jwt from "jsonwebtoken"
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req,res,next) => {
    let token;
    if(req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
  
    try {
       token = req.headers.authorization.split(" ")[1];

       const decoded =  jwt.verify( token , process.env.JWT_SECRET) // validamos el token 
       
       req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado") //que me traiga la info del token menos el password

        return next()
    } catch (error) {
        const e = new Error("token no valido")
        return res.status(403).json({msg: e.message})
    } 
} 
    

    if(!token) {
        const error = new Error("token no valido o inexistente")
        res.status(403).json({msg: error.message})

    }
    next()
}

export default checkAuth;