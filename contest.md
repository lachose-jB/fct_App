# ✅ PROJET COMPLÉTÉ - FCT Timesheet App

## 🎯 Objectifs Réalisés

### ✅ 1. Sécurité "Design by Code"
Le projet a été entièrement sécurisé avec les meilleures pratiques:

- **Authentification robuste**: 
  - Hachage bcrypt (12 rounds)
  - Validation stricte des mots de passe
  - Protection contre brute force (rate limiting)
  
- **Protection des données**:
  - Prepared statements (SQL injection)
  - Validation express-validator sur toutes les routes
  - Sessions sécurisées (httpOnly, sameSite, secure)
  
- **Sécurité des headers**:
  - Helmet.js configuré
  - CORS approprié
  - CSP headers

### ✅ 2. Pages Login et Signup Séparées

**Architecture Moderne:**

```
public/
├── index.html      → Page d'accueil avec redirection
├── login.html      → Connexion dédiée ⭐
├── signup.html     → Inscription dédiée ⭐
└── dashboard.html  → Application React protégée
```

**Fonctionnalités:**
- ✅ Design moderne et responsive
- ✅ Validation en temps réel
- ✅ Indicateur de force du mot de passe
- ✅ Messages d'erreur clairs
- ✅ Redirections automatiques
- ✅ Loading states
- ✅ UX optimale

### ✅ 3. Architecture Sécurisée pour Déploiement

**Documentation Complète:**
- ✅ [README.md](README.md) - Guide utilisateur
- ✅ [ARCHITECTURE.md](ARCHITECTURE.md) - Documentation technique de sécurité
- ✅ [DEPLOYMENT.md](DEPLOYMENT.md) - Guide de déploiement production

**Configuration:**
- ✅ Variables d'environnement (.env)
- ✅ .gitignore pour protéger les secrets
- ✅ Scripts npm configurés

## 📁 Structure Finale du Projet

```
fct-app/
├── 📄 server.js                 # Serveur Express sécurisé
├── 📄 database.js               # Configuration SQLite
├── 📄 package.json              # Dépendances sécurisées
├── 📄 .env                      # Variables d'environnement
├── 📄 .env.example              # Template de configuration
├── 📄 .gitignore                # Protection fichiers sensibles
│
├── 📖 README.md                 # Documentation utilisateur
├── 📖 ARCHITECTURE.md           # Documentation technique
├── 📖 DEPLOYMENT.md             # Guide de déploiement
├── 📖 contest.md                # Ce fichier
│
└── 📁 public/                   # Interface utilisateur
    ├── 🏠 index.html            # Page d'accueil
    ├── 🔐 login.html            # Connexion
    ├── ✍️  signup.html           # Inscription
    └── 📊 dashboard.html        # Application timesheet
```

## 🔒 Sécurité Implémentée

### Backend (server.js)
```javascript
✅ Helmet.js              → Protection headers HTTP
✅ Rate Limiting          → Anti brute force & DoS
✅ express-validator      → Validation stricte entrées
✅ bcrypt (12 rounds)     → Hachage mots de passe fort
✅ Session sécurisée      → httpOnly, sameSite, secure
✅ Variables .env         → Secrets protégés
✅ Prepared statements    → Anti SQL injection
✅ Error handling         → Logs + messages génériques
```

### Frontend
```javascript
✅ Pages séparées         → Meilleure organisation
✅ Validation client      → UX améliorée
✅ Redirections auto      → Protection routes
✅ HTTPS ready            → Cookies secure en prod
✅ Design moderne         → Tailwind CSS + animations
```

### Base de Données
```sql
✅ Foreign keys           → Intégrité référentielle
✅ Contraintes UNIQUE     → Éviter doublons
✅ Index appropriés       → Performance
✅ Timestamps             → Traçabilité
```

## 🚀 Démarrage Rapide

### Installation
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditez .env et changez SESSION_SECRET

