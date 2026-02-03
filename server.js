const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Sécurité : Helmet pour protéger les en-têtes HTTP
app.use(helmet({
    contentSecurityPolicy: false, // Désactivé pour permettre Tailwind CDN
}));

// Rate limiting pour prévenir les attaques par force brute
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite de 5 tentatives
    message: 'Trop de tentatives de connexion, réessayez plus tard',
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requêtes par 15 minutes
    message: 'Trop de requêtes, réessayez plus tard',
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'changez-moi-en-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        httpOnly: true, // Prévenir XSS
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        sameSite: 'strict' // Protection CSRF
    }
}));

// Helper: Middleware to protect routes
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// --- AUTH ROUTES ---

// Validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom d\'utilisateur doit faire entre 3 et 30 caractères')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, - et _'),
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Le mot de passe doit faire entre 8 et 128 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
];

const loginValidation = [
    body('username').trim().notEmpty(),
    body('password').notEmpty()
];

// Register
app.post('/api/auth/register', authLimiter, registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 12); // Augmenté à 12 rounds
        const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
        stmt.run(username, hash, function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Ce nom d\'utilisateur existe déjà' });
                }
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Erreur de base de données' });
            }
            req.session.userId = this.lastID;
            req.session.username = username;
            res.json({ message: 'Utilisateur enregistré avec succès', userId: this.lastID });
        });
        stmt.finalize();
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Login
app.post('/api/auth/login', authLimiter, loginValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        try {
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                req.session.userId = user.id;
                req.session.username = user.username;
                res.json({ message: 'Connexion réussie', user: { id: user.id, username: user.username } });
            } else {
                res.status(401).json({ error: 'Identifiants invalides' });
            }
        } catch (e) {
            console.error('Bcrypt error:', e);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Check Session
app.get('/api/auth/me', (req, res) => {
    if (req.session.userId) {
        res.json({ user: { id: req.session.userId, username: req.session.username } });
    } else {
        res.status(401).json({ user: null });
    }
});

// Change Password
app.post('/api/auth/change-password', isAuthenticated, authLimiter, [
    body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
    body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('Le nouveau mot de passe doit faire entre 8 et 128 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.session.userId;

    try {
        // Récupérer l'utilisateur
        db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Erreur de base de données' });
            }

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Vérifier le mot de passe actuel
            const isValid = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isValid) {
                return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
            }

            // Hasher le nouveau mot de passe
            const newHash = await bcrypt.hash(newPassword, 12);

            // Mettre à jour le mot de passe
            db.run(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [newHash, userId],
                (err) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Échec de la mise à jour' });
                    }
                    res.json({ message: 'Mot de passe modifié avec succès' });
                }
            );
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// --- TIMESHEET ROUTES ---

// Validation des paramètres de timesheet
const timesheetValidation = [
    body('year').isInt({ min: 2020, max: 2100 }).withMessage('Année invalide'),
    body('month').isInt({ min: 0, max: 11 }).withMessage('Mois invalide'),
    body('data').isObject().withMessage('Données invalides')
];

// Get Timesheet for a specific month/year
app.get('/api/timesheet/:year/:month', isAuthenticated, apiLimiter, (req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const userId = req.session.userId;

    // Validation des paramètres (mois 0-11 en JavaScript)
    if (!year || year < 2020 || year > 2100 || month < 0 || month > 11) {
        return res.status(400).json({ error: 'Paramètres invalides' });
    }

    db.get(
        'SELECT * FROM timesheets WHERE user_id = ? AND year = ? AND month = ?',
        [userId, year, month],
        (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Erreur de base de données' });
            }
            if (row) {
                res.json({ data: JSON.parse(row.data), status: row.status });
            } else {
                res.json({ data: {}, status: 'new' });
            }
        }
    );
});

// Save Timesheet
app.post('/api/timesheet', isAuthenticated, apiLimiter, timesheetValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { year, month, data } = req.body;
    const userId = req.session.userId;
    const dataStr = JSON.stringify(data);

    // Upsert logic
    db.run(`
        INSERT INTO timesheets (user_id, year, month, data, status, updated_at)
        VALUES (?, ?, ?, ?, 'draft', CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, year, month) 
        DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP
    `, [userId, year, month, dataStr], function (err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Échec de la sauvegarde' });
        }
        res.json({ message: 'Feuille de temps sauvegardée' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
