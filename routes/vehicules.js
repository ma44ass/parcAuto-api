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
route.patch("/:id", (req, res) => {
  const vehiculeId = Number(req.params.id);

  if (!Number.isInteger(vehiculeId) || vehiculeId <= 0) {
    return res.status(400).json({ error: "Identifiant de véhicule invalide" });
  }

  const vehicule = vehicules.find((v) => v.id === vehiculeId);
  if (!vehicule) {
    return res.status(404).json({ error: "Véhicule non trouvé" });
  }

  const { marque, modele, immatriculation, disponible } = req.body;

  if (
    marque === undefined &&
    modele === undefined &&
    immatriculation === undefined &&
    disponible === undefined
  ) {
    return res.status(400).json({ error: "Au moins un champ doit être fourni" });
  }

  if (marque !== undefined) {
    if (typeof marque !== "string" || marque.trim() === "") {
      return res.status(400).json({ error: "La marque doit être une chaîne non vide" });
    }
    vehicule.marque = marque.trim();
  }

  if (modele !== undefined) {
    if (typeof modele !== "string" || modele.trim() === "") {
      return res.status(400).json({ error: "Le modèle doit être une chaîne non vide" });
    }
    vehicule.modele = modele.trim();
  }

  if (immatriculation !== undefined) {
    if (typeof immatriculation !== "string" || immatriculation.trim() === "") {
      return res.status(400).json({ error: "L'immatriculation doit être une chaîne non vide" });
    }
    vehicule.immatriculation = immatriculation.trim();
  }

  if (disponible !== undefined) {
    if (typeof disponible !== "boolean") {
      return res.status(400).json({ error: "La disponibilité doit être un booléen" });
    }
    vehicule.disponible = disponible;
  }

  return res.status(200).json({
    message: "Véhicule modifié avec succès",
    vehicule
  });
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