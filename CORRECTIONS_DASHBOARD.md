# Corrections et Améliorations - Dashboard

**Date :** 2 février 2026  
**Fichier concerné :** `public/dashboard.html`

---

## 🐛 Problèmes Identifiés

### Erreur principale
```
Uncaught ReferenceError: require is not defined
```
- **Cause :** Conflit entre Babel Standalone et l'Import Map ES6
- **Impact :** Le dashboard ne se chargeait pas, page blanche

### Erreurs secondaires
```
.targets["esmodules"] must be a boolean, or undefined
```
- **Cause :** Attribut `data-type="module"` incompatible avec Babel Standalone
- **Impact :** Échec de la transformation JSX par Babel

---

## ✅ Corrections Appliquées

### 1. Remplacement de l'Import Map par CDN UMD
**Avant :**
```html
<script type="importmap">
{
    "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
        "lucide-react": "https://esm.sh/lucide-react@0.300.0"
    }
}
</script>
```

**Après :**
```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

**Raison :** Babel Standalone fonctionne uniquement avec React en mode UMD (variables globales), pas avec les modules ES6 via Import Map.

---

### 2. Modification des imports React
**Avant :**
```javascript
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, ... } from 'lucide-react';
```

**Après :**
```javascript
const { useState, useMemo, useEffect } = React;
const { createRoot } = ReactDOM;

// Icônes remplacées par des émojis
const CheckCircle = () => <span>✓</span>;
const Save = () => <span>💾</span>;
// etc.
```

**Raison :** 
- Évite l'erreur `require is not defined`
- Compatible avec Babel Standalone + UMD
- Lucide-react retiré temporairement (nécessitait ESM)

---

### 3. Simplification du script tag
**Avant (plusieurs tentatives) :**
```html
<script type="text/babel" data-type="module">
<script type="text/babel" data-type="module" data-presets="react">
```

**Après :**
```html
<script type="text/babel">
```

**Raison :** Babel Standalone détecte automatiquement JSX, pas besoin d'attributs supplémentaires qui créent des conflits.

---

## 🎯 Résultat Final

### Architecture retenue
**Option 1 - Babel + JSX + React UMD (production simplifiée)**

✅ Avantages :
- Compatible navigateur sans build
- JSX fonctionnel
- React 18 chargé correctement
- Aucune erreur de compilation

⚠️ Limitations connues :
- Warnings normaux en dev (Tailwind CDN, Babel transformer)
- Icônes émojis au lieu de Lucide React
- Non optimisé pour production (nécessitera build ultérieurement)

---

## 📝 Notes Techniques

### Pourquoi l'Import Map ne fonctionnait pas ?
L'Import Map est une fonctionnalité moderne des navigateurs pour gérer les modules ES6, mais :
1. Babel Standalone transforme le code avant que le navigateur ne charge les modules
2. Babel convertit les `import` en `require()` (CommonJS)
3. Le navigateur ne comprend pas `require()` → Erreur

### Solution UMD
Les scripts UMD exposent React et ReactDOM comme variables globales (`window.React`, `window.ReactDOM`), ce qui est compatible avec Babel Standalone.

---

## 🚀 Prochaines Améliorations Possibles

1. **Build en production** : Utiliser Vite ou Webpack pour :
   - Compiler JSX en amont
   - Optimiser les bundles
   - Supprimer Babel Standalone

2. **Réintégrer Lucide React** : Avec un système de build

3. **Migration ESM pure** : Supprimer Babel, écrire en `React.createElement()`

---

## ⚙️ Configuration Finale Validée

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- React UMD -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Babel Standalone -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useMemo, useEffect } = React;
        const { createRoot } = ReactDOM;
        
        // Application...
    </script>
</body>
</html>
```

---

**Status :** ✅ Dashboard fonctionnel en développement
