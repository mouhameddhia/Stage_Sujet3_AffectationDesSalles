/**
 * Test de la vue tableau des affectations
 */

export const testTableView = () => {
  console.log('🧪 Test de l\'emploi du temps des affectations...');
  
  // Vérifier que le composant ViewSelector est présent
  const viewSelector = document.querySelector('[data-testid="view-selector"]');
  if (viewSelector) {
    console.log('✅ Sélecteur de vue trouvé');
  } else {
    console.log('❌ Sélecteur de vue non trouvé');
  }
  
  // Vérifier que les boutons de vue existent
  const calendarButton = document.querySelector('button[value="calendar"]');
  const tableButton = document.querySelector('button[value="table"]');
  
  if (calendarButton && tableButton) {
    console.log('✅ Boutons de vue trouvés');
    console.log('  - Calendrier:', calendarButton.textContent.trim());
    console.log('  - Emploi du Temps:', tableButton.textContent.trim());
  } else {
    console.log('❌ Boutons de vue manquants');
  }
  
  // Vérifier que l'emploi du temps s'affiche
  const tableView = document.querySelector('.MuiTableContainer-root');
  if (tableView) {
    console.log('✅ Emploi du temps affiché');
    
    // Vérifier les colonnes horaires ou jours
    const timeColumns = document.querySelectorAll('th[scope="col"]');
    if (timeColumns.length > 1) {
      console.log(`✅ ${timeColumns.length - 1} colonnes trouvées`);
    }
    
    // Vérifier les lignes de salles
    const salleRows = document.querySelectorAll('tr[data-salle-row]');
    if (salleRows.length > 0) {
      console.log(`✅ ${salleRows.length} lignes de salles trouvées`);
    }
    
    // Vérifier les boutons de navigation
    const navButtons = document.querySelectorAll('button[data-navigation]');
    if (navButtons.length > 0) {
      console.log(`✅ ${navButtons.length} boutons de navigation trouvés`);
    }
    
    // Vérifier le sélecteur de mode (jour/semaine)
    const modeSelector = document.querySelector('.MuiToggleButtonGroup-root');
    if (modeSelector) {
      console.log('✅ Sélecteur de mode jour/semaine trouvé');
    }
  } else {
    console.log('⚠️ Emploi du temps non affiché (peut-être en mode calendrier)');
  }
  
  // Vérifier la vue calendrier
  const calendarView = document.querySelector('.fc-calendar');
  if (calendarView) {
    console.log('✅ Vue calendrier affichée');
  } else {
    console.log('⚠️ Vue calendrier non affichée (peut-être en mode emploi du temps)');
  }
  
  console.log('🎯 Test de l\'emploi du temps terminé !');
};

export const testViewSwitching = () => {
  console.log('🔄 Test du changement de vue...');
  
  const calendarButton = document.querySelector('button[value="calendar"]');
  const tableButton = document.querySelector('button[value="table"]');
  
  if (calendarButton && tableButton) {
    // Simuler un clic sur le bouton tableau
    tableButton.click();
    setTimeout(() => {
      const tableView = document.querySelector('.MuiTableContainer-root');
      if (tableView) {
        console.log('✅ Changement vers la vue tableau réussi');
      } else {
        console.log('❌ Échec du changement vers la vue tableau');
      }
    }, 100);
    
    // Simuler un clic sur le bouton calendrier
    setTimeout(() => {
      calendarButton.click();
      setTimeout(() => {
        const calendarView = document.querySelector('.fc-calendar');
        if (calendarView) {
          console.log('✅ Changement vers la vue calendrier réussi');
        } else {
          console.log('❌ Échec du changement vers la vue calendrier');
        }
      }, 100);
    }, 200);
  } else {
    console.log('❌ Boutons de vue non trouvés pour le test');
  }
};

export const testTableViewData = () => {
  console.log('📊 Test des données de la vue tableau...');
  
  // Vérifier la présence des affectations
  const affectationCells = document.querySelectorAll('[data-affectation-cell]');
  if (affectationCells.length > 0) {
    console.log(`✅ ${affectationCells.length} cellules d'affectation trouvées`);
  } else {
    console.log('⚠️ Aucune cellule d\'affectation trouvée');
  }
  
  // Vérifier la présence des cellules libres
  const availableCells = document.querySelectorAll('[data-available-cell]');
  if (availableCells.length > 0) {
    console.log(`✅ ${availableCells.length} cellules libres trouvées`);
  } else {
    console.log('⚠️ Aucune cellule libre trouvée');
  }
  
  // Vérifier le groupement par bloc
  const blocHeaders = document.querySelectorAll('[data-bloc-header]');
  if (blocHeaders.length > 0) {
    console.log(`✅ ${blocHeaders.length} en-têtes de bloc trouvés`);
  } else {
    console.log('⚠️ Aucun en-tête de bloc trouvé');
  }
  
  console.log('🎯 Test des données terminé !');
};

export const runAllTableViewTests = () => {
  console.log('🚀 Lancement de tous les tests de la vue tableau...');
  console.log('=' .repeat(50));
  
  testTableView();
  console.log('-'.repeat(30));
  
  setTimeout(() => {
    testViewSwitching();
    console.log('-'.repeat(30));
    
    setTimeout(() => {
      testTableViewData();
      console.log('-'.repeat(30));
      console.log('🎉 Tous les tests de la vue tableau terminés !');
      console.log('=' .repeat(50));
    }, 300);
  }, 200);
};

export default {
  testTableView,
  testViewSwitching,
  testTableViewData,
  runAllTableViewTests
};
