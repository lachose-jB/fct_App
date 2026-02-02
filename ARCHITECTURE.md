# Architecture Sécurisée - FCT Timesheet

## 📁 Structure du Projet

```
fct-app/
├── server.js              # Serveur Express sécurisé avec toutes les routes API
├── database.js            # Configuration SQLite avec schéma sécurisé
├── package.json           # Dépendances sécurisées et scripts
├── .env                   # Variables d'environnement (NE PAS COMMITTER)
├── .env.example           # Template de configuration
├── .gitignore             # Protection des fichiers sensibles
├── README.md              # Documentation utilisateur
├── ARCHITECTURE.md        # Ce fichier - Documentation technique
│
└── public/                # Interface utilisateur
    ├── index.html         # Page d'accueil avec redirection
    ├── login.html         # Page de connexion dédiée
    ├── signup.html        # Page d'inscription dédiée
    └── dashboard.html     # Application React de gestion du temps
```

## 🏗️ Architecture de Sécurité

### 1. Séparation des Préoccupations (Separation of Concerns)

#### Pages Publiques
- **index.html** : Landing page simple
  - Redirection automatique si authentifié → `/dashboard.html`
  - Liens vers login/signup
  
- **login.html** : Authentification
  - Validation côté client avant envoi
  - Gestion d'erreurs claire
  - Protection contre brute force (rate limiting côté serveur)
  - Redirection automatique si déjà connecté
  
- **signup.html** : Création de compte
  - Validation en temps réel du mot de passe
  - Indicateur de force du mot de passe
  - Vérification de correspondance des mots de passe
  - Exigences de sécurité affichées

#### Pages Protégées
- **dashboard.html** : Application principale
  - Vérification de session au chargement
  - Redirection vers `/login.html` si non authentifié
  - Déconnexion sécurisée

### 2. Backend Sécurisé (server.js)

#### Middleware de Sécurité
```javascript
✅ Helmet.js              // Protection des en-têtes HTTP
✅ express-rate-limit     // Limitation de requêtes
✅ express-validator      // Validation des entrées
✅ express-session        // Gestion sécurisée des sessions
✅ dotenv                 // Variables d'environnement
```

#### Rate Limiting Stratégique
```javascript
// Authentification : Protection contre force brute
authLimiter: 5 tentatives / 15 minutes

// API générale : Protection DoS
apiLimiter: 100 requêtes / 15 minutes
```

#### Routes d'Authentification

**POST /api/auth/register**
- Validation stricte (express-validator)
  - Username: 3-30 caractères alphanumériques
  - Password: Min 8 car, avec majuscule + minuscule + chiffre
- Hachage bcrypt (12 rounds)
- Création de session automatique
- Rate limited

**POST /api/auth/login**
- Validation des credentials
- Comparaison sécurisée bcrypt
- Messages d'erreur génériques (éviter l'énumération)
- Rate limited

**POST /api/auth/logout**
- Destruction complète de la session
- Pas de traces résiduelles

**GET /api/auth/me**
- Vérification de session
- Retourne user ou 401

#### Routes Timesheet (Protégées)

**GET /api/timesheet/:year/:month**
- Middleware `isAuthenticated`
- Validation des paramètres (année, mois)
- Filtrage par user_id (session)
- Rate limited

**POST /api/timesheet**
- Middleware `isAuthenticated`
- Validation des données (express-validator)
- Upsert SQL sécurisé
- Rate limited

### 3. Base de Données (database.js)

#### Schéma Sécurisé

**Table users**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,      -- Index unique
    password_hash TEXT NOT NULL,         -- Jamais en clair
    role TEXT DEFAULT 'user',            -- Préparé pour RBAC
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Table timesheets**
```sql
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    data TEXT,                           -- JSON sérialisé
    status TEXT DEFAULT 'draft',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    UNIQUE(user_id, month, year)         -- Un seul timesheet/mois/user
);
```

#### Sécurité des Requêtes
- ✅ Prepared statements partout (protection SQL injection)
- ✅ Foreign keys activées
- ✅ Contraintes d'intégrité
- ✅ Filtrage par user_id systématique

### 4. Configuration Sécurisée

#### Variables d'Environnement (.env)
```env
SESSION_SECRET=valeur-aleatoire-cryptographiquement-sure
NODE_ENV=production
PORT=3000
DB_PATH=./fct_timesheet.db
```

#### Session Sécurisée
```javascript
{
    secret: process.env.SESSION_SECRET,     // Depuis .env
    httpOnly: true,                          // Anti-XSS
    secure: NODE_ENV === 'production',       // HTTPS uniquement en prod
    sameSite: 'strict',                      // Anti-CSRF
    maxAge: 24 * 60 * 60 * 1000             // 24h
}
```

