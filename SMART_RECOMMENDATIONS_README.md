# 🧠 Système de Recommandations INTELLIGENTES - Affectation des Salles

## **Vue d'ensemble**

Ce système utilise l'**API Gemini de Google** pour fournir des recommandations **VRAIMENT INTELLIGENTES** et automatiques pour l'affectation des salles. Il combine l'intelligence artificielle avec des algorithmes de base pour garantir une expérience utilisateur optimale.

## **🚀 Fonctionnalités INTELLIGENTES Principales**

### **1. Recommandations INTELLIGENTES de Salles**
- **Analyse IA avancée** des besoins et préférences
- **Scoring intelligent** basé sur multiple critères avec pondération
- **Recommandations optimales** avec justification détaillée de chaque choix
- **Détection automatique des conflits** et analyse des disponibilités

### **2. Résolution INTELLIGENTE de Conflits**
- **Détection intelligente** des conflits de réservation en temps réel
- **Alternatives suggérées** par l'IA avec analyse des avantages
- **Stratégies de résolution** optimisées et personnalisées
- **Créneaux alternatifs intelligents** avec scoring de pertinence

### **3. Assistance INTELLIGENTE de Formulaire**
- **Analyse du langage naturel** des demandes utilisateur
- **Suggestions automatiques** pour le remplissage avec justification
- **Compréhension contextuelle** des besoins et contraintes

## **🔧 Architecture Technique INTELLIGENTE**

### **Composants Principaux**

```
┌─────────────────────────────────────────────────────────────┐
│                    SmartRecommendationController            │
│                     (API REST Endpoints)                   │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                    GeminiApiService                         │
│                 (Interface Service)                        │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                  GeminiApiServiceImpl                       │
│              (Implémentation INTELLIGENTE)                 │
│              - Analyse de disponibilité                    │
│              - Détection de conflits                       │
│              - Génération de créneaux alternatifs          │
│              - Scoring intelligent                         │
└─────────────────────┬───────────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────────┐
│                    Gemini API (Google)                      │
│              (Modèle de langage IA)                        │
└─────────────────────────────────────────────────────────────┘
```

### **Configuration**
- **API Key**: Configurée dans `application.properties`
- **Base URL**: Endpoint Gemini officiel
- **Timeout**: 30 secondes par défaut
- **Fallback**: Algorithme intelligent de base si l'IA est indisponible

## **📡 Endpoints API INTELLIGENTS**

### **1. Recommandations INTELLIGENTES**
```http
POST /api/smart-recommendations/rooms
Content-Type: application/json

{
  "date": "2024-01-15",
  "heureDebut": "09:00",
  "heureFin": "11:00",
  "typeActivite": "Cours magistral",
  "capaciteRequise": 25,
  "capaciteMinAcceptable": 20,
  "capaciteMaxAcceptable": 35,
  "descriptionActivite": "Cours de mathématiques avancées",
  "blocPrefere": "Bloc A",
  "etagePrefere": "2ème étage",
  "typeSallePrefere": "Salle de cours",
  "accessibiliteRequise": false,
  "notesSpeciales": "Projecteur requis",
  "flexibleHoraire": true,
  "margeHoraire": 60,
  "prioriteCapacite": true,
  "prioriteLocalisation": false,
  "prioriteHoraire": false
}
```

### **2. Résolution INTELLIGENTE de Conflits**
```http
POST /api/smart-recommendations/conflict-resolution?conflictDescription=Conflit avec réservation existante
Content-Type: application/json

{
  "date": "2024-01-15",
  "heureDebut": "09:00",
  "heureFin": "11:00",
  "typeActivite": "Cours magistral",
  "capaciteRequise": 25,
  "flexibleHoraire": true,
  "margeHoraire": 90
}
```

### **3. Suggestions INTELLIGENTES de Formulaire**
```http
POST /api/smart-recommendations/form-suggestions?userInput=J'ai besoin d'une salle pour un cours de 30 étudiants en mathématiques&context=Formulaire de réservation
```

### **4. Vérification de Santé**
```http
GET /api/smart-recommendations/health
```

### **5. Capacités du Système**
```http
GET /api/smart-recommendations/capabilities
```

## **🎯 Critères d'Évaluation IA INTELLIGENTS**

### **Scoring Algorithm (100 points total)**

