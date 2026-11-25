# ParkAuto API

API REST développée avec Node.js et Express pour gérer une collection de véhicules. Les données sont conservées en mémoire pendant l'exécution du serveur.

## Fonctionnalités

- Liste des véhicules avec recherche, filtrage et tri
- Consultation d'un véhicule par identifiant
- Création, modification complète, modification partielle et suppression
- Validation des paramètres, du corps des requêtes et des valeurs de tri
- Détection des immatriculations déjà utilisées
- Journalisation de chaque requête HTTP dans la console

## Technologies

- Node.js
- Express 5
- dotenv

## Prérequis

- Node.js 18 ou supérieur
- npm

## Installation

```bash
npm install
```

Créez ensuite un fichier `.env` à la racine du projet :

```env
port=port_a_utiliser
```

La variable attendue par l'application est `port` en minuscules.

## Démarrage

Mode normal :

```bash
node server.js
```

Mode développement avec redémarrage automatique :

```bash
npm run dev
```

Par défaut, configurez `port=3000` puis ouvrez `http://localhost:3000`.

## Structure du projet

```text
server.js                 Configuration du serveur Express
routes/vehicules.js       Routes CRUD des véhicules
middlewares/validate.js   Validation des requêtes
middlewares/journalisation.js
                          Journalisation des requêtes
data/vehicules.js         Jeu de données initial et gestion des identifiants
helpers.js                Recherche, tri et contrôles métier
```

## Modèle de données

```json
{
  "id": 1,
  "marque": "Dacia",
  "modele": "Logan",
  "immatriculation": "12345-A-6",
  "disponible": true
}
```

| Champ | Type | Description |
|---|---|---|
| `id` | nombre entier | Identifiant unique généré automatiquement |
| `marque` | chaîne | Marque du véhicule |
| `modele` | chaîne | Modèle du véhicule |
| `immatriculation` | chaîne | Immatriculation unique |
| `disponible` | booléen | Indique si le véhicule est disponible |

## Endpoints

Base URL : `/vehicules`

### Récupérer tous les véhicules

```http
GET /vehicules
```

Paramètres optionnels :

| Paramètre | Valeurs | Description |
|---|---|---|
| `disponible` | `true`, `false` | Filtre les véhicules disponibles ou indisponibles |
| `search` | chaîne | Recherche dans la marque, le modèle ou l'immatriculation |
| `sortBy` | `id`, `marque`, `modele`, `immatriculation`, `disponible` | Champ utilisé pour le tri |
| `order` | `asc`, `desc` | Sens du tri |

Exemples :

```bash
curl "http://localhost:3000/vehicules"
curl "http://localhost:3000/vehicules?disponible=true"
curl "http://localhost:3000/vehicules?search=clio&sortBy=marque&order=asc"
```

Réponse `200 OK` :

```json
[
  {
    "id": 1,
    "marque": "Dacia",
    "modele": "Logan",
    "immatriculation": "12345-A-6",
    "disponible": true
  }
]
```

### Récupérer un véhicule

```http
GET /vehicules/:id
```

```bash
curl "http://localhost:3000/vehicules/1"
```

Réponse `200 OK` :

```json
{
  "vehicule": {
    "id": 1,
    "marque": "Dacia",
    "modele": "Logan",
    "immatriculation": "12345-A-6",
    "disponible": true
  }
}
```

### Ajouter un véhicule

```http
POST /vehicules
Content-Type: application/json
```

```bash
curl -X POST "http://localhost:3000/vehicules" \
  -H "Content-Type: application/json" \
  -d '{
    "marque": "Toyota",
    "modele": "Corolla",
    "immatriculation": "11223-C-5",
    "disponible": true
  }'
```

Les champs `marque`, `modele` et `immatriculation` sont obligatoires pour `POST`. `disponible` est facultatif et vaut `true` par défaut.

Réponse `201 Created` :

```json
{
  "message": "Vehicule ajouté avec success",
  "vehicule": {
    "id": 4,
    "marque": "Toyota",
    "modele": "Corolla",
    "immatriculation": "11223-C-5",
    "disponible": true
  }
}
```

### Modifier complètement un véhicule

```http
PUT /vehicules/:id
Content-Type: application/json
```

Tous les champs sont obligatoires pour `PUT`, y compris `disponible` :

```bash
curl -X PUT "http://localhost:3000/vehicules/1" \
  -H "Content-Type: application/json" \
  -d '{
    "marque": "Dacia",
    "modele": "Sandero",
    "immatriculation": "12345-A-6",
    "disponible": false
  }'
```

Réponse `200 OK` :

```json
{
  "message": "Vehicule modifie avec success",
  "vehicule": {
    "id": 1,
    "marque": "Dacia",
    "modele": "Sandero",
    "immatriculation": "12345-A-6",
    "disponible": false
  }
}
```

### Modifier partiellement un véhicule

```http
PATCH /vehicules/:id
Content-Type: application/json
```

Au moins un champ doit être fourni :

```bash
curl -X PATCH "http://localhost:3000/vehicules/1" \
  -H "Content-Type: application/json" \
  -d '{ "disponible": false }'
```

Réponse `200 OK` :

```json
{
  "message": "Vehicule modifie avec success",
  "vehicule": {
    "id": 1,
    "marque": "Dacia",
    "modele": "Logan",
    "immatriculation": "12345-A-6",
    "disponible": false
  }
}
```

### Supprimer un véhicule

```http
DELETE /vehicules/:id
```

```bash
curl -i -X DELETE "http://localhost:3000/vehicules/1"
```

Une suppression réussie renvoie `204 No Content`.

## Réponses d'erreur

| Code | Situation |
|---|---|
| `400 Bad Request` | Identifiant, corps JSON, champ ou paramètre de requête invalide |
| `404 Not Found` | Véhicule ou route inexistante |
| `409 Conflict` | Immatriculation déjà utilisée |

Exemple :

```json
{
  "error": "Vehicule inexistant"
}
```

Exemple de conflit `409 Conflict` lors de la création ou de la modification avec une immatriculation déjà utilisée :

```json
{
  "error": "Un vehicule avec cette immatriculation existe deja"
}
```

Pour une route non reconnue :

```json
{
  "error": "Route inconnue"
}
```

## Persistance

L'application utilise un tableau JavaScript comme stockage. Toute modification est réinitialisée au prochain démarrage du serveur. Les données initiales sont définies dans `data/vehicules.js`.