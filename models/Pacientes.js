import mongoose from "mongoose"

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario", // le colocamos el ref del nombre que definimos anteriormente  del modelo
    },
}, { 
    timestamps: true, //columnas de editado y creado
})

const Paciente = mongoose.model("Paciente",pacientesSchema) // guardamos referencia del modelo pero tambien la forma de los datos

export default Paciente;