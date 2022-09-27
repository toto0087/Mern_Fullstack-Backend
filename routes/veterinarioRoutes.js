import express from "express"
const router = express.Router();
import {perfil, 
        registrar, 
        confirmar, 
        autenticar,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        actualizarPerfil,
        actualizarPassword
} 
    from "../controllers/veterinarioControllers.js";
import checkAuth from "../middleware/authMiddleware.js"

// area publica
router.post("/",registrar)
router.get("/confirmar/:token",confirmar)
router.post("/login",autenticar)
router.post("/olvide-password",olvidePassword)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

// area privada
router.get("/perfil",checkAuth ,perfil) //comrpobamos token   
router.put("/perfil/:id",checkAuth ,actualizarPerfil) 
router.put("/actualizar-password",checkAuth ,actualizarPassword) 

export default router;