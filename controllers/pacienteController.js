import Paciente from "../models/Pacientes.js"

const agregarPaciente = async (req,res) => {
    const paciente = new Paciente(req.body) //Creamos nueva instancia con los datos y forma definida del modelo y le pasamos la info de postman 
    paciente.veterinario = req.veterinario._id; // tomamos el id del veterinario que se almacena en req.veterinario luego de ser autentificado por checkauth
    try {
        const pacienteAlmacenado = await paciente.save()
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerPacientes = async (req,res) => {
    const pacientes = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinario); //trae a los pacientes guardados de ciertos veterinarios autentifiados 
    res.json(pacientes);
}

const obtenerPaciente = async (req,res) => { 
    const { id } = req.params;
    const paciente = await Paciente.findById(id.trim());

    // los num son iguales pero al ser objectID se evaluan distinto, por eso se convierten a string

    if(paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.json({msg: "Accion no valida"})        
    }

    if(paciente) {
        res.json(paciente)
    } else { 
        return res.status(404).json({msg: "paciente no encontrado"})
    }
}

const actualizarPaciente = async (req,res) => { 
    const { id } = req.params;
    const paciente = await Paciente.findById(id.trim());

    if(!paciente) {
        return res.status(404).json({msg: "paciente no encontrado"})
    }


    // los num son iguales pero al ser objectID se evaluan distinto, por eso se convierten a string
    if(paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.json({msg: "Accion no valida"})        
    }

    // Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.fecha = req.body.fecha || paciente.fecha
    paciente.sintomas = req.body.sintomas || paciente.sintomas

    try {
        const pacienteActualizado = await paciente.save()
        return res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }

}

const eliminarPaciente = async (req,res) => { 
    const { id } = req.params;
    const paciente = await Paciente.findById(id.trim());

    if(!paciente) {
        return res.status(404).json({msg: "paciente no encontrado"})
    }


    // los num son iguales pero al ser objectID se evaluan distinto, por eso se convierten a string
    if(paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
        return res.json({msg: "Accion no valida"})        
    }

    try {
        await paciente.deleteOne()
        res.json({msg: "paciente eliminado"})
    } catch (error) {
        console.log(error)
    }
}


export {agregarPaciente,
        obtenerPacientes,
        obtenerPaciente,
        actualizarPaciente,
        eliminarPaciente,
};