
# JournalX-Back

## Introduction

**JournalX-Back** est une API conçue pour aider les traders à gérer leur historique de trading et à suivre leur portefeuille.  
Elle offre une solution simple et efficace pour créer un journal de trading personnalisé, adapté à tous les marchés financiers.

## Table des Matières

- [Introduction](#introduction)
- [Caractéristiques](#caractéristiques)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Endpoints](#endpoints)
- [Dépendances](#dépendances)
- [Exemples](#exemples)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## Caractéristiques

- Création et gestion d'utilisateurs
- Authentification sécurisée par JWT token
- Ajout, modification et suppression de trades
- Gestion des propfirms
- Ajout et suppression de devises ou paires à trader
- Gestion des erreurs au format JSON

## Installation

### Prérequis

- **Node.js**
- **Docker**

### Étapes

1. Clonez ce dépôt :  
   ```bash
   git clone https://github.com/utilisateur/journalx-back.git
   cd journalx-back
   ```

2. Installez les dépendances :  
   ```bash
   npm install
   ```

3. Configurez les variables d’environnement :  
   Utilisez le fichier `.env` fourni pour configurer votre environnement. Vérifiez que les valeurs des clés suivantes sont correctes :  
   ```
   DATABASE_URL=<URL_de_la_base_de_données>
   JWT_SECRET=<clé_secrète>
   PORT=3000
   ```

4. Démarrez le serveur :  
   ```bash
   npm start
   ```

5. Testez l’API en accédant à `http://localhost:3000`.

## Utilisation

- **URL de base** : `http://localhost:3000/api`
- **Format des données** : JSON
- **Authentification** : Utilisez un JWT token dans le header pour les endpoints sécurisés.

### Exemple de requête avec Postman

**Endpoint :** `POST http://localhost:3000/api/users/register`  
**Données à fournir :**  

```json
{
  "nametag": "jane_doe",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phoneNumber": "0987654321",
  "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "bio": "Hello, I am Jane Doe."
}
```

**Réponse :**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

## Endpoints

| Méthode | Endpoint                     | Description                             |
|---------|------------------------------|-----------------------------------------|
| POST    | `/api/users/register`        | Inscrire un utilisateur                 |
| POST    | `/api/users/login`           | Se connecter                            |
| POST    | `/api/trades`                | Ajouter un trade                        |
| PUT     | `/api/trades/:id`            | Modifier un trade                       |
| DELETE  | `/api/trades/:id`            | Supprimer un trade                      |
| POST    | `/api/propfirms`             | Ajouter une propfirm                    |
| DELETE  | `/api/propfirms/:id`         | Supprimer une propfirm                  |

### Gestion des erreurs

Toutes les erreurs sont retournées au format JSON avec un code HTTP approprié. Exemple pour une erreur 500 :  

```json
{
  "status": "error",
  "message": "Internal Server Error"
}
```

## Dépendances

- **Node.js** - Environnement d'exécution JavaScript.  
- **MongoDB** - Base de données NoSQL.  
- **JWT** - Gestion des tokens d'authentification.

## Documentation

Vous pouvez consulter la documentation complète de l’API ici : [Postman Documentation](https://documenter.getpostman.com/view/16888366/2sAYBYepdu).

## Contributeurs

- **Jonathan Favorel** - Développeur Full Stack

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.

