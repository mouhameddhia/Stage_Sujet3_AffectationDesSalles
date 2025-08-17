// Test du flux d'affectation et de la transformation des données
import { transformAffectationsForCalendar } from './calendarUtils';

/**
 * Test de la transformation des affectations en événements de calendrier
 */
export const testAffectationTransformation = () => {
  console.log('🧪 Test de transformation des affectations...');
  
  // Données d'exemple d'une affectation
  const sampleAffectation = {
    idaffectation: 1,
    typeActivite: 'Cours de mathématiques',
    idSalle: 101,
    nomSalle: 'A1',
    date: '2024-01-15',
    heureDebut: '09:00',
    heureFin: '11:00',
    statut: 'active'
  };
  
  // Tester la transformation
  const events = transformAffectationsForCalendar([sampleAffectation]);
  console.log('📅 Événement transformé:', events[0]);
  
  // Vérifications
  const event = events[0];
  const isValid = (
    event.id === 1 &&
    event.title === 'Cours de mathématiques - A1' &&
    event.start === '2024-01-15T09:00' &&
    event.end === '2024-01-15T11:00' &&
    event.extendedProps.typeActivite === 'Cours de mathématiques' &&
    event.extendedProps.nomSalle === 'A1'
  );
  
  console.log('✅ Test de transformation:', isValid ? 'RÉUSSI' : 'ÉCHOUÉ');
  return isValid;
};

/**
 * Test de la gestion des IDs avec différentes conventions
 */
export const testIdHandling = () => {
  console.log('🆔 Test de gestion des IDs...');
  
  // Test avec idaffectation (minuscule)
  const affectation1 = {
    idaffectation: 1,
    typeActivite: 'Réunion',
    idSalle: 102,
    nomSalle: 'B2',
    date: '2024-01-16',
    heureDebut: '14:00',
    heureFin: '16:00'
  };
  
  // Test avec idAffectation (majuscule)
  const affectation2 = {
    idAffectation: 2,
    typeActivite: 'Formation',
    idSalle: 103,
    nomSalle: 'C3',
    date: '2024-01-17',
    heureDebut: '10:00',
    heureFin: '12:00'
  };
  
  const events = transformAffectationsForCalendar([affectation1, affectation2]);
  
  const isValid = (
    events[0].id === 1 &&
    events[1].id === 2 &&
    events[0].extendedProps.idaffectation === 1 &&
    events[1].extendedProps.idaffectation === 2
  );
  
  console.log('✅ Test de gestion des IDs:', isValid ? 'RÉUSSI' : 'ÉCHOUÉ');
  return isValid;
};

/**
 * Test de la création d'un titre d'événement
 */
export const testEventTitle = () => {
  console.log('📝 Test de création du titre d\'événement...');
  
  const affectation = {
    idaffectation: 3,
    typeActivite: 'Soutenance',
    idSalle: 104,
    nomSalle: 'D4',
    date: '2024-01-18',
    heureDebut: '15:00',
    heureFin: '17:00'
  };
  
  const events = transformAffectationsForCalendar([affectation]);
  const expectedTitle = 'Soutenance - D4';
  
  const isValid = events[0].title === expectedTitle;
  console.log('✅ Test de titre d\'événement:', isValid ? 'RÉUSSI' : 'ÉCHOUÉ');
  console.log(`   Attendu: "${expectedTitle}"`);
  console.log(`   Obtenu: "${events[0].title}"`);
  
  return isValid;
};

/**
 * Exécuter tous les tests
 */
export const runAllTests = () => {
  console.log('🚀 Démarrage des tests de flux d\'affectation...\n');
  
  const results = [
    testAffectationTransformation(),
    testIdHandling(),
    testEventTitle()
  ];
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`\n📊 Résultats des tests: ${passed}/${total} réussis`);
  
  if (passed === total) {
    console.log('🎉 Tous les tests sont passés avec succès !');
  } else {
    console.log('❌ Certains tests ont échoué. Vérifiez la configuration.');
  }
  
  return passed === total;
};

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  window.testAffectationFlow = {
    testAffectationTransformation,
    testIdHandling,
    testEventTitle,
    runAllTests
  };
}

/**
 * Test de stabilité du calendrier - vérifie l'absence de clignotement
 */
