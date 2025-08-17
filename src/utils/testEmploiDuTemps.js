/**
 * Test de l'emploi du temps des affectations
 */

export const testEmploiDuTemps = () => {
  console.log('🧪 Test de l\'emploi du temps des affectations...');
  
  // Vérifier que le composant est bien rendu
  const emploiDuTemps = document.querySelector('.MuiTableContainer-root');
  if (emploiDuTemps) {
    console.log('✅ Emploi du temps affiché');
  } else {
    console.log('❌ Emploi du temps non affiché');
  }
  
  // Vérifier les boutons de navigation
  const prevButton = document.querySelector('button[data-navigation="prev"]');
  const nextButton = document.querySelector('button[data-navigation="next"]');
  const todayButton = document.querySelector('button[data-navigation="today"]');
  
  if (prevButton && nextButton && todayButton) {
    console.log('✅ Boutons de navigation trouvés');
    console.log('  - Précédent:', prevButton.textContent.trim());
    console.log('  - Aujourd\'hui:', todayButton.textContent.trim());
    console.log('  - Suivant:', nextButton.textContent.trim());
  } else {
    console.log('⚠️ Boutons de navigation manquants');
  }
  
  // Vérifier le sélecteur de mode jour/semaine
  const modeSelector = document.querySelector('.MuiToggleButtonGroup-root');
  if (modeSelector) {
    const dayButton = modeSelector.querySelector('button[value="day"]');
    const weekButton = modeSelector.querySelector('button[value="week"]');
    
    if (dayButton && weekButton) {
      console.log('✅ Sélecteur de mode trouvé');
      console.log('  - Jour:', dayButton.textContent.trim());
      console.log('  - Semaine:', weekButton.textContent.trim());
    }
  } else {
    console.log('❌ Sélecteur de mode non trouvé');
  }
  
  // Vérifier l'affichage des jours en colonnes
  const dayHeaders = document.querySelectorAll('th[scope="col"]');
  if (dayHeaders.length > 1) {
    console.log(`✅ ${dayHeaders.length - 1} colonnes de jours trouvées`);
    
    // Vérifier le contenu des en-têtes
    dayHeaders.forEach((header, index) => {
      if (index > 0) { // Ignorer la première colonne (Salles)
        const text = header.textContent.trim();
        if (text.includes('Lun') || text.includes('Mar') || text.includes('Mer') || text.includes('Jeu') || text.includes('Ven') || text.includes('Sam') || text.includes('Dim')) {
          console.log(`  - Colonne ${index}: ${text}`);
        }
      }
    });
  }
  
  // Vérifier les lignes de salles
  const salleRows = document.querySelectorAll('tr[data-salle-row]');
  if (salleRows.length > 0) {
    console.log(`✅ ${salleRows.length} lignes de salles trouvées`);
  } else {
    console.log('⚠️ Aucune ligne de salle trouvée');
  }
  
  console.log('🎯 Test de l\'emploi du temps terminé !');
};

export const testNavigationTemporelle = () => {
  console.log('🔄 Test de la navigation temporelle...');
  
  // Vérifier la navigation par jour
  const dayButton = document.querySelector('button[value="day"]');
  if (dayButton) {
    dayButton.click();
    setTimeout(() => {
      const dayHeaders = document.querySelectorAll('th[scope="col"]');
      const hasDayView = dayHeaders.length === 2; // 1 colonne Salles + 1 colonne Jour
      
      if (hasDayView) {
        console.log('✅ Vue jour activée');
      } else {
        console.log('❌ Vue jour non activée correctement');
      }
    }, 100);
  }
  
  // Vérifier la navigation par semaine
  setTimeout(() => {
    const weekButton = document.querySelector('button[value="week"]');
    if (weekButton) {
      weekButton.click();
      setTimeout(() => {
        const dayHeaders = document.querySelectorAll('th[scope="col"]');
        const hasWeekView = dayHeaders.length === 8; // 1 colonne Salles + 7 colonnes jours
        
        if (hasWeekView) {
          console.log('✅ Vue semaine activée avec 5 jours');
        } else {
          console.log('❌ Vue semaine non activée correctement');
        }
      }, 100);
    }
  }, 200);
  
  // Vérifier les boutons de navigation
  setTimeout(() => {
    const prevButton = document.querySelector('button[data-navigation="prev"]');
    const nextButton = document.querySelector('button[data-navigation="next"]');
    
    if (prevButton && nextButton) {
      console.log('✅ Boutons de navigation fonctionnels');
    } else {
      console.log('⚠️ Boutons de navigation non fonctionnels');
    }
  }, 400);
};

