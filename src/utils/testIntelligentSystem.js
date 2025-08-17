// Test du système de recommandations INTELLIGENTES avec données RÉELLES
const testIntelligentSystemWithRealData = async () => {
  try {
    console.log("🧠 Test du système INTELLIGENT avec données RÉELLES...");
    console.log("==================================================================");
    
    // Test avec des données réalistes
    const testRequest = {
      date: "2024-01-15",
      heureDebut: "09:00",
      heureFin: "11:00",
      typeActivite: "Cours magistral",
      capaciteRequise: 25,
      descriptionActivite: "Cours de mathématiques avancées avec projecteur",
      blocPrefere: "Bloc A",
      etagePrefere: "2ème étage",
      typeSallePrefere: "Salle de cours"
    };

    console.log("📋 Demande de test:", testRequest);
    
    // Utiliser le service intelligent directement
    const intelligentDataService = await import('../services/intelligentDataService.js');
    const result = await intelligentDataService.default.generateIntelligentRecommendations(testRequest);
    
    console.log("✅ Recommandations INTELLIGENTES avec données RÉELLES:", result);
    
    // Afficher les résultats détaillés
    if (result.recommendations && result.recommendations.length > 0) {
      console.log("\n🏆 Salle optimale:", result.recommendations[0]);
      console.log("🧠 Raisonnement IA:", result.aiReasoning);
      console.log("🎯 Stratégie optimale:", result.optimalStrategy);
      
      if (result.capacityAnalysis) {
        console.log("📊 Analyse de capacité:", result.capacityAnalysis);
      }
      
      if (result.locationAnalysis) {
        console.log("📍 Analyse de localisation:", result.locationAnalysis);
      }
      
      if (result.timingAnalysis) {
        console.log("⏰ Analyse de timing:", result.timingAnalysis);
      }
      
      if (result.hasConflicts) {
        console.log("⚠️ Conflits détectés:", result.conflictResolution);
      }
      
      if (result.alternativeTimeSlots && result.alternativeTimeSlots.length > 0) {
        console.log("🕐 Créneaux alternatifs:", result.alternativeTimeSlots);
      }
      
      // Analyser chaque recommandation
      console.log("\n📋 Détail des recommandations:");
      result.recommendations.forEach((rec, index) => {
        console.log(`\n🎯 Recommandation ${index + 1}:`);
        console.log(`   - Salle: ${rec.nom} (ID: ${rec.id})`);
        console.log(`   - Score: ${rec.score}/100`);
        console.log(`   - Capacité: ${rec.capacite} personnes`);
        console.log(`   - Bloc: ${rec.blocNom}, Étage: ${rec.etageNumero}`);
        console.log(`   - Type: ${rec.type}`);
        console.log(`   - Localisation: ${rec.localisation}`);
        console.log(`   - Disponibilité: ${rec.availability?.availabilityStatus || 'N/A'}`);
        
        if (rec.isOptimal) {
          console.log(`   🏆 OPTIMAL: ${rec.whyOptimal}`);
        }
        
        if (rec.advantages && rec.advantages.length > 0) {
          console.log(`   ✅ Avantages: ${rec.advantages.join(', ')}`);
        }
        
        if (rec.considerations && rec.considerations.length > 0) {
          console.log(`   ⚠️ Considérations: ${rec.considerations.join(', ')}`);
        }

        if (rec.breakdown) {
          console.log(`   📊 Scores détaillés:`);
          console.log(`      - Capacité: ${rec.breakdown.capacity}/100`);
          console.log(`      - Localisation: ${rec.breakdown.location}/100`);
          console.log(`      - Disponibilité: ${rec.breakdown.availability}/100`);
          console.log(`      - Type: ${rec.breakdown.type}/100`);
        }
      });
    } else {
      console.log("❌ Aucune recommandation trouvée");
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
};

// Test avec des données différentes pour voir l'analyse intelligente
const testDifferentScenarios = async () => {
  console.log("\n🎭 Test de différents scénarios...");
  console.log("=====================================");
  
  const scenarios = [
    {
      name: "Cours de TP",
      data: {
        typeActivite: "TP Informatique",
        capaciteRequise: 15,
        blocPrefere: "Bloc B",
        typeSallePrefere: "Laboratoire"
      }
    },
    {
      name: "Réunion équipe",
      data: {
        typeActivite: "Réunion équipe",
        capaciteRequise: 8,
        blocPrefere: "Bloc A",
        typeSallePrefere: "Salle de réunion"
      }
    },
    {
      name: "Cours magistral",
      data: {
        typeActivite: "Cours magistral",
        capaciteRequise: 50,
        blocPrefere: "Bloc C",
        typeSallePrefere: "Amphithéâtre"
      }
    }
  ];

  for (const scenario of scenarios) {
    await testScenario(scenario.name, scenario.data);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre les tests
  }
};

const testScenario = async (scenarioName, scenarioData) => {
  try {
    console.log(`\n🎯 Test du scénario: ${scenarioName}`);
    console.log(`   - Capacité: ${scenarioData.capaciteRequise} personnes`);
    console.log(`   - Bloc préféré: ${scenarioData.blocPrefere}`);
    console.log(`   - Type préféré: ${scenarioData.typeSallePrefere}`);
    
    const intelligentDataService = await import('../services/intelligentDataService.js');
    const result = await intelligentDataService.default.generateIntelligentRecommendations({
      date: "2024-01-15",
      heureDebut: "14:00",
      heureFin: "16:00",
      capaciteRequise: scenarioData.capaciteRequise,
      typeActivite: scenarioData.typeActivite,
      blocPrefere: scenarioData.blocPrefere,
      typeSallePrefere: scenarioData.typeSallePrefere,
      flexibleHoraire: true,
      margeHoraire: 30
    });
    
    console.log(`   ✅ Salles recommandées: ${result.recommendations ? result.recommendations.length : 0}`);
    
    if (result.recommendations && result.recommendations.length > 0) {
      const bestRoom = result.recommendations[0];
      console.log(`   🏆 Meilleure salle: ${bestRoom.nom} (Score: ${bestRoom.score}/100)`);
      console.log(`   📍 Localisation: ${bestRoom.blocNom} - ${bestRoom.etageNumero}`);
      console.log(`   🧠 Raisonnement: ${result.aiReasoning?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur pour le scénario ${scenarioName}:`, error);
  }
};

// Test de performance et de cache
const testPerformanceAndCache = async () => {
  console.log("\n⚡ Test de performance et de cache...");
  console.log("=====================================");
  
  try {
    const intelligentDataService = await import('../services/intelligentDataService.js');
    
    // Premier appel (sans cache)
    console.log("🔄 Premier appel (sans cache)...");
    const startTime1 = performance.now();
    const result1 = await intelligentDataService.default.generateIntelligentRecommendations({
      date: "2024-01-15",
      heureDebut: "09:00",
      heureFin: "11:00",
      typeActivite: "Cours",
      capaciteRequise: 20
    });
    const endTime1 = performance.now();
    console.log(`   ⏱️ Temps: ${(endTime1 - startTime1).toFixed(2)}ms`);
    
    // Deuxième appel (avec cache)
    console.log("📊 Deuxième appel (avec cache)...");
    const startTime2 = performance.now();
    const result2 = await intelligentDataService.default.generateIntelligentRecommendations({
      date: "2024-01-15",
      heureDebut: "09:00",
      heureFin: "11:00",
      typeActivite: "Cours",
      capaciteRequise: 20
    });
    const endTime2 = performance.now();
    console.log(`   ⏱️ Temps: ${(endTime2 - startTime2).toFixed(2)}ms`);
    
    // Comparaison
    const speedup = ((endTime1 - startTime1) / (endTime2 - startTime2)).toFixed(2);
    console.log(`   🚀 Accélération avec cache: ${speedup}x`);
    
  } catch (error) {
    console.error("❌ Erreur lors du test de performance:", error);
  }
};

// Test de gestion des erreurs
const testErrorHandling = async () => {
  console.log("\n🚨 Test de gestion des erreurs...");
  console.log("==================================");
  
  try {
    const intelligentDataService = await import('../services/intelligentDataService.js');
    
    // Test avec des données invalides
    console.log("🧪 Test avec données invalides...");
    try {
      await intelligentDataService.default.generateIntelligentRecommendations({
        date: "date-invalide",
        heureDebut: "heure-invalide",
        heureFin: "heure-invalide",
        capaciteRequise: "pas-un-nombre"
      });
    } catch (error) {
      console.log("   ✅ Erreur correctement gérée:", error.message);
    }
    
    // Test avec des données manquantes
    console.log("🧪 Test avec données manquantes...");
    try {
      await intelligentDataService.default.generateIntelligentRecommendations({});
    } catch (error) {
      console.log("   ✅ Erreur correctement gérée:", error.message);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du test de gestion d'erreurs:", error);
  }
};

// Fonction principale pour exécuter tous les tests
const runAllIntelligentTests = async () => {
  console.log("🧠 SYSTÈME DE RECOMMANDATIONS INTELLIGENTES AVEC DONNÉES RÉELLES");
  console.log("==================================================================");
  console.log("🚀 Démarrage des tests intelligents...");
  
  try {
    // Test principal
    await testIntelligentSystemWithRealData();
    
    // Attendre un peu puis tester les scénarios
    setTimeout(async () => {
      await testDifferentScenarios();
      
      // Attendre un peu puis tester la performance
      setTimeout(async () => {
        await testPerformanceAndCache();
        
        // Attendre un peu puis tester la gestion d'erreurs
        setTimeout(async () => {
          await testErrorHandling();
          console.log("\n🎉 Tous les tests intelligents sont terminés !");
        }, 1000);
      }, 1000);
    }, 2000);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution des tests:", error);
  }
};

// Rendre les fonctions disponibles globalement
window.testIntelligentSystem = testIntelligentSystemWithRealData;
window.testDifferentScenarios = testDifferentScenarios;
window.testPerformanceAndCache = testPerformanceAndCache;
window.testErrorHandling = testErrorHandling;
window.runAllIntelligentTests = runAllIntelligentTests;

// Message de confirmation
console.log("🧠 Système de test intelligent chargé !");
console.log("📋 Fonctions disponibles:");
console.log("   - testIntelligentSystem() : Test principal");
console.log("   - testDifferentScenarios() : Test de différents scénarios");
console.log("   - testPerformanceAndCache() : Test de performance");
console.log("   - testErrorHandling() : Test de gestion d'erreurs");
console.log("   - runAllIntelligentTests() : Tous les tests");
console.log("\n🚀 Utilisez runAllIntelligentTests() pour lancer tous les tests !");