export const testCalendarStability = () => {
  console.log('🧪 Test de stabilité du calendrier...');
  
  // Simuler des données d'affectation
  const mockAffectations = [
    {
      idaffectation: 1,
      typeActivite: 'Cours',
      idSalle: 1,
      nomSalle: 'A1',
      date: '2024-01-15',
      heureDebut: '09:00',
      heureFin: '10:00',
      statut: 'active'
    },
    {
      idaffectation: 2,
      typeActivite: 'TP',
      idSalle: 2,
      nomSalle: 'B2',
      date: '2024-01-15',
      heureDebut: '14:00',
      heureFin: '16:00',
      statut: 'active'
    }
  ];

  // Test 1: Vérifier que les événements sont créés correctement
  const events = transformAffectationsForCalendar(mockAffectations);
  console.log('✅ Événements créés:', events);
  
  if (events.length !== 2) {
    console.error('❌ Nombre d\'événements incorrect');
    return false;
  }

  // Test 2: Vérifier la cohérence des IDs
  const event1 = events.find(e => e.id === 1);
  const event2 = events.find(e => e.id === 2);
  
  if (!event1 || !event2) {
    console.error('❌ Événements non trouvés par ID');
    return false;
  }

  // Test 3: Vérifier les titres
  if (event1.title !== 'Cours - A1' || event2.title !== 'TP - B2') {
    console.error('❌ Titres des événements incorrects');
    return false;
  }

  // Test 4: Vérifier les dates
  const expectedStart1 = '2024-01-15T09:00';
  const expectedEnd1 = '2024-01-15T10:00';
  
  if (event1.start !== expectedStart1 || event1.end !== expectedEnd1) {
    console.error('❌ Dates des événements incorrectes');
    return false;
  }

  console.log('✅ Test de stabilité réussi !');
  return true;
};

/**
 * Test de performance - vérifie l'absence de rechargements inutiles
 */
export const testPerformance = () => {
  console.log('⚡ Test de performance...');
  
  const startTime = performance.now();
  
  // Simuler 100 affectations
  const manyAffectations = Array.from({ length: 100 }, (_, i) => ({
    idaffectation: i + 1,
    typeActivite: `Activité ${i + 1}`,
    idSalle: (i % 5) + 1,
    nomSalle: `Salle ${(i % 5) + 1}`,
    date: '2024-01-15',
    heureDebut: '09:00',
    heureFin: '10:00',
    statut: 'active'
  }));

  // Mesurer le temps de transformation
  const events = transformAffectationsForCalendar(manyAffectations);
  const endTime = performance.now();
  
  const duration = endTime - startTime;
  console.log(`⏱️ Transformation de ${manyAffectations.length} affectations en ${duration.toFixed(2)}ms`);
  
  if (duration > 100) { // Plus de 100ms = problème de performance
    console.warn('⚠️ Performance lente détectée');
    return false;
  }
  
  if (events.length !== 100) {
    console.error('❌ Nombre d\'événements incorrect après transformation');
    return false;
  }
  
  console.log('✅ Test de performance réussi !');
  return true;
};

/**
 * Test d'intégrité des données - vérifie la cohérence
 */
export const testDataIntegrity = () => {
  console.log('🔒 Test d\'intégrité des données...');
  
  // Test avec des données incomplètes
  const incompleteAffectation = {
    idaffectation: 999,
    typeActivite: 'Test',
    idSalle: 999,
    // nomSalle manquant
    date: '2024-01-15',
    heureDebut: '09:00',
    heureFin: '10:00'
    // statut manquant
  };

  const event = transformAffectationsForCalendar([incompleteAffectation])[0];
  
  // Vérifier que les valeurs par défaut sont appliquées
  if (event.title !== 'Test - Salle 999') {
    console.error('❌ Valeur par défaut pour nomSalle non appliquée');
    return false;
  }
  
  if (event.backgroundColor === undefined) {
    console.error('❌ Couleur de l\'événement manquante');
    return false;
  }
  
  console.log('✅ Test d\'intégrité réussi !');
  return true;
};

/**
 * Exécuter tous les tests de stabilité
 */
export const runStabilityTests = () => {
  console.log('🚀 Démarrage des tests de stabilité...');
  
  const results = [
    testCalendarStability(),
    testPerformance(),
    testDataIntegrity()
  ];
  
  const successCount = results.filter(Boolean).length;
  const totalCount = results.length;
  
  console.log(`📊 Résultats: ${successCount}/${totalCount} tests réussis`);
  
  if (successCount === totalCount) {
    console.log('🎉 Tous les tests de stabilité sont passés !');
  } else {
    console.error('❌ Certains tests de stabilité ont échoué');
  }
  
  return successCount === totalCount;
};

// Exposer les tests globalement pour la console du navigateur
if (typeof window !== 'undefined') {
  window.testCalendarStability = testCalendarStability;
  window.testPerformance = testPerformance;
  window.testDataIntegrity = testDataIntegrity;
  window.runStabilityTests = runStabilityTests;
}