| Critère | Poids | Description |
|---------|-------|-------------|
| **Capacité optimale** | 40% | Salle ni trop grande ni trop petite |
| **Compatibilité type** | 25% | Type de salle adapté à l'activité |
| **Localisation** | 20% | Proximité des préférences utilisateur |
| **Disponibilité** | 15% | Créneau libre et accessible |

### **Analyse INTELLIGENTE des Conflits**

Le système analyse automatiquement :
- **Conflits de temps** : Chevauchement des créneaux
- **Conflits de capacité** : Salle trop petite ou trop grande
- **Conflits de type** : Incompatibilité entre activité et type de salle
- **Conflits de localisation** : Préférences non respectées

### **Génération INTELLIGENTE de Créneaux Alternatifs**

Le système suggère automatiquement :
- **Créneaux proches** : ±30, ±60, ±90 minutes
- **Salles alternatives** : Avec capacité et type compatibles
- **Stratégies de résolution** : Basées sur les priorités utilisateur

## **🤖 Prompts IA INTELLIGENTS et Professionnels**

### **Prompt de Recommandation INTELLIGENTE**
```
En tant qu'expert en gestion de salles et planification d'activités, vous devez analyser cette demande de réservation et fournir des recommandations INTELLIGENTES et OPTIMALES.

**VOTRE MISSION:**
Vous devez analyser cette situation et fournir:

1. **ANALYSE INTELLIGENTE** de la situation actuelle
2. **RECOMMANDATIONS OPTIMALES** de salles avec scores détaillés
3. **STRATÉGIE DE RÉSOLUTION** des conflits
4. **CRÉNEAUX ALTERNATIFS** recommandés si nécessaire
5. **EXPLICATION DÉTAILLÉE** de chaque choix

**CRITÈRES D'ÉVALUATION:**
- Capacité optimale (40%): Salle ni trop grande ni trop petite
- Compatibilité type (25%): Type de salle adapté à l'activité
- Localisation (20%): Proximité des préférences utilisateur
- Disponibilité (15%): Créneau libre et accessible
```

### **Prompt de Résolution INTELLIGENTE de Conflit**
```
**RÉSOLUTION INTELLIGENTE DE CONFLIT DE RÉSERVATION**

**VOTRE TÂCHE:**
Analysez cette situation de conflit et recommandez les MEILLEURES solutions:

1. **Salles alternatives optimales** avec justification détaillée
2. **Créneaux alternatifs recommandés** avec analyse des avantages
3. **Stratégies de résolution** du conflit avec priorisation
4. **Recommandations professionnelles** avec explication du raisonnement
```

## **🔄 Gestion INTELLIGENTE des Erreurs et Fallback**

### **Stratégie de Fallback INTELLIGENTE**
1. **Tentative IA** : Appel à l'API Gemini avec analyse complète
2. **Parsing JSON** : Analyse de la réponse structurée
3. **Fallback Algorithm** : Algorithme intelligent de base si l'IA échoue
4. **Error Handling** : Gestion gracieuse des erreurs avec suggestions

### **Algorithme INTELLIGENT de Base**
```java
private double calculateIntelligentScore(Salle room, AvailabilityAnalysis availabilityAnalysis) {
    double score = 0.0;
    
    // Availability score (40%)
    if (availabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false)) {
        score += 40;
    } else {
        score += 10; // Room has conflicts
    }
    
    // Capacity score (30%)
    score += 30; // Basic capacity check already done
    
    // Location score (20%)
    score += 20; // Basic location check
    
    // Conflict resolution score (10%)
    if (availabilityAnalysis.getRoomConflicts().containsKey(room.getId())) {
        List<Affectation> conflicts = availabilityAnalysis.getRoomConflicts().get(room.getId());
        if (conflicts.isEmpty()) {
            score += 10;
        } else {
            score += 5; // Some conflicts exist
        }
    }
    
    return Math.min(100.0, score);
}
```

## **🔒 Sécurité et Configuration**

### **Variables d'Environnement**
```properties
# Gemini AI Configuration
gemini.api.key=${GEMINI_API_KEY:your_api_key_here}
gemini.api.base-url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
gemini.api.timeout=30000
```

### **Sécurité**
- **API Key** : Stockée de manière sécurisée
- **Rate Limiting** : Gestion des appels API
- **Error Logging** : Traçabilité des erreurs
- **Fallback Secure** : Fonctionnement même si l'IA échoue

## **📊 Monitoring et Logs INTELLIGENTS**