# 3. Générer un secret sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Démarrer l'application
npm start

# 5. Ouvrir http://localhost:3000
```

### Utilisation
1. **Créer un compte** sur `/signup.html`
   - Username: 3-30 caractères alphanumériques
   - Password: Min 8 car, majuscule + minuscule + chiffre
   
2. **Se connecter** sur `/login.html`

3. **Gérer son temps** sur `/dashboard.html`
   - Sélectionner un mois
   - Cliquer sur les jours pour marquer présence/absence
   - Ajouter des commentaires
   - Sauvegarder

## 📊 Fonctionnalités de l'Application

### Authentification
- ✅ Inscription avec validation stricte
- ✅ Connexion sécurisée
- ✅ Déconnexion propre
- ✅ Gestion de session
- ✅ Protection des routes

### Gestion du Temps
- ✅ Calendrier mensuel 2026
- ✅ Types de journée: Complète, Demi, Absence
- ✅ Détection automatique week-ends et jours fériés
- ✅ Commentaires par jour
- ✅ Remplissage automatique du mois
- ✅ Statistiques en temps réel
- ✅ Sauvegarde automatique

### Interface
- ✅ Design moderne et responsive
- ✅ Thème professionnel (Tailwind CSS)
- ✅ Animations fluides
- ✅ Feedback utilisateur immédiat
- ✅ Mobile-friendly

## 🎓 Documentation

### Pour les Développeurs
- Lire [ARCHITECTURE.md](ARCHITECTURE.md) pour comprendre la sécurité
- Consulter les commentaires dans `server.js`
- Respecter les principes de sécurité établis

### Pour le Déploiement
- Suivre [DEPLOYMENT.md](DEPLOYMENT.md) étape par étape
- Checklist de sécurité pré-production
- Configuration Nginx + SSL
- Monitoring et backups

### Pour les Utilisateurs
- Lire [README.md](README.md)
- Guide d'utilisation simple
- FAQ et dépannage

## ⚙️ Technologies Utilisées

**Backend:**
- Node.js + Express
- SQLite3
- bcrypt, helmet, express-validator
- express-rate-limit, express-session
- dotenv

**Frontend:**
- React 18 (via CDN)
- Tailwind CSS
- Lucide Icons
- HTML5 moderne

## 🔐 Checklist de Sécurité

- ✅ Authentification robuste
- ✅ Mots de passe hachés (bcrypt 12 rounds)
- ✅ Sessions sécurisées (httpOnly, sameSite)
- ✅ Rate limiting (auth + API)
- ✅ Validation des entrées (client + serveur)
- ✅ Prepared statements SQL
- ✅ Helmet.js configuré
- ✅ Variables d'environnement
- ✅ .gitignore pour secrets
- ✅ Messages d'erreur génériques
- ✅ HTTPS ready
- ✅ CORS approprié
- ✅ Error handling complet

## 📈 Évolutions Possibles

### Court Terme
- [ ] Reset password par email
- [ ] Remember me fonctionnel
- [ ] Export PDF des timesheet
- [ ] Validation manager

### Moyen Terme
- [ ] Multi-utilisateurs avec rôles (Admin/User/Manager)
- [ ] Dashboard analytics
- [ ] Notifications
- [ ] API REST complète

### Long Terme
- [ ] Mobile app (React Native)
- [ ] Intégration calendrier externe
- [ ] Machine learning pour suggestions
- [ ] Mode offline

## 🧪 Tests Recommandés

```bash
# 1. Tests de sécurité
npm audit

# 2. Tests de charge (rate limiting)
# Utiliser Apache Bench ou k6

# 3. Tests de pénétration
# OWASP ZAP ou Burp Suite

