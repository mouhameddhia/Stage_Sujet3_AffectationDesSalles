/**
 * Tests pour la création d'affectations
 */

export const testAffectationCreation = () => {
  console.log('🧪 Test de création d\'affectation...');
  
  // Simuler les données d'une affectation
  const testAffectationData = {
    idSalle: 1,
    typeactivite: 'Test Création',
    date: new Date().toISOString().split('T')[0],
    heuredebut: '14:00',
    heurefin: '15:00',
    description: 'Test de création d\'affectation'
  };
  
  console.log('📝 Données de test:', testAffectationData);
  
  // Vérifier que les données ont le bon format
  const hasRequiredFields = testAffectationData.idSalle && 
                           testAffectationData.typeactivite && 
                           testAffectationData.date && 
                           testAffectationData.heuredebut && 
                           testAffectationData.heurefin;
  
  console.log('✅ Champs requis présents:', hasRequiredFields);
  
  // Vérifier les types de données
  console.log('🔍 Types de données:', {
    idSalle: typeof testAffectationData.idSalle,
    typeactivite: typeof testAffectationData.typeactivite,
    date: typeof testAffectationData.date,
    heuredebut: typeof testAffectationData.heuredebut,
    heurefin: typeof testAffectationData.heurefin
  });
  
  return testAffectationData;
};

export const testSalleStructure = () => {
  console.log('🧪 Test de la structure des salles...');
  
  // Récupérer les salles depuis le localStorage ou les variables globales
  const salles = JSON.parse(localStorage.getItem('salles')) || [];
  
  if (salles.length > 0) {
    const sample = salle = salles[0];
    console.log('🔍 Échantillon de salle:', sample);
    
    // Vérifier les champs requis
    const requiredFields = {
      idSalle: sample.idSalle,
      nomSalle: sample.nomSalle,
      capacite: sample.capacite,
      typeSalle: sample.typeSalle
    };
    
    console.log('✅ Champs requis:', requiredFields);
    
    // Vérifier les types
    const fieldTypes = {
      idSalle: typeof sample.idSalle,
      nomSalle: typeof sample.nomSalle,
      capacite: typeof sample.capacite,
      typeSalle: typeof sample.typeSalle
    };
    
    console.log('🔍 Types des champs:', fieldTypes);
    
    // Vérifier si idSalle existe
    const hasIdSalle = 'idSalle' in sample;
    const hasId = 'id' in sample;
    
    console.log('🔍 Présence des champs ID:', {
      hasIdSalle,
      hasId,
      idSalleValue: sample.idSalle,
      idValue: sample.id
    });
    
    return { sample, requiredFields, fieldTypes, hasIdSalle, hasId };
  } else {
    console.log('⚠️ Aucune salle trouvée');
    return null;
  }
};

export const testDataStructureComparison = () => {
  console.log('🧪 Test de comparaison des structures de données...');
  
  // Structure attendue par le backend (basée sur le calendrier)
  const expectedStructure = {
    idSalle: 'number',
    typeactivite: 'string',
    date: 'string',
    heuredebut: 'string',
    heurefin: 'string'
  };
  
  console.log('📋 Structure attendue par le backend:', expectedStructure);
  
  // Structure envoyée par le tableau
  const tableStructure = {
    idSalle: 'number',
    typeactivite: 'string',
    date: 'string',
    heuredebut: 'string',
    heurefin: 'string'
  };
  
  console.log('📊 Structure envoyée par le tableau:', tableStructure);
  
  // Structure envoyée par le modal (première tentative)
  const modalStructure1 = {
    idSalle: 'number',
    typeActivite: 'string', // ❌ Majuscule
    date: 'string',
    heureDebut: 'string',   // ❌ Majuscule
    heureFin: 'string'      // ❌ Majuscule
  };
  
  console.log('🔴 Structure envoyée par le modal (1ère tentative):', modalStructure1);
  
  // Structure envoyée par le modal (deuxième tentative)
  const modalStructure2 = {
    idSalle: 'number',
    typeactivite: 'string', // ✅ Lowercase
    date: 'string',
    heuredebut: 'string',   // ✅ Lowercase
    heurefin: 'string'      // ✅ Lowercase
  };
  
  console.log('🟢 Structure envoyée par le modal (2ème tentative):', modalStructure2);
  
  // Vérifier la cohérence
  const tableMatchesExpected = JSON.stringify(tableStructure) === JSON.stringify(expectedStructure);
  const modal2MatchesExpected = JSON.stringify(modalStructure2) === JSON.stringify(expectedStructure);
  
  console.log('🔍 Résultats de la comparaison:', {
    tableMatchesExpected,
    modal2MatchesExpected,
    recommendation: tableMatchesExpected ? '✅ Tableau cohérent' : '❌ Tableau incohérent'
  });
  
  return {
    expectedStructure,
    tableStructure,
    modalStructure1,
    modalStructure2,
    tableMatchesExpected,
    modal2MatchesExpected
  };
};