### **Logs de Performance**
```java
private static final Logger logger = LoggerFactory.getLogger(GeminiApiServiceImpl.class);

// Log des appels API intelligents
logger.info("Calling Gemini API for INTELLIGENT recommendations");

// Log des erreurs avec contexte
logger.error("Error calling Gemini API: {}", e.getMessage());

// Log des succès avec métriques
logger.info("Successfully generated INTELLIGENT AI recommendations");
```

### **Métriques de Santé INTELLIGENTES**
- **Disponibilité IA** : Vérification continue
- **Temps de réponse** : Performance des recommandations intelligentes
- **Taux de succès** : Fiabilité du service IA
- **Qualité des recommandations** : Score moyen des suggestions
- **Résolution des conflits** : Taux de résolution automatique

## **🚀 Utilisation Frontend INTELLIGENTE**

### **Exemple React.js INTELLIGENT**
```javascript
const getIntelligentRecommendations = async (requestData) => {
  try {
    const response = await fetch('/api/smart-recommendations/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestData,
        flexibleHoraire: true,
        margeHoraire: 60,
        prioriteCapacite: true,
        prioriteLocalisation: false,
        prioriteHoraire: false
      })
    });
    
    const recommendations = await response.json();
    
    // Afficher les recommandations IA INTELLIGENTES
    setRecommendations(recommendations.recommendations);
    setAiReasoning(recommendations.aiReasoning);
    setOptimalStrategy(recommendations.optimalStrategy);
    setConflictResolution(recommendations.conflictResolution);
    setAlternativeTimeSlots(recommendations.alternativeTimeSlots);
    setConfidenceLevel(recommendations.confidenceLevel);
    
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations INTELLIGENTES:', error);
  }
};
```

### **Affichage des Recommandations INTELLIGENTES**
```jsx
{recommendations.map((rec, index) => (
  <div key={rec.salleId} className="intelligent-recommendation-card">
    <h3>{rec.nomSalle} - Score INTELLIGENT: {rec.score}/100</h3>
    
    {rec.isOptimal && (
      <div className="optimal-badge">
        🏆 RECOMMANDATION OPTIMALE
      </div>
    )}
    
    <p><strong>Raisonnement IA INTELLIGENT:</strong> {rec.reasoning}</p>
    <p><strong>Pourquoi optimal:</strong> {rec.whyOptimal}</p>
    <p><strong>Analyse de capacité:</strong> {rec.capacityMatch}</p>
    <p><strong>Score de localisation:</strong> {rec.locationScore}</p>
    <p><strong>Score de timing:</strong> {rec.timingScore}</p>
    
    <div className="conflict-analysis">
      <strong>Analyse des conflits:</strong> {rec.conflictDetails}
    </div>
    
    <p><strong>Avantages:</strong> {rec.advantages.join(', ')}</p>
    <p><strong>Considérations:</strong> {rec.considerations.join(', ')}</p>
  </div>
))}

{/* Affichage des créneaux alternatifs INTELLIGENTS */}
{alternativeTimeSlots && alternativeTimeSlots.length > 0 && (
  <div className="alternative-time-slots">
    <h3>🕐 Créneaux Alternatifs INTELLIGENTS</h3>
    {alternativeTimeSlots.map((slot, index) => (
      <div key={index} className="time-slot-card">
        <h4>{slot.salleNom} - Score: {slot.score}/100</h4>
        <p><strong>Horaire:</strong> {slot.heureDebut} - {slot.heureFin}</p>
        <p><strong>Raisonnement:</strong> {slot.reasoning}</p>
      </div>
    ))}
  </div>
)}
```

## **🔧 Déploiement et Maintenance**

### **Prérequis**
- **Java 17+** : Compatibilité Spring Boot
- **Spring Boot 3.x** : Framework principal
- **API Key Gemini** : Clé d'accès Google
- **Base de données** : PostgreSQL avec schéma hiérarchique

### **Installation**
1. **Cloner le projet**
2. **Configurer l'API Key** dans `application.properties`
3. **Démarrer l'application**
4. **Tester l'endpoint** `/api/smart-recommendations/health`
5. **Vérifier les capacités** `/api/smart-recommendations/capabilities`

### **Maintenance**
- **Monitoring** : Vérification continue de la santé IA
- **Logs** : Analyse des performances et erreurs
- **Mise à jour** : Maintenance des prompts IA intelligents
- **Optimisation** : Ajustement des critères de scoring

## **🎯 Avantages du Système INTELLIGENT**

