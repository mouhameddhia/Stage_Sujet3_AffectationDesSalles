/**
 * Test de l'affichage des affectations dans l'emploi du temps
 */

export const testAffectationDisplay = () => {
  console.log('🧪 Test de l\'affichage des affectations...');
  
  // Vérifier les données d'affectation
  const affectations = window.affectationsData || [];
  console.log('📊 Nombre d\'affectations:', affectations.length);
  
  if (affectations.length > 0) {
    console.log('🔍 Première affectation:', affectations[0]);
    console.log('🔍 Champs disponibles:', Object.keys(affectations[0]));
    
    // Vérifier les champs requis (comme dans le calendrier)
    const firstAff = affectations[0];
    const hasDate = firstAff.date;
    const hasHeureDebut = firstAff.heuredebut; // Comme dans le calendrier
    const hasHeureFin = firstAff.heurefin; // Comme dans le calendrier
    const hasIdSalle = firstAff.idSalle; // Comme dans le calendrier
    const hasTypeActivite = firstAff.typeactivite; // Comme dans le calendrier
    
    console.log('✅ Champs requis (style calendrier):', {
      date: hasDate,
      heuredebut: hasHeureDebut,
      heurefin: hasHeureFin,
      idSalle: hasIdSalle,
      typeactivite: hasTypeActivite
    });
  }
  
  // Vérifier les cellules d'affectation
  const affectationCells = document.querySelectorAll('[data-affectation-cell]');
  console.log('🔴 Cellules d\'affectation trouvées:', affectationCells.length);
  
  // Vérifier les cellules libres
  const availableCells = document.querySelectorAll('[data-available-cell]');
  console.log('🟢 Cellules libres trouvées:', availableCells.length);
  
  // Vérifier les salles
  const salleRows = document.querySelectorAll('[data-salle-row]');
  console.log('🏢 Lignes de salles trouvées:', salleRows.length);
  
  return {
    affectationsCount: affectations.length,
    affectationCellsCount: affectationCells.length,
    availableCellsCount: availableCells.length,
    salleRowsCount: salleRows.length
  };
};

export const debugAffectationData = () => {
  console.log('🔍 Debug des données d\'affectation...');
  
  // Récupérer les données depuis le localStorage ou les variables globales
  const affectations = JSON.parse(localStorage.getItem('affectations')) || [];
  const salles = JSON.parse(localStorage.getItem('salles')) || [];
  
  console.log('📊 Affectations stockées:', affectations);
  console.log('🏢 Salles stockées:', salles);
  
  // Analyser la structure des données
  if (affectations.length > 0) {
    const sample = affectations[0];
    console.log('🔍 Structure d\'une affectation:', {
      keys: Object.keys(sample),
      values: Object.values(sample)
    });
    
    // Vérifier les champs spécifiques du calendrier
    console.log('🔍 Champs calendrier dans localStorage:', {
      idaffectation: sample.idaffectation,
      typeactivite: sample.typeactivite,
      date: sample.date,
      heuredebut: sample.heuredebut,
      heurefin: sample.heurefin,
      idSalle: sample.idSalle,
      nomSalle: sample.nomSalle
    });
  }
  
  if (salles.length > 0) {
    const sample = salles[0];
    console.log('🔍 Structure d\'une salle:', {
      keys: Object.keys(sample),
      values: Object.values(sample)
    });
  }
};

export const simulateAffectationCreation = () => {
  console.log('🎯 Simulation de création d\'affectation...');
  
  // Simuler une affectation de test avec les bons noms de champs
  const testAffectation = {
    idaffectation: Date.now(), // Comme dans le calendrier
    typeactivite: 'Test Simulation', // Comme dans le calendrier
    idSalle: 1, // Comme dans le calendrier
    date: new Date().toISOString().split('T')[0],
    heuredebut: '14:00', // Comme dans le calendrier
    heurefin: '15:00', // Comme dans le calendrier
    description: 'Affectation de test créée par simulation'
  };
  
  console.log('📝 Affectation de test (style calendrier):', testAffectation);
  
  // Ajouter à la liste des affectations
  const currentAffectations = JSON.parse(localStorage.getItem('affectations')) || [];
  currentAffectations.push(testAffectation);
  localStorage.setItem('affectations', JSON.stringify(currentAffectations));
  
  console.log('✅ Affectation de test ajoutée');
  
  return testAffectation;
};

export const testAffectationMatching = () => {
  console.log('🎯 Test de correspondance des affectations...');
  
  // Simuler une recherche d'affectation
  const testSalleId = 1;
  const testDate = new Date();
  const testHeure = 14;
  
  console.log('🔍 Recherche pour:', {
    salleId: testSalleId,
    date: testDate.toISOString().split('T')[0],
    heure: testHeure
  });
  
  // Récupérer les affectations depuis localStorage
  const affectations = JSON.parse(localStorage.getItem('affectations')) || [];
  
  // Simuler la logique de findAffectation
  const found = affectations.find(aff => {
    const affDate = aff.date;
    const affHeureDebut = aff.heuredebut;
    const affHeureFin = aff.heurefin;
    const affIdSalle = aff.idSalle;
    
    if (!affDate || !affHeureDebut || !affHeureFin || !affIdSalle) {
      console.log('❌ Données manquantes:', { affDate, affHeureDebut, affHeureFin, affIdSalle });
      return false;
    }
    
    const affDateStr = new Date(affDate).toISOString().split('T')[0];
    const targetDate = testDate.toISOString().split('T')[0];
    const affDebut = parseInt(affHeureDebut.split(':')[0]);
    const affFin = parseInt(affHeureFin.split(':')[0]);
    
    const matches = affIdSalle === testSalleId && 
           affDateStr === targetDate &&
           testHeure >= affDebut && testHeure < affFin;
    
    if (matches) {
      console.log('✅ Affectation trouvée:', aff);
    }
    
    return matches;
  });
  
  console.log('🎯 Résultat de la recherche:', found ? 'Trouvée' : 'Non trouvée');
  
  return found;
};

export const runAllAffectationTests = () => {
  console.log('🚀 Lancement de tous les tests d\'affectation...');
  console.log('='.repeat(60));
  
  const results = testAffectationDisplay();
  console.log('-'.repeat(40));
  
  debugAffectationData();
  console.log('-'.repeat(40));
  
  const testAff = simulateAffectationCreation();
  console.log('-'.repeat(40));
  
  testAffectationMatching();
  console.log('-'.repeat(40));
  
  console.log('📊 Résultats des tests:', results);
  console.log('🎯 Affectation de test créée:', testAff);
  console.log('='.repeat(60));
  
  return { results, testAffectation: testAff };
};

// Exposer les fonctions globalement pour les tests
window.testAffectationDisplay = testAffectationDisplay;
window.debugAffectationData = debugAffectationData;
window.simulateAffectationCreation = simulateAffectationCreation;
window.testAffectationMatching = testAffectationMatching;
window.runAllAffectationTests = runAllAffectationTests;

export default {
  testAffectationDisplay,
  debugAffectationData,
  simulateAffectationCreation,
  testAffectationMatching,
  runAllAffectationTests
};
