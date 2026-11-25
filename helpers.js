
const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

const COMPARATORS = {
  id: (a, b) => a.id - b.id,
  marque: (a, b) => collator.compare(a.marque, b.marque),
  modele: (a, b) => collator.compare(a.modele, b.modele),
  immatriculation: (a, b) => collator.compare(a.immatriculation, b.immatriculation),
  disponible: (a, b) => Number(a.disponible) - Number(b.disponible)
};

export function queryVehicules(items, { disponible, search, sortBy = "id", order = "asc" }) {
  let resultats = items.slice();

  if (disponible !== undefined) {
    resultats = resultats.filter((v) => v.disponible === disponible);
  }

  if (search) {
    resultats = resultats.filter(
      (v) =>
        v.modele.toLowerCase().includes(search) ||
        v.marque.toLowerCase().includes(search) ||
        v.immatriculation.toLowerCase().includes(search)
    );
  }

  const compareFn = COMPARATORS[sortBy] ?? COMPARATORS.id;
  const direction = order === "desc" ? -1 : 1;

  return resultats.sort((a, b) => compareFn(a, b) * direction);
}


export function vehiculeExiste(vehicules, immatriculation, excludeId = null){
    const vehicule = immatriculation.trim().toLowerCase();

    return vehicules.some(
        (v) =>
            v.id !== excludeId &&
            v.immatriculation.trim().toLowerCase() === vehicule
    );
}

export function hasConflictingImmatriculation(items, immatriculation, excludeId = null) {
  return immatriculation !== undefined && vehiculeExiste(items, immatriculation, excludeId);
}