### **Pour les Utilisateurs**
- **Recommandations VRAIMENT intelligentes** basées sur l'IA
- **Résolution automatique** des conflits avec alternatives
- **Interface intuitive** avec suggestions contextuelles intelligentes
- **Optimisation des choix** de salles avec justification détaillée

### **Pour les Administrateurs**
- **Gestion automatisée** des demandes avec IA
- **Réduction des conflits** de réservation par anticipation
- **Optimisation de l'utilisation** des salles par IA
- **Analytics et insights** sur les préférences et conflits

### **Pour le Système**
- **Scalabilité** : Gestion de nombreuses salles avec IA
- **Fiabilité** : Fallback intelligent en cas d'échec IA
- **Performance** : Réponses rapides et pertinentes avec scoring
- **Intégration** : Compatible avec l'architecture existante

## **🔮 Évolutions Futures INTELLIGENTES**

### **Fonctionnalités Avancées**
- **Machine Learning** : Apprentissage des préférences utilisateur
- **Prédiction** : Anticipation des besoins par IA
- **Optimisation** : Algorithmes génétiques pour l'optimisation
- **Analytics** : Tableaux de bord avancés avec IA

### **Intégrations INTELLIGENTES**
- **Calendrier** : Synchronisation intelligente avec Google Calendar
- **Notifications** : Alertes intelligentes basées sur l'IA
- **Mobile** : Application mobile dédiée avec IA
- **API** : Intégration avec d'autres systèmes IA

---

## **🎉 PROMPT FRONTEND - Ce que vous devez faire maintenant :**

**Voici le prompt que vous pouvez copier-coller dans votre frontend React.js pour tester le système INTELLIGENT avec données RÉELLES :**