### 5. Validation des Entrées

#### Côté Client (JavaScript)
- Validation immédiate des formulaires
- Feedback utilisateur en temps réel
- Empêche l'envoi de données invalides
- **NE REMPLACE PAS** la validation serveur

#### Côté Serveur (express-validator)
```javascript
registerValidation: [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9_-]+$/),
    body('password')
        .isLength({ min: 8, max: 128 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
]
```

### 6. Gestion des Erreurs

#### Logs Serveur
- `console.error()` pour traçabilité
- Messages techniques en console
- Messages génériques pour l'utilisateur

#### Messages d'Erreur Utilisateur
- Génériques pour l'authentification (éviter l'énumération)
- Spécifiques pour la validation (aide l'utilisateur)
- Codes HTTP appropriés

## 🚀 Déploiement Sécurisé

### Checklist Pré-Déploiement

#### 1. Variables d'Environnement
```bash
# Générer un secret fort
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Configurer .env
SESSION_SECRET=<valeur-generee>
NODE_ENV=production
PORT=3000
```

#### 2. Configuration HTTPS
```javascript
// Activer secure cookies
cookie: {
    secure: true,    // Forcer HTTPS
    httpOnly: true,
    sameSite: 'strict'
}
```

#### 3. Reverse Proxy (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }
}
```

#### 4. Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### 5. Process Manager (PM2)
```bash
npm install -g pm2

# Démarrer
pm2 start server.js --name fct-timesheet

# Auto-restart on reboot
pm2 startup
pm2 save
```

#### 6. Backups Base de Données
```bash
# Script de backup quotidien
#!/bin/bash
DB_PATH="./fct_timesheet.db"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
sqlite3 $DB_PATH ".backup '$BACKUP_DIR/fct_timesheet_$DATE.db'"

# Garder seulement les 30 derniers
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
```

### 7. Monitoring

#### Logs Application
```bash
# PM2 logs
pm2 logs fct-timesheet

# Ou journald
journalctl -u fct-timesheet -f
```

#### Monitoring Sécurité
- Rate limiting stats
- Tentatives de connexion échouées
- Erreurs 401/403

## 🔐 Principes de Sécurité Appliqués

### Defense in Depth (Défense en Profondeur)
1. **Validation client** → Expérience utilisateur
2. **Validation serveur** → Sécurité réelle
3. **Rate limiting** → Protection DoS/brute force
4. **Prepared statements** → Protection SQL injection
5. **Helmet.js** → Protection headers HTTP
6. **Sessions sécurisées** → Protection CSRF/XSS

### Least Privilege (Moindre Privilège)
- Utilisateurs isolés par user_id
- Pas d'accès aux données des autres
- Rôles préparés pour évolution

### Fail Securely (Échec Sécurisé)
- Erreurs → Retour messages génériques
- Session expirée → Redirection login
- DB erreur → Message générique + log serveur

### Secure by Default (Sécurisé par Défaut)
- Sessions httpOnly + sameSite
- Rate limiting actif dès le départ
- Validation stricte obligatoire

## 📊 Tests de Sécurité Recommandés

### 1. Authentification
```bash
# Tester rate limiting
for i in {1..10}; do
    curl -X POST http://localhost:3000/api/auth/login \
         -H "Content-Type: application/json" \
         -d '{"username":"test","password":"wrong"}'
done
```

### 2. SQL Injection
```bash
# Doit échouer proprement
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin'\'' OR 1=1--","password":"test"}'
```

### 3. XSS
```javascript
// Dans signup, essayer:
username: "<script>alert('xss')</script>"
// Doit être rejeté par validation
```

### 4. Session Hijacking
```bash
# Cookie doit être httpOnly
# Vérifier dans DevTools → Application → Cookies
```

## 🔄 Maintenance

### Mises à Jour Dépendances
```bash
# Audit régulier
npm audit

# Mise à jour sécurisée
npm update

# Vérifier breaking changes
npm outdated
```

### Rotation SESSION_SECRET
```bash
# 1. Générer nouveau secret
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 2. Mettre à jour .env
# 3. Redémarrer application
pm2 restart fct-timesheet

# Note: Déconnectera tous les utilisateurs
```

## 📝 Checklist de Sécurité Quotidienne

- [ ] Vérifier les logs d'erreurs
- [ ] Surveiller les tentatives de connexion échouées
- [ ] Vérifier les alertes de npm audit
- [ ] Backup base de données
- [ ] Vérifier l'espace disque

## 🎓 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [Helmet.js Documentation](https://helmetjs.github.io/)

---

**Dernière mise à jour**: 2 février 2026  
**Version**: 1.0.0  
**Auteur**: FCT Dev Team