export const testBackendExpectations = () => {
  console.log('🧪 Test des attentes du backend...');
  
  // Test 1: idSalle comme string
  const testData1 = {
    idSalle: '20', // String au lieu de number
    typeactivite: 'Test String ID',
    date: '2025-08-17',
    heuredebut: '20:00',
    heurefin: '21:00'
  };
  
  // Test 2: idSalle comme number
  const testData2 = {
    idSalle: 20, // Number
    typeactivite: 'Test Number ID',
    date: '2025-08-17',
    heuredebut: '20:00',
    heurefin: '21:00'
  };
  
  // Test 3: Avec champs supplémentaires possibles
  const testData3 = {
    idSalle: 20,
    typeactivite: 'Test Extra Fields',
    date: '2025-08-17',
    heuredebut: '20:00',
    heurefin: '21:00',
    description: 'Test description',
    status: 'pending',
    requesterId: 1
  };
  
  // Test 4: Format de date différent
  const testData4 = {
    idSalle: 20,
    typeactivite: 'Test Date Format',
    date: new Date('2025-08-17').toISOString(), // Date complète
    heuredebut: '20:00',
    heurefin: '21:00'
  };
  
  console.log('🔍 Tests de formats de données:');
  console.log('Test 1 - idSalle string:', testData1);
  console.log('Test 2 - idSalle number:', testData2);
  console.log('Test 3 - Champs supplémentaires:', testData3);
  console.log('Test 4 - Format de date complet:', testData4);
  
  return {
    testData1,
    testData2,
    testData3,
    testData4
  };
};

