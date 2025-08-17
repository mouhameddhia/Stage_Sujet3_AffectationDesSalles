/**
 * Test simple des recommandations IA
 */

export const testSimpleRecommendations = () => {
  console.log('🧪 Test simple des recommandations IA...');
  
  // Vérifier que le composant est bien rendu
  const smartRecommendationsComponent = document.querySelector('[data-smart-recommendations]');
  if (smartRecommendationsComponent) {
    console.log('✅ Composant SmartRecommendations trouvé');
  } else {
    console.log('❌ Composant SmartRecommendations non trouvé');
  }
  
  // Vérifier que le bouton principal existe
  const mainButton = document.querySelector('button[data-testid="main-recommendation-button"]');
  if (mainButton) {
    console.log('✅ Bouton principal trouvé');
    console.log('  - Texte:', mainButton.textContent.trim());
    console.log('  - Disabled:', mainButton.disabled);
  } else {
    console.log('❌ Bouton principal non trouvé');
  }
  
  // Vérifier que la référence est bien définie
  if (window.smartRecommendationsRef) {
    console.log('✅ Référence au composant SmartRecommendations définie');
    console.log('  - Méthodes disponibles:', Object.keys(window.smartRecommendationsRef));
  } else {
    console.log('⚠️ Référence au composant SmartRecommendations non définie');
  }
  
  console.log('🎯 Test simple terminé !');
};

export default testSimpleRecommendations;
