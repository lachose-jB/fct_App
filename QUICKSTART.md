# 🚀 FCT Timesheet - Quick Start

## ⚡ Installation en 3 Minutes

```bash
# 1. Installer
npm install

# 2. Configurer
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → Copier le résultat dans .env comme SESSION_SECRET

# 3. Lancer
npm start

# 4. Ouvrir
http://localhost:3000
```

## 📱 Première Utilisation

### 1. Créer un compte
- Aller sur http://localhost:3000
- Cliquer sur "Créer un compte"
- Remplir le formulaire (username + mot de passe fort)

### 2. Se connecter
- Retourner à la page d'accueil
- Cliquer sur "Se connecter"
- Entrer vos identifiants

### 3. Utiliser l'app
- Sélectionner un mois (tabs en haut)
- Cliquer sur les jours pour marquer : Présence → Demi-journée → Absence
- Ajouter des commentaires dans la colonne "Commentaire"
- Cliquer sur "Sauvegarder" régulièrement

## 🎨 Pages de l'Application

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Accueil | `/` | Page d'atterrissage avec liens |
| 🔐 Connexion | `/login.html` | Page de connexion moderne |
| ✍️ Inscription | `/signup.html` | Création de compte sécurisée |
| 📊 Dashboard | `/dashboard.html` | Application de timesheet |

## 🔒 Sécurité

✅ **Authentification robuste**
- Mots de passe hachés (bcrypt 12 rounds)
- Validation stricte (min 8 car, maj+min+chiffre)
- Rate limiting (5 tentatives/15min)

✅ **Protection données**
- Sessions sécurisées (httpOnly, sameSite)
- Prepared statements SQL
- Variables d'environnement

✅ **UI Moderne**
- Design Tailwind CSS
- Responsive mobile
- Animations fluides

## 📚 Documentation

| Fichier | Pour qui | Contenu |
|---------|----------|---------|
| [README.md](README.md) | Utilisateurs | Guide d'utilisation |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Développeurs | Doc technique |
| [DEPLOYMENT.md](DEPLOYMENT.md) | DevOps | Guide déploiement |
| [SECURITY.md](SECURITY.md) | Security | Rapport sécurité |

## 🐛 Dépannage Rapide

### Le serveur ne démarre pas
```bash
# Vérifier les dépendances
npm install

# Vérifier .env existe
ls -la .env

# Voir les logs
npm start
```

### Erreur de connexion
```bash
# Vérifier que le serveur tourne
curl http://localhost:3000

# Vérifier la base de données
ls -la fct_timesheet.db
```

### Mot de passe refusé lors de l'inscription
Votre mot de passe doit contenir :
- Au moins 8 caractères
- Au moins une majuscule (A-Z)
- Au moins une minuscule (a-z)
- Au moins un chiffre (0-9)

Exemples valides : `Password123`, `SecurePass2026`

## 🎯 Fonctionnalités Principales

### ✅ Gestion du Temps
- Calendrier mensuel 2026
- Types : Présence complète, Demi-journée, Absence
- Détection automatique week-ends et jours fériés
- Remplissage automatique du mois
- Statistiques en temps réel

### 🔐 Sécurité
- Authentification moderne
- Protection contre brute force
- Sessions expirantes (24h)
- Validation stricte entrées

### 🎨 Interface
- Design professionnel
- Mobile-friendly
- Indicateur de force du mot de passe
- Loading states

## 💡 Astuces

### Remplir rapidement un mois
1. Cliquer sur "Remplir auto (100%)"
2. Confirmer
3. Tous les jours ouvrés sont marqués comme "Présence"

### Changer le type d'une journée
1. Cliquer sur la cellule du jour
2. Cycle : Vide → Présence → Demi → Absence → Vide

### Ajouter un commentaire
1. Taper dans le champ "Commentaire / Mission"
2. La sauvegarde est automatique

## 🚀 Déploiement Production

**Pour déployer en production :**

1. Lire [DEPLOYMENT.md](DEPLOYMENT.md)
2. Configurer serveur (Ubuntu/Nginx)
3. Obtenir certificat SSL (Let's Encrypt)
4. Utiliser PM2 pour process management
5. Configurer backups

**Checklist minimale :**
- [ ] SESSION_SECRET unique et fort
- [ ] NODE_ENV=production
- [ ] HTTPS activé
- [ ] Firewall configuré
- [ ] Backups automatiques

## 📞 Support

**Problème ?**
1. Consulter la documentation appropriée
2. Vérifier les logs : `npm start` ou `pm2 logs`
3. Checker les erreurs navigateur (F12 → Console)

**Logs serveur :**
```bash
# Development
npm start

# Production (PM2)
pm2 logs fct-timesheet
```

## 🎓 Technologies

**Backend:** Node.js, Express, SQLite, bcrypt, helmet  
**Frontend:** React, Tailwind CSS, Lucide Icons  
**Sécurité:** express-validator, rate-limit, sessions  

## ⭐ Prochaines Étapes

Après avoir testé localement :

1. **Personnaliser** : Changer les couleurs, le logo FCT
2. **Étendre** : Ajouter export PDF, notifications
3. **Déployer** : Suivre [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Maintenir** : npm audit régulier, backups

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2 février 2026  
**Status:** ✅ Production Ready

**Besoin d'aide détaillée ?** → Consultez [README.md](README.md)