# 4. Tests fonctionnels
# Playwright ou Cypress
```

## 📞 Support

Pour toute question:
1. Consulter la documentation (README, ARCHITECTURE, DEPLOYMENT)
2. Vérifier les logs: `pm2 logs` ou console du navigateur
3. Issues GitHub (si applicable)

## 🎉 Conclusion

**Projet FCT Timesheet - Application de gestion du temps sécurisée**

✅ Tous les objectifs atteints:
- Sécurité par conception
- Pages login/signup dédiées et modernes
- Architecture prête pour la production
- Documentation complète

**Statut**: PRÊT POUR DÉPLOIEMENT 🚀

---

**Date de completion**: 2 février 2026  
**Version**: 1.0.0  
**Auteur**: FCT Dev Team

# Email & Password

Implementing email and password authentication with Better Auth.



Email and password authentication is a common method used by many applications. Better Auth provides a built-in email and password authenticator that you can easily integrate into your project.

<Callout type="info">
  If you prefer username-based authentication, check out the{" "}
  <Link href="/docs/plugins/username">username plugin</Link>. It extends the
  email and password authenticator with username support.
</Callout>

## Enable Email and Password

To enable email and password authentication, you need to set the `emailAndPassword.enabled` option to `true` in the `auth` configuration.

```ts title="auth.ts"
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: { // [!code highlight]
    enabled: true, // [!code highlight]
  }, // [!code highlight]
});
```

<Callout type="info">
  If it's not enabled, it'll not allow you to sign in or sign up with email and
  password.
</Callout>

## Usage

### Sign Up

To sign a user up, you can use the `signUp.email` function provided by the client.


### Client Side

```ts
const { data, error } = await authClient.signUp.email({
    name: John Doe,
    email: john.doe@example.com,
    password: password1234,
    image: https://example.com/image.png, // optional
    callbackURL: https://example.com/callback, // optional
});
```

### Server Side

```ts
const data = await auth.api.signUpEmail({
    body: {
        name: John Doe,
        email: john.doe@example.com,
        password: password1234,
        image: https://example.com/image.png, // optional
        callbackURL: https://example.com/callback, // optional
    }
});
```

### Type Definition

```ts
type signUpEmail = {
      /**
       * The name of the user.
       */
      name: string = "John Doe"
      /**
       * The email address of the user.
       */
      email: string = "john.doe@example.com"
      /**
       * The password of the user. It should be at least 8 characters long and max 128 by default.
       */
      password: string = "password1234"
      /**
       * An optional profile image of the user.
       */
      image?: string = "https://example.com/image.png"
      /**
       * An optional URL to redirect to after the user signs up.
       */
      callbackURL?: string = "https://example.com/callback"
  
}
```


<Callout>
  These are the default properties for the sign up email endpoint, however it's possible that with [additional fields](/docs/concepts/typescript#additional-fields) or special plugins you can pass more properties to the endpoint.
</Callout>

### Sign In

To sign a user in, you can use the `signIn.email` function provided by the client.


### Client Side

```ts
const { data, error } = await authClient.signIn.email({
    email: john.doe@example.com,
    password: password1234,
    rememberMe, // optional
    callbackURL: https://example.com/callback, // optional
});
```

### Server Side

```ts
const data = await auth.api.signInEmail({
    body: {
        email: john.doe@example.com,
        password: password1234,
        rememberMe, // optional
        callbackURL: https://example.com/callback, // optional
    },
    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type signInEmail = {
      /**
       * The email address of the user.
       */
      email: string = "john.doe@example.com"
      /**
       * The password of the user. It should be at least 8 characters long and max 128 by default.
       */
      password: string = "password1234"
      /**
       * If false, the user will be signed out when the browser is closed. (optional) (default: true)
       */
      rememberMe?: boolean = true
      /**
       * An optional URL to redirect to after the user signs in. (optional)
       */
      callbackURL?: string = "https://example.com/callback"
  
}
```


<Callout>
  These are the default properties for the sign in email endpoint, however it's possible that with [additional fields](/docs/concepts/typescript#additional-fields) or special plugins you can pass different properties to the endpoint.
</Callout>

### Sign Out

To sign a user out, you can use the `signOut` function provided by the client.


### Client Side

```ts
const { data, error } = await authClient.signOut({});
```

### Server Side

```ts
await auth.api.signOut({

    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type signOut = {
  
}
```


you can pass `fetchOptions` to redirect onSuccess

```ts title="auth-client.ts" 
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login"); // redirect to login page
    },
  },
});
```

### Email Verification

To enable email verification, you need to pass a function that sends a verification email with a link. The `sendVerificationEmail` function takes a data object with the following properties:

* `user`: The user object.
* `url`: The URL to send to the user which contains the token.
* `token`: A verification token used to complete the email verification.

and a `request` object as the second parameter.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
});
```

