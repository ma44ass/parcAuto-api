export default function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Identifiant vehicule invalide" });
  }

  req.vehiculeId = id;
  return next();
}

export function validateVehiculePayload({ partial = false } = {}) {
  return (req, res, next) => {
    const body = req.body;

    //Payload format
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res
        .status(400)
        .json({ error: "Request body must be a JSON object" });
    }

    const { marque, modele, immatriculation, disponible } = body;

    if (
      partial &&
      marque === undefined &&
      modele === undefined &&
      immatriculation === undefined &&
      disponible === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Au moins un champ doit être fourni" });
    }

    //Modele
    if (!partial || marque !== undefined) {
      if (typeof marque !== "string" || marque.trim() === "") {
        return res
          .status(400)
          .json({
            error: "Marque doit etre une chaine, et ne doit pas etre vide",
          });
      }

      req.body.marque = marque.trim();
    }

    //Modele
    if (!partial || modele !== undefined) {
      if (typeof modele !== "string" || modele.trim() === "") {
        return res
          .status(400)
          .json({
            error: "Modele doit etre une chaine, et ne doit pas etre vide",
          });
      }

      req.body.modele = modele.trim();
    }

    //Immatriculation
    if (!partial || immatriculation !== undefined) {
      if (
        typeof immatriculation !== "string" ||
        immatriculation.trim() === ""
      ) {
        return res
          .status(400)
          .json({
            error:
              "Immatriculation doit etre une chaine, et ne doit pas etre vide",
          });
      }

      req.body.immatriculation = immatriculation.trim();
    }

    //Disonible
    if (disponible !== undefined) {
      if (typeof disponible !== "boolean") {
        return res
          .status(400)
          .json({ error: "Disponible doit etre un boolean : true/false" });
      }
    } else if (!partial && req.method === "PUT") {
      return res
        .status(400)
        .json({ error: "Disponible est obligatoire pour PUT" });
    }

    return next();
  };
}

const allowed_sort_fields = new Set([
  "id",
  "marque",
  "modele",
  "disponible",
  "immatriculation",
]);
const allowed_sort_orders = new Set(["asc", "desc"]);

export function validateVehiculeQuery(req, res, next) {
  const { disponible, search, sortBy, order } = req.query;

  const parsedQuery = {
    disponible: undefined,
    search: "",
    sortBy: "id",
    order: "asc",
  };
  
  //?diponible=...
  if (disponible !== undefined) {
    if (disponible !== "true" && disponible !== "false") {
      return res
        .status(400)
        .json({ error: "Query 'disponible' doit etre 'true' or 'false" });
    }
    parsedQuery.disponible = disponible === "true";
  }

  //?search=...
  if (search !== undefined) {
    if (typeof search !== "string") {
      return res
        .status(400)
        .json({ error: "Query 'search' doit etre une chaine" });
    }
    parsedQuery.search = search.trim().toLowerCase();
  }

  //?sortBy=...
  if (sortBy !== undefined) {
    if (typeof sortBy !== "string" || !allowed_sort_fields.has(sortBy)) {
      return res
        .status(400)
        .json({
          error: `Query 'sortBy' must be one of ${[...allowed_sort_fields].join(", ")}`,
        });
    }
    parsedQuery.sortBy = sortBy;
  }

  //?order=...
  if (order !== undefined) {
    if (
      typeof order !== "string" ||
      !allowed_sort_orders.has(order.toLowerCase())
    ) {
      return res
        .status(400)
        .json({ error: "Query 'order' must be 'asc' or 'desc' " });
    }
    parsedQuery.order = order.toLowerCase();
  }

  req.vehiculeQuery = parsedQuery;
  return next();
}
