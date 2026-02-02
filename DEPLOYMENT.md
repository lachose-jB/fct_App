# Guide de Déploiement - FCT Timesheet

## 🎯 Objectif

Déployer l'application FCT Timesheet de manière sécurisée sur un serveur de production.

## 📋 Prérequis

### Serveur
- OS: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- RAM: Min 1GB (recommandé 2GB)
- Espace disque: Min 5GB
- Accès SSH root ou sudo

### Logiciels Requis
- Node.js 18.x ou supérieur
- npm 9.x ou supérieur
- Nginx (reverse proxy)
- Certbot (SSL Let's Encrypt)
- Git

## 🚀 Installation Pas à Pas

### 1. Préparation du Serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Vérification des versions
node --version  # Devrait afficher v18.x.x
npm --version   # Devrait afficher 9.x.x

# Installation Nginx
sudo apt install -y nginx

# Installation Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx

# Installation PM2 (process manager)
sudo npm install -g pm2
```

### 2. Création de l'Utilisateur

```bash
# Créer un utilisateur dédié (sécurité)
sudo adduser fct-app --disabled-password --gecos ""
sudo usermod -aG sudo fct-app  # Optionnel: si besoin sudo

# Se connecter avec cet utilisateur
sudo su - fct-app
```

### 3. Déploiement de l'Application

```bash
# Créer le répertoire de l'application
mkdir -p ~/apps
cd ~/apps

# Cloner le repository (ou télécharger les fichiers)
git clone <votre-repo-git> fct-timesheet
# OU copier les fichiers via SCP/SFTP

cd fct-timesheet

# Installer les dépendances
npm install --production

# Créer le fichier .env depuis le template
cp .env.example .env

# IMPORTANT: Éditer le .env avec vos valeurs
nano .env
```

### 4. Configuration .env Production

```env
# Port de l'application (laissez 3000, nginx gèrera le port 80/443)
PORT=3000

# SECRET DE SESSION - GÉNÉREZ UNE VALEUR UNIQUE
# Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=VOTRE_SECRET_ALEATOIRE_ICI

# Environnement
NODE_ENV=production

# Base de données
DB_PATH=/home/fct-app/apps/fct-timesheet/fct_timesheet.db
```

**⚠️ IMPORTANT**: Générer un SESSION_SECRET sécurisé:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiez le résultat dans .env
```

### 5. Test de l'Application

```bash
# Tester le démarrage
npm start

# Devrait afficher:
# Server running on http://localhost:3000
# Connected to the SQLite database.
# Database tables initialized.

# Ouvrir un autre terminal et tester
curl http://localhost:3000

# Si OK, arrêter avec Ctrl+C
```

### 6. Configuration PM2

```bash
# Démarrer l'application avec PM2
pm2 start server.js --name fct-timesheet

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs fct-timesheet

# Configurer le démarrage automatique au boot
pm2 startup
# Copier et exécuter la commande affichée

# Sauvegarder la configuration PM2
pm2 save
```

### 7. Configuration Nginx (Reverse Proxy)

```bash
# Créer le fichier de configuration Nginx
sudo nano /etc/nginx/sites-available/fct-timesheet
```

Contenu du fichier:

```nginx
# Configuration HTTP (sera redirigé vers HTTPS après SSL)
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection vers HTTPS (après configuration SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Sécurité: Cacher la version Nginx
    server_tokens off;

    # Limites de taille
    client_max_body_size 2M;
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/fct-timesheet /etc/nginx/sites-enabled/

# Supprimer le site par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
sudo nginx -t

# Si OK, redémarrer Nginx
sudo systemctl restart nginx
```

### 8. Configuration SSL (Let's Encrypt)

```bash
# Obtenir un certificat SSL gratuit
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Suivre les instructions interactives:
# - Entrez votre email
# - Acceptez les termes
# - Choisissez "Redirect" pour forcer HTTPS

# Tester le renouvellement automatique
sudo certbot renew --dry-run
```

Certbot modifiera automatiquement la configuration Nginx pour ajouter SSL.

### 9. Configuration Firewall (UFW)

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH (NE PAS OUBLIER!)
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Vérifier les règles
sudo ufw status
```

### 10. Vérification Finale

```bash
# 1. Vérifier PM2
pm2 status

# 2. Vérifier Nginx
sudo systemctl status nginx

# 3. Tester l'application
curl -I https://votre-domaine.com

# 4. Ouvrir dans un navigateur
# https://votre-domaine.com
```

## 🔒 Sécurisation Supplémentaire

### 1. Fail2Ban (Protection contre brute force SSH)

```bash
# Installation
sudo apt install -y fail2ban

# Configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Activer et démarrer
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Configuration Sécurité Nginx Avancée

Éditer `/etc/nginx/sites-available/fct-timesheet` et ajouter dans le bloc `server`:

```nginx
# En-têtes de sécurité
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;

# Désactiver les méthodes HTTP non nécessaires
if ($request_method !~ ^(GET|POST|HEAD)$ ) {
    return 405;
}
```

Redémarrer Nginx:
```bash
sudo nginx -t && sudo systemctl restart nginx
```

### 3. Permissions Fichiers

```bash
cd ~/apps/fct-timesheet

# Sécuriser .env
chmod 600 .env

# Sécuriser la base de données
chmod 600 fct_timesheet.db

# Dossier application
chmod 755 ~/apps/fct-timesheet
```

## 📊 Monitoring et Maintenance

### 1. Surveillance PM2

```bash
# Installer PM2 Plus (monitoring gratuit)
pm2 plus

# Ou monitoring local
pm2 monit

# Logs en temps réel
pm2 logs fct-timesheet --lines 100
```

### 2. Backups Automatiques

Créer un script de backup:

```bash
nano ~/backup-fct.sh
```

Contenu:

```bash
#!/bin/bash

# Configuration
APP_DIR="/home/fct-app/apps/fct-timesheet"
DB_FILE="$APP_DIR/fct_timesheet.db"
BACKUP_DIR="/home/fct-app/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le dossier de backup
mkdir -p $BACKUP_DIR

# Backup base de données
sqlite3 $DB_FILE ".backup '$BACKUP_DIR/fct_db_$DATE.db'"

# Backup fichier .env
cp $APP_DIR/.env $BACKUP_DIR/.env_$DATE

# Compression
tar -czf $BACKUP_DIR/fct_complete_$DATE.tar.gz \
    $BACKUP_DIR/fct_db_$DATE.db \
    $BACKUP_DIR/.env_$DATE

# Nettoyer les backups intermédiaires
rm $BACKUP_DIR/fct_db_$DATE.db
rm $BACKUP_DIR/.env_$DATE

# Garder seulement les 30 derniers jours
find $BACKUP_DIR -name "fct_complete_*.tar.gz" -mtime +30 -delete

echo "Backup créé: $BACKUP_DIR/fct_complete_$DATE.tar.gz"
```

Rendre exécutable et configurer cron:

```bash
chmod +x ~/backup-fct.sh

# Ajouter au crontab (backup quotidien à 2h du matin)
crontab -e

# Ajouter cette ligne:
0 2 * * * /home/fct-app/backup-fct.sh >> /home/fct-app/backup.log 2>&1
```

### 3. Rotation des Logs PM2

```bash
# Installer le module de rotation
pm2 install pm2-logrotate

# Configurer (garder 7 jours)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 4. Monitoring Nginx

```bash
# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreurs
sudo tail -f /var/log/nginx/error.log

# Stats en temps réel
sudo apt install -y goaccess
sudo goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED
```

## 🔄 Mise à Jour de l'Application

```bash
cd ~/apps/fct-timesheet

# 1. Backup avant mise à jour
~/backup-fct.sh

# 2. Récupérer les nouvelles versions
git pull origin main
# OU copier les nouveaux fichiers

# 3. Installer nouvelles dépendances si nécessaire
npm install --production

# 4. Redémarrer l'application
pm2 restart fct-timesheet

# 5. Vérifier les logs
pm2 logs fct-timesheet --lines 50
```

## 🆘 Dépannage

### Application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs fct-timesheet --err

# Vérifier les ports
sudo netstat -tulpn | grep 3000

# Tester manuellement
cd ~/apps/fct-timesheet
npm start
```

### Erreur 502 Bad Gateway (Nginx)

```bash
# Vérifier si l'app tourne
pm2 status

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Redémarrer l'app
pm2 restart fct-timesheet

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Base de données corrompue

```bash
# Restaurer depuis backup
cd ~/apps/fct-timesheet
cp ~/backups/fct_complete_YYYYMMDD_HHMMSS.tar.gz ./
tar -xzf fct_complete_YYYYMMDD_HHMMSS.tar.gz
# Extraire la DB et remplacer
```

### SSL ne fonctionne pas

```bash
# Vérifier le certificat
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew --force-renewal

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs: `pm2 logs fct-timesheet`
2. Consulter ARCHITECTURE.md
3. Vérifier la documentation officielle

## ✅ Checklist Post-Déploiement

- [ ] Application accessible via HTTPS
- [ ] Certificat SSL valide
- [ ] PM2 configuré avec auto-restart
- [ ] Backups automatiques configurés
- [ ] Firewall UFW actif
- [ ] Logs monitored
- [ ] .env sécurisé (permissions 600)
- [ ] SESSION_SECRET unique et fort
- [ ] Tests de connexion/inscription OK
- [ ] Tests de fonctionnalités timesheet OK

---

**Besoin d'aide?** Consultez [ARCHITECTURE.md](ARCHITECTURE.md) pour plus de détails techniques.
