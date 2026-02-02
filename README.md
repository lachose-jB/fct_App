# Application de Suivi du Temps FCT

Application web sécurisée pour le suivi du temps de travail avec authentification et gestion des feuilles de temps mensuelles.

## 🔒 Fonctionnalités de Sécurité

- **Authentification robuste** : Système d'inscription/connexion avec validation stricte
- **Protection des mots de passe** : Hachage bcrypt avec 12 rounds
- **Protection des sessions** : Configuration sécurisée avec httpOnly et sameSite
- **Variables d'environnement** : Secrets stockés dans .env
- **Validation des entrées** : express-validator sur toutes les routes
- **Rate limiting** : Protection contre les attaques par force brute
- **Helmet.js** : Protection des en-têtes HTTP
- **Logging des erreurs** : Traçabilité des problèmes

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

## 🚀 Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd fct-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` basé sur `.env.example` :
```bash
cp .env.example .env
```

4. **IMPORTANT** : Modifiez le fichier `.env` et changez le `SESSION_SECRET` :
```bash
# Générez un secret sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiez le résultat dans .env
```

## 🔧 Configuration

Éditez le fichier `.env` avec vos paramètres :

```env
PORT=3000
SESSION_SECRET=votre-secret-genere-aleatoirement
NODE_ENV=development
DB_PATH=./fct_timesheet.db
```

## 📦 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🎯 Utilisation

1. **Inscription** : Créez un compte avec :
   - Nom d'utilisateur (3-30 caractères, lettres, chiffres, - et _)
   - Mot de passe (min 8 caractères, avec majuscule, minuscule et chiffre)

2. **Connexion** : Connectez-vous avec vos identifiants

3. **Gestion du temps** :
   - Sélectionnez un mois/année
   - Remplissez vos jours travaillés
   - Sauvegardez régulièrement

## 🔐 Exigences de Sécurité

### Mots de passe
- Minimum 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre

### Noms d'utilisateur
- Entre 3 et 30 caractères
- Lettres, chiffres, tirets et underscores uniquement

### Rate Limiting
- Authentification : 5 tentatives / 15 minutes
- API : 100 requêtes / 15 minutes

## 📁 Structure du Projet

```
fct-app/
├── server.js           # Serveur Express avec routes sécurisées
├── database.js         # Configuration SQLite
├── package.json        # Dépendances et scripts
├── .env.example        # Template de configuration
├── .gitignore          # Fichiers à ignorer
├── README.md           # Documentation
├── public/
│   └── index.html      # Interface utilisateur
└── fct_timesheet.db    # Base de données (créée automatiquement)
```

## 🛠️ Technologies Utilisées

- **Backend** : Node.js, Express
- **Base de données** : SQLite3
- **Sécurité** : bcrypt, helmet, express-rate-limit, express-validator
- **Frontend** : React (via CDN), Tailwind CSS

## ⚠️ Notes de Sécurité

1. **NE JAMAIS** committer le fichier `.env`
2. Changez le `SESSION_SECRET` en production
3. Utilisez HTTPS en production (`NODE_ENV=production`)
4. Gardez les dépendances à jour : `npm audit`
5. Faites des backups réguliers de la base de données

## 📝 License

ISC