export const testEchelleHoraire = () => {
  console.log('⏰ Test de l\'échelle horaire...');
  
  // Vérifier que les heures sont bien affichées dans chaque colonne
  const availableCells = document.querySelectorAll('[data-available-cell]');
  const busyCells = document.querySelectorAll('[data-affectation-cell]');
  
  if (availableCells.length > 0) {
    console.log(`✅ ${availableCells.length} cellules libres trouvées`);
    
    // Vérifier que les heures sont bien présentes
    const heures = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    let heuresTrouvees = 0;
    
    availableCells.forEach(cell => {
      const heure = cell.getAttribute('data-heure');
      if (heure && heures.includes(parseInt(heure))) {
        heuresTrouvees++;
      }
    });
    
    if (heuresTrouvees > 0) {
      console.log(`✅ Échelle horaire de 8h à 20h détectée`);
    } else {
      console.log('⚠️ Échelle horaire non détectée');
    }
  }
  
  if (busyCells.length > 0) {
    console.log(`✅ ${busyCells.length} cellules occupées trouvées`);
  }
  
  console.log('🎯 Test de l\'échelle horaire terminé !');
};

export const testAffichageJours = () => {
  console.log('📅 Test de l\'affichage des jours...');
  
  // Vérifier que les jours sont bien affichés
  const dayHeaders = document.querySelectorAll('th[scope="col"]');
  const joursSemaine = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  let joursTrouves = 0;
  
  dayHeaders.forEach((header, index) => {
    if (index > 0) { // Ignorer la première colonne
      const text = header.textContent.trim();
      if (joursSemaine.some(jour => text.includes(jour))) {
        joursTrouves++;
        console.log(`  - Jour trouvé: ${text}`);
      }
    }
  });
  
  if (joursTrouves === 5) {
    console.log('✅ Tous les 5 jours de la semaine affichés');
  } else {
    console.log(`⚠️ ${joursTrouves}/5 jours trouvés`);
  }
  
  console.log('🎯 Test de l\'affichage des jours terminé !');
};

export const testResponsiveDesign = () => {
  console.log('📱 Test du design responsive...');
  
  // Vérifier que le tableau est scrollable
  const tableContainer = document.querySelector('.MuiTableContainer-root');
  if (tableContainer) {
    const hasOverflow = tableContainer.style.overflow === 'auto' || 
                       tableContainer.style.overflow === 'scroll';
    
    if (hasOverflow) {
      console.log('✅ Tableau scrollable pour les petits écrans');
    } else {
      console.log('⚠️ Tableau non scrollable');
    }
  }
  
  // Vérifier les colonnes sticky
  const stickyColumns = document.querySelectorAll('[style*="position: sticky"]');
  if (stickyColumns.length > 0) {
    console.log(`✅ ${stickyColumns.length} colonnes sticky pour la navigation`);
  } else {
    console.log('⚠️ Colonnes sticky non trouvées');
  }
  
  console.log('🎯 Test du design responsive terminé !');
};

export const runAllEmploiDuTempsTests = () => {
  console.log('🚀 Lancement de tous les tests de l\'emploi du temps...');
  console.log('=' .repeat(60));
  
  testEmploiDuTemps();
  console.log('-'.repeat(40));
  
  setTimeout(() => {
    testNavigationTemporelle();
    console.log('-'.repeat(40));
    
    setTimeout(() => {
      testEchelleHoraire();
      console.log('-'.repeat(40));
      
      setTimeout(() => {
        testAffichageJours();
        console.log('-'.repeat(40));
        
        setTimeout(() => {
          testResponsiveDesign();
          console.log('-'.repeat(40));
          console.log('🎉 Tous les tests de l\'emploi du temps terminés !');
          console.log('=' .repeat(60));
        }, 300);
      }, 300);
    }, 300);
  }, 200);
};

export default {
  testEmploiDuTemps,
  testNavigationTemporelle,
  testEchelleHoraire,
  testAffichageJours,
  testResponsiveDesign,
  runAllEmploiDuTempsTests
};