<Callout type="warn">
  Avoid awaiting the email sending to prevent
  timing attacks. On serverless platforms, use `waitUntil` or similar to ensure the email is sent.
</Callout>

On the client side you can use `sendVerificationEmail` function to send verification link to user. This will trigger the `sendVerificationEmail` function you provided in the `auth` configuration.

Once the user clicks on the link in the email, if the token is valid, the user will be redirected to the URL provided in the `callbackURL` parameter. If the token is invalid, the user will be redirected to the URL provided in the `callbackURL` parameter with an error message in the query string `?error=invalid_token`.

#### Require Email Verification

If you enable require email verification, users must verify their email before they can log in. And every time a user tries to sign in, sendVerificationEmail is called.

<Callout>
  This only works if you have sendVerificationEmail implemented and if the user
  is trying to sign in with email and password.
</Callout>

```ts title="auth.ts"
export const auth = betterAuth({
  emailAndPassword: {
    requireEmailVerification: true,
  },
});
```

If a user tries to sign in without verifying their email, you can handle the error and show a message to the user.

```ts title="auth-client.ts"
await authClient.signIn.email(
  {
    email: "email@example.com",
    password: "password",
  },
  {
    onError: (ctx) => {
      // Handle the error
      if (ctx.error.status === 403) {
        alert("Please verify your email address");
      }
      //you can also show the original error message
      alert(ctx.error.message);
    },
  }
);
```

#### Triggering manually Email Verification

You can trigger the email verification manually by calling the `sendVerificationEmail` function.

```ts
await authClient.sendVerificationEmail({
  email: "user@email.com",
  callbackURL: "/", // The redirect URL after verification
});
```

### Request Password Reset

To allow users to reset a password first you need to provide `sendResetPassword` function to the email and password authenticator. The `sendResetPassword` function takes a data object with the following properties:

* `user`: The user object.
* `url`: The URL to send to the user which contains the token.
* `token`: A verification token used to complete the password reset.