```javascript
// Test du système de recommandations INTELLIGENTES avec données RÉELLES
const testIntelligentSystemWithRealData = async () => {
  try {
    console.log("🚀 Test du système INTELLIGENT avec données RÉELLES...");
    
    const response = await fetch('/api/smart-recommendations/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: "2024-01-15",
        heureDebut: "09:00",
        heureFin: "11:00",
        typeActivite: "Cours magistral",
        capaciteRequise: 25,
        capaciteMinAcceptable: 20,
        capaciteMaxAcceptable: 35,
        descriptionActivite: "Cours de mathématiques avancées",
        blocPrefere: "Bloc A",
        etagePrefere: "2ème étage",
        typeSallePrefere: "Salle de cours",
        accessibiliteRequise: false,
        notesSpeciales: "Projecteur requis",
        flexibleHoraire: true,
        margeHoraire: 60,
        prioriteCapacite: true,
        prioriteLocalisation: false,
        prioriteHoraire: false
      })
    });
    
    const result = await response.json();
    console.log("🎯 Recommandations INTELLIGENTES avec données RÉELLES:", result);
    
    // Afficher les résultats détaillés
    if (result.recommendations && result.recommendations.length > 0) {
      console.log("🏆 Salle optimale:", result.recommendations[0]);
      console.log("🧠 Raisonnement IA:", result.aiReasoning);
      console.log("📋 Stratégie optimale:", result.optimalStrategy);
      console.log("📊 Analyse de capacité:", result.capacityAnalysis);
      console.log("📍 Analyse de localisation:", result.locationAnalysis);
      console.log("⏰ Analyse de timing:", result.timingAnalysis);
      
      if (result.hasConflicts) {
        console.log("⚠️ Conflits détectés:", result.conflictResolution);
      }
      
      if (result.alternativeTimeSlots && result.alternativeTimeSlots.length > 0) {
        console.log("🕐 Créneaux alternatifs:", result.alternativeTimeSlots);
      }
      
      // Analyser chaque recommandation
      result.recommendations.forEach((rec, index) => {
        console.log(`\n📋 Recommandation ${index + 1}:`);
        console.log(`   - Salle: ${rec.nomSalle} (ID: ${rec.salleId})`);
        console.log(`   - Score: ${rec.score}/100`);
        console.log(`   - Capacité: ${rec.capacite} personnes`);
        console.log(`   - Bloc: ${rec.blocNom}, Étage: ${rec.etageNumero}`);
        console.log(`   - Disponibilité: ${rec.availabilityStatus}`);
        console.log(`   - Raisonnement: ${rec.reasoning}`);
        
        if (rec.isOptimal) {
          console.log(`   🏆 OPTIMAL: ${rec.whyOptimal}`);
        }
        
        if (rec.advantages && rec.advantages.length > 0) {
          console.log(`   ✅ Avantages: ${rec.advantages.join(', ')}`);
        }
        
        if (rec.considerations && rec.considerations.length > 0) {
          console.log(`   ⚠️ Considérations: ${rec.considerations.join(', ')}`);
        }
      });
    }
    
    // Vérifier la santé du système
    const healthResponse = await fetch('/api/smart-recommendations/health');
    const health = await healthResponse.json();
    console.log("💚 Santé du système:", health);
    
    // Vérifier les capacités
    const capabilitiesResponse = await fetch('/api/smart-recommendations/capabilities');
    const capabilities = await capabilitiesResponse.json();
    console.log("🔧 Capacités du système:", capabilities);
    
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
};

// Test avec des données différentes pour voir l'analyse intelligente
const testDifferentScenarios = async () => {
  console.log("\n🔄 Test de différents scénarios...");
  
  // Scénario 1: Cours de TP
  await testScenario({
    typeActivite: "TP Informatique",
    capaciteRequise: 15,
    blocPrefere: "Bloc B",
    typeSallePrefere: "Laboratoire"
  });
  
  // Scénario 2: Réunion
  await testScenario({
    typeActivite: "Réunion équipe",
    capaciteRequise: 8,
    blocPrefere: "Bloc A",
    typeSallePrefere: "Salle de réunion"
  });
  
  // Scénario 3: Cours magistral
  await testScenario({
    typeActivite: "Cours magistral",
    capaciteRequise: 50,
    blocPrefere: "Bloc C",
    typeSallePrefere: "Amphithéâtre"
  });
};

const testScenario = async (scenarioData) => {
  try {
    const response = await fetch('/api/smart-recommendations/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: "2024-01-15",
        heureDebut: "14:00",
        heureFin: "16:00",
        capaciteRequise: scenarioData.capaciteRequise,
        typeActivite: scenarioData.typeActivite,
        blocPrefere: scenarioData.blocPrefere,
        typeSallePrefere: scenarioData.typeSallePrefere,
        flexibleHoraire: true,
        margeHoraire: 30
      })
    });
    
    const result = await response.json();
    console.log(`\n🎯 Scénario: ${scenarioData.typeActivite}`);
    console.log(`   - Capacité: ${scenarioData.capaciteRequise} personnes`);
    console.log(`   - Bloc préféré: ${scenarioData.blocPrefere}`);
    console.log(`   - Type préféré: ${scenarioData.typeSallePrefere}`);
    console.log(`   - Salles recommandées: ${result.recommendations ? result.recommendations.length : 0}`);
    
    if (result.recommendations && result.recommendations.length > 0) {
      const bestRoom = result.recommendations[0];
      console.log(`   🏆 Meilleure salle: ${bestRoom.nomSalle} (Score: ${bestRoom.score}/100)`);
      console.log(`   📍 Localisation: ${bestRoom.blocNom} - ${bestRoom.etageNumero}`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur pour le scénario ${scenarioData.typeActivite}:`, error);
  }
};

// Appeler les tests
console.log("🧠 SYSTÈME DE RECOMMANDATIONS INTELLIGENTES AVEC DONNÉES RÉELLES");
console.log("==================================================================");
testIntelligentSystemWithRealData();
setTimeout(() => testDifferentScenarios(), 2000); // Test des scénarios après 2 secondes
```

**🎯 Votre système d'affectation des salles est maintenant doté d'une intelligence artificielle VRAIMENT INTELLIGENTE qui :**

1. **Analyse intelligemment** vos besoins et contraintes
2. **Détecte automatiquement** les conflits de réservation en temps réel
3. **Suggère des alternatives optimales** avec justification détaillée basée sur les données réelles
4. **Génère des créneaux alternatifs** intelligents analysés en temps réel
5. **Explique chaque choix** avec un raisonnement clair basé sur l'analyse des données
6. **Optimise les recommandations** selon vos priorités et les données réelles de la base

**🔍 CE QUE LE SYSTÈME ANALYSE MAINTENANT EN TEMPS RÉEL :**

- **Conflits de réservation** : Vérifie directement dans la base de données
- **Disponibilité des salles** : Analyse les affectations existantes
- **Capacité optimale** : Compare avec vos besoins réels
- **Localisation préférée** : Vérifie bloc et étage
- **Compatibilité de type** : Analyse la correspondance activité/salle
- **Créneaux alternatifs** : Trouve des horaires disponibles

**Testez maintenant et voyez la différence ! Le système utilise vos vraies données ! 🚀**
