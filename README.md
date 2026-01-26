# Kuro - Votre Majordome Numérique | Your Digital Butler

<p align="center">
  <img src="https://img.shields.io/badge/Status-Coming%20Soon-00d4aa?style=for-the-badge" alt="Status: Coming Soon">
  <img src="https://img.shields.io/badge/i18n-FR%20%7C%20EN-blue?style=for-the-badge" alt="Languages: FR | EN">
</p>

## 🏠 À propos | About

**Kuro** est votre majordome numérique personnel. Il vous aide à organiser votre vie quotidienne en centralisant vos documents, objets et garanties pour ne plus jamais rater une échéance importante.

**Kuro** is your personal digital butler. It helps you organize your daily life by centralizing your documents, objects, and warranties so you never miss an important deadline again.

## ✨ Fonctionnalités | Features

- 📄 **Gestion de documents** | **Document management** - Centralisez vos factures, garanties et manuels
- 📦 **Inventaire d'objets** | **Item inventory** - Cataloguez tous vos biens avec leurs informations
- ⏰ **Rappels intelligents** | **Smart reminders** - Notifications automatiques pour les garanties qui expirent
- 🔒 **Données sécurisées** | **Secure data** - Vos informations restent privées et protégées
- 🔍 **Recherche rapide** | **Quick search** - Trouvez n'importe quel objet ou document instantanément
- 🏡 **Organisation par pièce** | **Room organization** - Naviguez intuitivement dans votre inventaire

## 🌐 Internationalisation | i18n

Le site est disponible en français et en anglais avec un système i18n dynamique.

The site is available in French and English with a dynamic i18n system.

## 🚀 Déploiement | Deployment

Ce site est optimisé pour un déploiement sur **Vercel**.

This site is optimized for deployment on **Vercel**.

### Structure

```
├── app/
│   ├── layout.jsx            # Layout Next.js + Analytics
│   ├── page.jsx              # Home
│   ├── contact/page.jsx      # Contact
│   ├── privacy/page.jsx      # Confidentialité
│   ├── delete-account/page.jsx # Suppression de compte
│   ├── globals.css           # Styles globaux
│   └── lib/html.js           # Extraction du contenu HTML source
├── public/
│   ├── script.js             # Interactions JavaScript
│   └── i18n/
│       ├── translations.js   # Traductions FR/EN
│       └── i18n.js           # Système de traduction
├── index.html                # Sources HTML (contenu réutilisé)
├── contact.html
├── privacy.html
├── delete-account.html
└── README.md                 # Ce fichier | This file
```

## 🛠️ Développement Local | Local Development

```bash
# Cloner le repository
git clone https://github.com/kuro/kuro.github.io.git
cd kuro.github.io

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

Puis ouvrir http://localhost:3000 dans votre navigateur.

## 📬 Contact

Vous avez des questions ou des suggestions ? Utilisez le formulaire de contact sur notre site.

---

<p align="center">
  <strong>◈ Kuro</strong> - Votre majordome numérique personnel | Your personal digital butler
</p>