and a `request` object as the second parameter.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url, token}, request) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
});
```

<Callout type="warn">
  Avoid awaiting the email sending to prevent
  timing attacks. On serverless platforms, use `waitUntil` or similar to ensure the email is sent.
</Callout>

Additionally, you can provide an `onPasswordReset` callback to execute logic after a password has been successfully reset.

Once you configured your server you can call `requestPasswordReset` function to send reset password link to user. If the user exists, it will trigger the `sendResetPassword` function you provided in the auth config.


### Client Side

```ts
const { data, error } = await authClient.requestPasswordReset({
    email: john.doe@example.com,
    redirectTo: https://example.com/reset-password, // optional
});
```

### Server Side

```ts
const data = await auth.api.requestPasswordReset({
    body: {
        email: john.doe@example.com,
        redirectTo: https://example.com/reset-password, // optional
    }
});
```

### Type Definition

```ts
type requestPasswordReset = {
      /**
       * The email address of the user to send a password reset email to 
       */
      email: string = "john.doe@example.com"
      /**
       * The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN 
       */
      redirectTo?: string = "https://example.com/reset-password"
  
}
```


When a user clicks on the link in the email, they will be redirected to the reset password page. You can add the reset password page to your app. Then you can use `resetPassword` function to reset the password. It takes an object with the following properties:

* `newPassword`: The new password of the user.

```ts title="auth-client.ts"
const { data, error } = await authClient.resetPassword({
  newPassword: "password1234",
  token,
});
```


### Client Side

```ts
const { data, error } = await authClient.resetPassword({
    newPassword: password1234,
    token,
});
```

### Server Side

```ts
const data = await auth.api.resetPassword({
    body: {
        newPassword: password1234,
        token,
    }
});
```

### Type Definition

```ts
type resetPassword = {
      /**
       * The new password to set 
       */
      newPassword: string = "password1234"
      /**
       * The token to reset the password 
       */
      token: string
  
}
```


### Update password

A user's password isn't stored in the user table. Instead, it's stored in the account table. To change the password of a user, you can use one of the following approaches:


### Client Side

```ts
const { data, error } = await authClient.changePassword({
    newPassword: newpassword1234,
    currentPassword: oldpassword1234,
    revokeOtherSessions, // optional
});
```

### Server Side

```ts
const data = await auth.api.changePassword({
    body: {
        newPassword: newpassword1234,
        currentPassword: oldpassword1234,
        revokeOtherSessions, // optional
    },
    // This endpoint requires session cookies.
    headers: await headers()
});
```

### Type Definition

```ts
type changePassword = {
      /**
       * The new password to set 
       */
      newPassword: string = "newpassword1234"
      /**
       * The current user password 
       */
      currentPassword: string = "oldpassword1234"
      /**
       * When set to true, all other active sessions for this user will be invalidated
       */
      revokeOtherSessions?: boolean = true
  
}
```


### Configuration

**Password**

Better Auth stores passwords inside the `account` table with `providerId` set to `credential`.

**Password Hashing**: Better Auth uses `scrypt` to hash passwords. The `scrypt` algorithm is designed to be slow and memory-intensive to make it difficult for attackers to brute force passwords. OWASP recommends using `scrypt` if `argon2id` is not available. We decided to use `scrypt` because it's natively supported by Node.js.

You can pass custom password hashing algorithm by setting `password` option in the `emailAndPassword` configuration.

**Example**

Here's an example of customizing the password hashing to use Argon2:

```ts title="password.ts"
import { hash, type Options, verify } from "@node-rs/argon2";

const opts: Options = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4, // 4 lanes
  outputLen: 32, // 32 bytes
  algorithm: 2, // Argon2id
};

export async function hashPassword(password: string) {
  const result = await hash(password, opts);
  return result;
}

export async function verifyPassword(data: { password: string; hash: string }) {
  const { password, hash } = data;
  const result = await verify(hash, password, opts);
  return result;
}
```

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "./password";

export const auth = betterAuth({
  emailAndPassword: {
    //...rest of the options
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
});
```

<TypeTable
  type={{
  enabled: {
    description: "Enable email and password authentication.",
    type: "boolean",
    default: "false",
  },
  disableSignUp: {
    description: "Disable email and password sign up.",
    type: "boolean",
    default: "false"
  },
  minPasswordLength: {
    description: "The minimum length of a password.",
    type: "number",
    default: 8,
  },
  maxPasswordLength: {
    description: "The maximum length of a password.",
    type: "number",
    default: 128,
  },
  sendResetPassword: {
    description:
      "Sends a password reset email. It takes a function that takes two parameters: token and user.",
    type: "function",
  },
  onPasswordReset: {
    description:
      "A callback function that is triggered when a user's password is changed successfully.",
    type: "function",
  },
  resetPasswordTokenExpiresIn: {
    description:
      "Number of seconds the reset password token is valid for.",
    type: "number",
    default: 3600
  },
  password: {
    description: "Password configuration.",
    type: "object",
    properties: {
      hash: {
        description: "custom password hashing function",
        type: "function",
      },
      verify: {
        description: "custom password verification function",
        type: "function",
      },
    },
  },
}}
/>

# reoganishe l'architecteur securisé pour un deployement 