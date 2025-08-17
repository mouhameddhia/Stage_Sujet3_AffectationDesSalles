/**
 * Test des améliorations de l'interface utilisateur
 * pour la page des recommandations IA
 */

export const testUIImprovements = () => {
  console.log('🧪 Test des améliorations UI des recommandations IA...');
  
  // Test 1: Vérifier que le bouton principal est accessible
  const mainButton = document.querySelector('button[data-testid="main-recommendation-button"]');
  if (mainButton) {
    console.log('✅ Bouton principal trouvé et accessible');
  } else {
    console.log('❌ Bouton principal non trouvé');
  }
  
  // Test 2: Vérifier la centralisation des éléments
  const container = document.querySelector('.MuiContainer-root');
  if (container) {
    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.textAlign === 'center' || container.querySelector('[style*="text-align: center"]')) {
      console.log('✅ Éléments centrés correctement');
    } else {
      console.log('⚠️ Éléments pas complètement centrés');
    }
  }
  
  // Test 3: Vérifier les styles améliorés
  const papers = document.querySelectorAll('.MuiPaper-root');
  let improvedStyles = 0;
  papers.forEach(paper => {
    const style = window.getComputedStyle(paper);
    if (style.borderRadius !== '4px' || style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      improvedStyles++;
    }
  });
  
  if (improvedStyles > 0) {
    console.log(`✅ ${improvedStyles} éléments avec styles améliorés`);
  } else {
    console.log('⚠️ Styles améliorés non appliqués');
  }
  
  // Test 4: Vérifier la disposition des grilles
  const gridContainer = document.querySelector('.MuiGrid-container');
  if (gridContainer) {
    const justifyContent = window.getComputedStyle(gridContainer).justifyContent;
    if (justifyContent === 'center') {
      console.log('✅ Grille centrée correctement');
    } else {
      console.log('⚠️ Grille pas centrée');
    }
  }
  
  console.log('🎯 Test des améliorations UI terminé !');
};

export const testButtonAccessibility = () => {
  console.log('🔍 Test de l\'accessibilité du bouton...');
  
  // Vérifier que le bouton est visible et cliquable
  const buttons = document.querySelectorAll('button');
  const recommendationButtons = Array.from(buttons).filter(btn => 
    btn.textContent.includes('Recommandation') || btn.textContent.includes('IA')
  );
  
  if (recommendationButtons.length > 0) {
    console.log(`✅ ${recommendationButtons.length} bouton(s) de recommandation trouvé(s)`);
    
    recommendationButtons.forEach((btn, index) => {
      const isVisible = btn.offsetParent !== null;
      const isEnabled = !btn.disabled;
      const hasIcon = btn.querySelector('svg') !== null;
      
      console.log(`  Bouton ${index + 1}:`, {
        visible: isVisible ? '✅' : '❌',
        enabled: isEnabled ? '✅' : '❌',
        hasIcon: hasIcon ? '✅' : '❌',
        text: btn.textContent.trim()
      });
    });
  } else {
    console.log('❌ Aucun bouton de recommandation trouvé');
  }
};

export const testLayoutImprovements = () => {
  console.log('🎨 Test des améliorations de mise en page...');
  
  // Vérifier les espacements et marges
  const papers = document.querySelectorAll('.MuiPaper-root');
  let wellSpaced = 0;
  
  papers.forEach(paper => {
    const style = window.getComputedStyle(paper);
    const margin = parseInt(style.marginBottom) || 0;
    const padding = parseInt(style.padding) || 0;
    
    if (margin >= 16 && padding >= 16) {
      wellSpaced++;
    }
  });
  
  if (wellSpaced > 0) {
    console.log(`✅ ${wellSpaced} éléments avec espacement approprié`);
  } else {
    console.log('⚠️ Espacement insuffisant');
  }
  
  // Vérifier les bordures arrondies
  const roundedElements = Array.from(papers).filter(paper => {
    const style = window.getComputedStyle(paper);
    return style.borderRadius !== '4px';
  });
  
  if (roundedElements.length > 0) {
    console.log(`✅ ${roundedElements.length} éléments avec bordures arrondies`);
  } else {
    console.log('⚠️ Bordures arrondies non appliquées');
  }
};

// Fonction principale de test
export const runAllUITests = () => {
  console.log('🚀 Lancement de tous les tests UI...');
  console.log('=' .repeat(50));
  
  testUIImprovements();
  console.log('-'.repeat(30));
  
  testButtonAccessibility();
  console.log('-'.repeat(30));
  
  testLayoutImprovements();
  console.log('-'.repeat(30));
  
  console.log('🎉 Tous les tests UI terminés !');
  console.log('=' .repeat(50));
};

// Export par défaut
export default {
  testUIImprovements,
  testButtonAccessibility,
  testLayoutImprovements,
  runAllUITests
};