export const testAffectationService = async () => {
  console.log('🧪 Test du service d\'affectation...');
  
  try {
    // Importer le service
    const { default: affectationService } = await import('../services/affectationService');
    
    // Tester la récupération des affectations
    console.log('🔄 Test de récupération des affectations...');
    const affectations = await affectationService.getAllAffectations();
    console.log('✅ Affectations récupérées:', affectations.length);
    
    // Tester la création d'une affectation
    console.log('🔄 Test de création d\'affectation...');
    const testData = testAffectationCreation();
    
    try {
      const newAffectation = await affectationService.createAffectation(testData);
      console.log('✅ Affectation créée avec succès:', newAffectation);
      
      // Nettoyer - supprimer l'affectation de test
      if (newAffectation.idaffectation) {
        console.log('🔄 Nettoyage - suppression de l\'affectation de test...');
        await affectationService.deleteAffectation(newAffectation.idaffectation);
        console.log('✅ Affectation de test supprimée');
      }
      
      return { success: true, newAffectation };
    } catch (createError) {
      console.error('❌ Erreur lors de la création:', createError);
      return { success: false, error: createError };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test du service:', error);
    return { success: false, error };
  }
};

export const testAffectationDisplay = () => {
  console.log('🧪 Test de l\'affichage des affectations...');
  
  // Vérifier les cellules d'affectation
  const affectationCells = document.querySelectorAll('[data-affectation-cell]');
  console.log('🔴 Cellules d\'affectation trouvées:', affectationCells.length);
  
  // Vérifier les cellules libres
  const availableCells = document.querySelectorAll('[data-available-cell]');
  console.log('🟢 Cellules libres trouvées:', availableCells.length);
  
  // Vérifier les salles
  const salleRows = document.querySelectorAll('[data-salle-row]');
  console.log('🏢 Lignes de salles trouvées:', salleRows.length);
  
  // Vérifier les blocs
  const blocHeaders = document.querySelectorAll('[data-bloc-header]');
  console.log('🏢 En-têtes de blocs trouvés:', blocHeaders.length);
  
  return {
    affectationCellsCount: affectationCells.length,
    availableCellsCount: availableCells.length,
    salleRowsCount: salleRows.length,
    blocHeadersCount: blocHeaders.length
  };
};

export const testAffectationDataFormat = () => {
  console.log('🧪 Test du format des données d\'affectation...');
  
  // Récupérer les affectations depuis le localStorage ou les variables globales
  const affectations = JSON.parse(localStorage.getItem('affectations')) || [];
  
  if (affectations.length > 0) {
    const sample = affectations[0];
    console.log('🔍 Échantillon d\'affectation:', sample);
    
    // Vérifier les champs requis
    const requiredFields = {
      idaffectation: sample.idaffectation,
      typeactivite: sample.typeactivite,
      date: sample.date,
      heuredebut: sample.heuredebut,
      heurefin: sample.heurefin,
      idSalle: sample.idSalle
    };
    
    console.log('✅ Champs requis:', requiredFields);
    
    // Vérifier les types
    const fieldTypes = {
      idaffectation: typeof sample.idaffectation,
      typeactivite: typeof sample.typeactivite,
      date: typeof sample.date,
      heuredebut: typeof sample.heuredebut,
      heurefin: typeof sample.heurefin,
      idSalle: typeof sample.idSalle
    };
    
    console.log('🔍 Types des champs:', fieldTypes);
    
    return { sample, requiredFields, fieldTypes };
  } else {
    console.log('⚠️ Aucune affectation trouvée');
    return null;
  }
};

export const runAllAffectationCreationTests = async () => {
  console.log('🚀 Lancement de tous les tests de création d\'affectation...');
  console.log('='.repeat(60));
  
  // Test 1: Format des données
  console.log('📋 Test 1: Format des données');
  const testData = testAffectationCreation();
  console.log('-'.repeat(40));
  
  // Test 2: Structure des salles
  console.log('🏢 Test 2: Structure des salles');
  const salleStructure = testSalleStructure();
  console.log('-'.repeat(40));
  
  // Test 3: Comparaison des structures
  console.log('🔍 Test 3: Comparaison des structures de données');
  const structureComparison = testDataStructureComparison();
  console.log('-'.repeat(40));
  
  // Test 4: Attentes du backend
  console.log('🔍 Test 4: Attentes du backend');
  const backendExpectations = testBackendExpectations();
  console.log('-'.repeat(40));
  
  // Test 5: Affichage
  console.log('📊 Test 5: Affichage des affectations');
  const displayResults = testAffectationDisplay();
  console.log('-'.repeat(40));
  
  // Test 6: Format des données existantes
  console.log('🔍 Test 6: Format des données existantes');
  const dataFormat = testAffectationDataFormat();
  console.log('-'.repeat(40));
  
  // Test 7: Service (optionnel - peut échouer si pas de backend)
  console.log('🔧 Test 7: Service d\'affectation');
  try {
    const serviceResults = await testAffectationService();
    console.log('✅ Service testé:', serviceResults);
  } catch (error) {
    console.log('⚠️ Service non testé (backend non disponible):', error.message);
  }
  console.log('-'.repeat(40));
  
  console.log('📊 Résultats des tests:', {
    testData,
    salleStructure,
    structureComparison,
    backendExpectations,
    displayResults,
    dataFormat
  });
  console.log('='.repeat(60));
  
  return {
    testData,
    salleStructure,
    structureComparison,
    backendExpectations,
    displayResults,
    dataFormat
  };
};

// Exposer les fonctions globalement pour les tests
window.testAffectationCreation = testAffectationCreation;
window.testSalleStructure = testSalleStructure;
window.testDataStructureComparison = testDataStructureComparison;
window.testBackendExpectations = testBackendExpectations;
window.testAffectationService = testAffectationService;
window.testAffectationDisplay = testAffectationDisplay;
window.testAffectationDataFormat = testAffectationDataFormat;
window.runAllAffectationCreationTests = runAllAffectationCreationTests;

export default {
  testAffectationCreation,
  testSalleStructure,
  testDataStructureComparison,
  testBackendExpectations,
  testAffectationService,
  testAffectationDisplay,
  testAffectationDataFormat,
  runAllAffectationCreationTests
};
