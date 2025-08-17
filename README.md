# 🏢 Système de Gestion d'Affectation des Salles

## 📋 Description du Projet

Un système complet pour planifier, gérer et visualiser les affectations de salles dans un établissement éducatif.
L’application offre une interface intuitive qui permet aux utilisateurs de :

-Réserver une salle pour un cours, un événement ou une réunion
-Visualiser les créneaux disponibles et occupés
-Éviter les conflits grâce à une détection automatique
-Obtenir des recommandations intelligentes pour choisir la meilleure salle


## ✨ Fonctionnalités Principales

### 🎯 **Gestion des Affectations**
- **Création d'affectations** : Interface intuitive pour créer des réservations de salles
- **Visualisation calendrier** : Vue calendrier interactive avec drag & drop
- **Emploi du temps** : Vue tableau avec échelle horaire verticale (8h-20h)
- **Synchronisation automatique** : Mise à jour en temps réel des affectations
- **Validation intelligente** : Détection automatique des conflits horaires

### 🏗️ **Gestion des Salles**
- **Hiérarchie complète** : Blocs → Étages → Salles
- **Filtres avancés** : Recherche par bloc, étage, type de salle
- **Gestion CRUD** : Création, modification, suppression des salles
- **Vues multiples** : Par bloc, par type, vue générale

### 🤖 **Système de Recommandations IA**
- **Recommandations intelligentes** : Suggestions automatiques de salles disponibles
- **Critères multiples** : Capacité, type d'activité, proximité
- **Intégration fluide** : Création directe d'affectation depuis les recommandations

### 👥 **Gestion des Utilisateurs**
- **Système d'authentification** : Connexion sécurisée
- **Rôles utilisateurs** : Admin et utilisateur standard
- **Workflow d'approbation** : Validation des affectations par les administrateurs

## 🛠️ Technologies Utilisées

### **Frontend**
- **React 18** : Framework principal
- **Material-UI (MUI)** : Composants UI modernes
- **React Router** : Navigation entre pages
- **Axios** : Gestion des requêtes HTTP
- **Context API** : Gestion d'état globale

### **Backend (API REST)**
- **Spring Boot** : Framework backend
- **JPA/Hibernate** : Persistance des données
- **MySQL/PostgreSQL** : Base de données
- **Spring Security** : Authentification et autorisation

## 🚀 Installation et Démarrage

### **Prérequis**
- Node.js (v16 ou supérieur)
- npm ou yarn
- Backend Spring Boot démarré

### **Installation Frontend**
```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

### **Configuration Backend**
```bash
# Démarrer le serveur Spring Boot
./mvnw spring-boot:run
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
Frontend

src/
├── components/
│   ├── affectations/          # Composants de gestion des affectations
│   ├── auth/                  # Composants d'authentification
│   ├── common/                # Composants réutilisables
│   ├── layout/                # Composants de mise en page
│   └── profile/               # Composants de profil utilisateur
├── context/                   # Contextes React (Auth, etc.)
├── hooks/                     # Hooks personnalisés
├── pages/                     # Pages principales de l'application
├── services/                  # Services API
├── styles/                    # Styles CSS
└── utils/                     # Utilitaires et helpers
```
Backend

src/main/java/affectationsDesSalles/affectationDesSalles/
├── config/
│   └── SecurityConfig.java              # Spring Security configuration
├── controller/
│   ├── AuthController.java              # Authentication endpoints
│   ├── UserController.java              # User CRUD endpoints
│   ├── SalleController.java             # Room CRUD endpoints
│   ├── AffectationController.java       # Assignment CRUD endpoints
│   └── SmartRecommendationController.java # AI recommendations
├── dto/
│   ├── AuthResponse.java                # Authentication response DTO
│   ├── LoginRequest.java                # Login request DTO
│   ├── SignupRequest.java               # Signup request DTO
│   ├── SmartRecommendationRequest.java  # AI recommendation request
│   └── SmartRecommendationResponse.java # AI recommendation response
├── model/
│   ├── User.java                        # User entity
│   ├── Salle.java                       # Room entity
│   ├── Affectation.java                 # Assignment entity
│   ├── Bloc.java                        # Building entity
│   └── Etage.java                       # Floor entity
├── repository/
│   ├── UserRepository.java              # User data access
│   ├── SalleRepository.java             # Room data access
│   └── AffectationRepository.java       # Assignment data access
├── security/
│   ├── JwtAuthenticationFilter.java     # JWT authentication filter
│   └── JwtUtil.java                     # JWT utility functions
└── service/
    ├── AuthService.java                 # Authentication service
    ├── UserService.java                 # User service
    ├── SalleService.java                # Room service
    ├── AffectationService.java          # Assignment service
    ├── GeminiApiService.java            # AI service interface
    └── GeminiApiServiceImpl.java        # AI service implementation
```
## 🎨 Interface Utilisateur

### **Vue Calendrier**
- Interface calendrier interactive
- Création d'affectations par glisser-déposer
- Affichage des conflits en temps réel
- Navigation temporelle intuitive

### **Vue Emploi du Temps**
- Tableau avec échelle horaire verticale
- Groupement par blocs et étages
- Création d'affectations par clic
- Interface responsive et professionnelle

### **Gestion des Salles**
- Interface de gestion complète
- Filtres et recherche avancés
- Création/modification/suppression
- Vues organisées par catégories

## 🔧 Fonctionnalités Techniques

### **Synchronisation des Données**
- Rechargement automatique après création
- Gestion d'état optimisée
- Cache intelligent des données
- Gestion des erreurs robuste

### **Validation et Sécurité**
- Validation côté client et serveur
- Détection des conflits horaires
- Gestion des permissions utilisateur
- Protection contre les actions non autorisées

### **Performance**
- Chargement optimisé des données
- Composants React optimisés
- Gestion efficace de la mémoire
- Interface responsive

## 📊 Fonctionnalités Avancées

### **Système de Recommandations**
- Algorithme de recommandation intelligent
- Prise en compte de multiples critères
- Interface utilisateur intuitive
- Intégration transparente

### **Workflow d'Approval**
- Processus de validation en plusieurs étapes
- Notifications automatiques
- Historique des modifications
- Gestion des permissions

### **Interface Responsive**
- Adaptation mobile et tablette
- Navigation optimisée
- Composants adaptatifs
- Expérience utilisateur cohérente

## 🐛 Débogage et Maintenance

### **Logs et Monitoring**
- Logs détaillés pour le débogage
- Gestion des erreurs centralisée
- Monitoring des performances
- Outils de développement intégrés

### **Tests**
- Tests unitaires pour les composants
- Tests d'intégration pour les services
- Tests end-to-end pour les workflows
- Validation continue

## 📈 Évolutions Futures

### **Fonctionnalités Planifiées**
- Notifications push en temps réel
- Export des données (PDF, Excel)
- Intégration avec d'autres systèmes
- API publique pour développeurs

### **Améliorations Techniques**
- Optimisation des performances
- Amélioration de l'accessibilité
- Support multi-langues

## 🤝 Contribution

### **Guidelines de Développement**
- Code propre et documenté
- Tests pour toutes les nouvelles fonctionnalités
- Respect des conventions de nommage
- Revue de code obligatoire

### **Processus de Développement**
1. Fork du repository
2. Création d'une branche feature
3. Développement et tests
4. Pull Request avec description détaillée
5. Revue et merge

---

**Développé avec ❤️ pour simplifier la gestion des salles d'enseignement**
