import { Router } from "express";

const route = Router();

/** Vehicules Data**/
let vehicules = [
  { id: 1, marque: "Dacia", modele: "Logan", immatriculation: "12345-A-6", disponible: true },
  { id: 2, marque: "Renault", modele: "Clio", immatriculation: "67890-B-6", disponible: false },
  { id: 3, marque: "Peugeot", modele: "208", immatriculation: "24680-D-1", disponible: true }
];

// liste les véhicules ; avec ?disponible=true
route.get("/", (req,res) => {
    const {disponible} = req.query;
    let results = [...vehicules];

    if(disponible !== undefined){
        const estDisponible = disponible === "true"
        results = vehicules.filter((v) => v.disponible === estDisponible);
    }
    
    res.json(results)
});

//Renvoie un véhicule
route.get("/:id", (req, res) => {
    const {id} = req.params;
    const vehiculeId = Number(id);


    if(!vehiculeId){
        return res.status(404).json({Erreur: "Vehicule non disponible"})
    }

    const vehicule = vehicules.find((v) => v.id === vehiculeId)

    res.json(vehicule)
})

//crée un véhicule (marque, modele, immatriculation obligatoires)
route.post("/", (req,res) => {
    const {marque, modele, immatriculation, disponible} = req.body;

    //Validation du corps:
    if(!marque || typeof marque !== "string" || marque.trim() === ""){
        return res.status(400).json({Erreur: "La marque est obligatoire et doit etre de type string"})
    }

    if(!modele || typeof modele !== "string" || modele.trim() === ""){
    return res.status(400).json({Erreur: "La modele est obligatoire et doit etre de type string"})
    }

    if(!immatriculation || typeof immatriculation !== "string" || immatriculation.trim() === ""){
    return res.status(400).json({Erreur: "La immatriculation est obligatoire et doit etre de type string"})
    }

    if(typeof disponible !== "boolean"){
        return res.status(400).json({Erreur: "Le status est obligatoire et doit etre de type boolean"})
    }

    const nouveauVehicule = {
        id: vehicules.length + 1,
        marque,
        modele,
        immatriculation,
        disponible: disponible ?? true
    }

    vehicules.push(nouveauVehicule);

    res.status(201).json({
        message: "Vehicule ajouté avec success",
        vehicule: nouveauVehicule
    })
});


//modifie un ou plusieurs champs:
route.patch("/:id", (req,res) => {
    const {id} = req.params;
    const vehiculeId = Number(id);

    if(!vehiculeId){
        return res.status(404).json({Erreur: "Vehicule non disponible"})
    }

    const {marque, modele, immatriculation, disponible} = req.body;

    //Validation du corps:
    if(typeof marque !== "string" || marque.trim() === ""){
        return res.status(400).json({Erreur: "La marque est obligatoire et doit etre de type string"})
    }

    if(typeof modele !== "string" || modele.trim() === ""){
    return res.status(400).json({Erreur: "La modele est obligatoire et doit etre de type string"})
    }

    if(typeof immatriculation !== "string" || immatriculation.trim() === ""){
    return res.status(400).json({Erreur: "La immatriculation est obligatoire et doit etre de type string"})
    }

    if(typeof disponible !== "boolean"){
        return res.status(400).json({Erreur: "Le status est obligatoire et doit etre de type boolean"})
    }

    const vehicule = vehicules.find((v) => v.id === vehiculeId)

    if(marque !==undefined){vehicule.marque = marque}
    if(modele !==undefined){vehicule.modele = modele}
    if(immatriculation !== undefined){vehicule.immatriculation = immatriculation} 
    if(disponible !== undefined) {vehicule.disponible = disponible} 

    res.status(201).json({message: "Vehicule modifié avec success"}, vehicule);
});


route.delete("/:id",(req,res) => {
    const {id} = req.params;
    const vehiculeId = Number(id);

    if(!vehiculeId){
        return res.status(404).json({Erreur: "Vehicule non disponible"})
    }
    

    vehicules = vehicules.filter((v) => v.id !== vehiculeId);

    res.json(204).end()
})




export default route