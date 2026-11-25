import { Router } from "express";

import validateId, {
  validateVehiculePayload,
  validateVehiculeQuery,
} from "../middlewares/validate.js";

import { getNextVehiculeId, vehicules } from "../data/vehicules.js";
import {
  vehiculeExiste,
  queryVehicules,
  hasConflictingImmatriculation,
} from "../helpers.js";

const route = Router();

//Renvoyer la liste des vehicules avec possibilté de filtrage et search:
route.get("/", validateVehiculeQuery, (req, res) => {
  const resultats = queryVehicules(vehicules, req.vehiculeQuery);
  return res.status(200).json(resultats);
});

//Renvoyer un vehicule specifique
route.get("/:id", validateId, (req, res) => {
  const vehicule = vehicules.find((v) => v.id === req.vehiculeId);
  if (!vehicule) return res.status(404).json({ error: "Vehicule inexistant" });

  return res.json({ vehicule });
});

//Ajouter une nouvelle entree (nouveau vehicule)
route.post("/", validateVehiculePayload(), (req, res) => {
  const { marque, modele, immatriculation, disponible } = req.body;

  if (vehiculeExiste(vehicules, immatriculation)) {
    return res.status(409).json({
      error: "Un vehicule avec cette immatriculation existe deja",
    });
  }

  const nouveauVehicule = {
    id: getNextVehiculeId(),
    marque,
    modele,
    immatriculation,
    disponible: disponible ?? true,
  };

  vehicules.push(nouveauVehicule);
  return res.status(201).json({
    message: "Vehicule ajouté avec success",
    vehicule: nouveauVehicule,
  });
});

//Modifier une entrée (partiellement)
route.patch(
  "/:id",
  validateId,
  validateVehiculePayload({ partial: true }),
  (req, res) => {
    const vehicule = vehicules.find((v) => v.id === req.vehiculeId);
    if (!vehicule)
      return res.status(404).json({ error: "Vehicule inexistant" });

    const { marque, modele, immatriculation, disponible } = req.body;

    if (
      hasConflictingImmatriculation(vehicules, immatriculation, req.vehiculeId)
    ) {
      return res.status(409).json({
        error: "Un vehicule avec cette immatriculation existe deja",
      });
    }

    if (marque !== undefined) {
      vehicule.marque = marque;
    }
    if (modele !== undefined) {
      vehicule.modele = modele;
    }
    if (immatriculation !== undefined) {
      vehicule.immatriculation = immatriculation;
    }
    if (disponible !== undefined) {
      vehicule.disponible = disponible;
    }

    return res
      .status(200)
      .json({ message: "Vehicule modifie avec success", vehicule: vehicule });
  },
);

//Modifier une entree compeletement
route.put("/:id", validateId, validateVehiculePayload(), (req, res) => {
  const vehicule = vehicules.find((v) => v.id === req.vehiculeId);
  if (!vehicule) return res.status(404).json({ error: "Vehicule inexistant" });

  const { marque, modele, immatriculation, disponible } = req.body;

  if (
    hasConflictingImmatriculation(vehicules, immatriculation, req.vehiculeId)
  ) {
    return res.status(409).json({
      error: "Un vehicule avec cette immatriculation existe deja",
    });
  }

  vehicule.marque = marque;
  vehicule.modele = modele;
  vehicule.immatriculation = immatriculation;
  vehicule.disponible = disponible;

  return res
    .status(200)
    .json({ message: "Vehicule modifie avec success", vehicule: vehicule });
});

//Supprimer un vehicule
route.delete("/:id", validateId, (req, res) => {
  const index = vehicules.findIndex((v) => v.id === req.vehiculeId);
  if (index === -1)
    return res.status(404).json({ error: "Vehicule inexistant" });

  vehicules.splice(index, 1);
  return res.status(204).end();
});

export default route;
