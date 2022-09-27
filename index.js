import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"


const app = express();
dotenv.config();
app.use(express.json())

conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL , process.env.FRONTEND_URL_v2]

const corsOptions = { 
    origin: function(origin,callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) { // si la url de la que se esta realizando la peticion esta en la lista de dominios
            // el origen esta permitido
            callback(null,true)
        } else {
            callback(new Error("No permitido por CORS"))
        }
    }  
}

app.use(cors(corsOptions))

app.use("/api/veterinarios", veterinarioRoutes) //cuando mandemos una peticion tednremos este routing y se iran conectando con el archivo de routes
app.use("/api/pacientes", pacienteRoutes) //creamos routing y lo registramos 


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})