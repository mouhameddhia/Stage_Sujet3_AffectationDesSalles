🏢 Système de Gestion d'Affectation des Salles
📋 Description du Projet
Système complet de gestion et d'affectation des salles d'un établissement éducatif, développé en React (Material-UI) pour le frontend et Spring Boot pour le backend.

Le système permet de :

Créer et gérer les salles (hiérarchie Bloc → Étage → Salle)

Créer et gérer les affectations (cours, événements, réunions…)

Visualiser les plannings via un calendrier ou un emploi du temps en tableau

Éviter les conflits horaires automatiquement

Fournir des recommandations intelligentes de salles grâce à l’IA

✨ Fonctionnalités Principales
🎯 Gestion des Affectations
Création d'affectations (cours, événements…)

Vue calendrier interactive (drag & drop)

Vue tableau avec échelle horaire verticale (8h–20h)

Synchronisation en temps réel

Détection automatique des conflits horaires

🏗️ Gestion des Salles
Hiérarchie complète : Blocs → Étages → Salles

Filtres avancés (par bloc, étage, type de salle)

CRUD complet sur les salles

Vues multiples (par bloc, par type, vue générale)

🤖 Système de Recommandations IA
Suggestions automatiques de salles disponibles

Prise en compte de critères multiples (capacité, type, bloc, étage, disponibilité…)

Création directe d’affectation depuis les recommandations

👥 Gestion des Utilisateurs
Authentification sécurisée

Rôles (Admin / Utilisateur standard)

Workflow de validation des affectations

🛠️ Technologies Utilisées
Frontend
React 18

Material-UI (MUI)

React Router

Axios

Context API

Backend
Spring Boot

JPA/Hibernate

PostgreSQL ou MySQL

Spring Security

🚀 Installation et Démarrage
Prérequis
Node.js (v16 ou +)

npm ou yarn

Java 17+

Maven ou Gradle

Installation Frontend
bash
Copier le code
# Cloner le repository
git clone [URL_DU_REPO]

cd frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm start
Installation Backend
bash
Copier le code
cd backend

# Démarrer le serveur Spring Boot
./mvnw spring-boot:run
👉 L’application sera accessible sur http://localhost:3000

📁 Structure du Projet
Frontend
bash
Copier le code
src/
├── components/
│   ├── affectations/   # Composants pour la gestion des affectations
│   ├── auth/           # Authentification
│   ├── common/         # Composants réutilisables
│   ├── layout/         # Layouts principaux
│   └── profile/        # Profil utilisateur
├── context/            # Contexts React (Auth, etc.)
├── hooks/              # Hooks personnalisés
├── pages/              # Pages principales
├── services/           # Services API
├── styles/             # Styles CSS
└── utils/              # Helpers/utilitaires
Backend
bash
Copier le code
src/
├── main/java/.../controller   # Contrôleurs REST
├── main/java/.../model        # Entités JPA
├── main/java/.../repository   # Repositories JPA
├── main/java/.../service      # Services métiers
├── main/java/.../config       # Sécurité et config
└── resources/                 # application.properties
🎨 Interfaces Utilisateur
Vue Calendrier
Création rapide par glisser-déposer

Conflits visibles en temps réel

Navigation intuitive

Vue Emploi du Temps
Tableau avec échelle horaire verticale

Groupement par blocs et étages

Créneaux occupés et disponibles

Gestion des Salles
CRUD complet

Filtres dynamiques

Organisation par catégories

🔧 Fonctionnalités Techniques
Synchronisation en temps réel après chaque modification

Validation des données côté client et serveur

Détection des conflits horaires

Gestion des permissions utilisateurs

Interface responsive (PC, tablette, mobile)

📊 Fonctionnalités Avancées
Algorithme de recommandation intelligent

Workflow de validation/admin

Notifications automatiques (mails ou intégration API calendrier)

Export des données (PDF, Excel)

API publique (prévue pour évolutions futures)

🐛 Débogage et Maintenance
Logs backend détaillés

Gestion des erreurs front + notifications (Snackbar/Toast)

Tests unitaires et intégration (Spring, React Testing Library)

Pipeline CI/CD possible (GitHub Actions)

📈 Évolutions Futures
Notifications push en temps réel

Intégration Google Calendar / Outlook

Support multi-langues

Optimisations performance et accessibilité

🤝 Contribution
Fork du repo

Crée une branche feature/...

Développe et teste

Pull request avec description claire

Revue et merge

💡 Développé avec ❤️ pour simplifier et moderniser la gestion des salles d’enseignement.

