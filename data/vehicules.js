/** Vehicules Data**/
 export const vehicules = [
  { id: 1, marque: "Dacia", modele: "Logan", immatriculation: "12345-A-6", disponible: true },
  { id: 2, marque: "Renault", modele: "Clio", immatriculation: "67890-B-6", disponible: false },
  { id: 3, marque: "Peugeot", modele: "208", immatriculation: "24680-D-1", disponible: true }
];

export let vehiculesCopy = structuredClone(vehicules)


export function getNextVehiculeId(){
  if(vehiculesCopy.length === 0) return 1;
  const maxId = vehiculesCopy.reduce((max, vehicule) => (vehicule.id > max ?vehicule.id : max), 0);
  return maxId + 1;
}