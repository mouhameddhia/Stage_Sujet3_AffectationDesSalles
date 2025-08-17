// Utilitaires pour FullCalendar et la gestion des événements

/**
 * Transforme les affectations en événements FullCalendar
 * @param {Array} affectations - Liste des affectations
 * @returns {Array} Événements formatés pour FullCalendar
 */
export const transformAffectationsForCalendar = (affectations) => {
  if (!Array.isArray(affectations) || affectations.length === 0) {
    return [];
  }

  return affectations.map((aff, index) => {
    try {
      // Vérifier que les données essentielles sont présentes
      if (!aff.date || !aff.heureDebut || !aff.heureFin || !aff.typeActivite) {
        return null;
      }

      // Créer des objets Date JavaScript valides
      const startDate = new Date(`${aff.date}T${aff.heureDebut}:00`);
      const endDate = new Date(`${aff.date}T${aff.heureFin}:00`);
      
      // Vérifier que les dates sont valides
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return null;
      }

      // Vérifier que la fin est après le début
      if (endDate <= startDate) {
        return null;
      }

      const event = {
        id: aff.idaffectation || aff.idAffectation || `temp-${index}`, // Gérer les deux cas possibles
        title: `${aff.typeActivite} - ${aff.nomSalle || `Salle ${aff.idSalle}`}`,
        start: startDate,
        end: endDate,
        backgroundColor: getEventColor(aff.typeActivite),
        borderColor: getEventColor(aff.typeActivite),
        textColor: '#ffffff',
        extendedProps: {
          typeActivite: aff.typeActivite,
          idSalle: aff.idSalle,
          nomSalle: aff.nomSalle || `Salle ${aff.idSalle}`,
          idaffectation: aff.idaffectation || aff.idAffectation,
          typeSalle: aff.typeSalle,
          capacite: aff.capacite,
          date: aff.date,
          heureDebut: aff.heureDebut,
          heureFin: aff.heureFin
        }
      };

      return event;

    } catch (error) {
      return null;
    }
  }).filter(Boolean); // Filtrer les événements null
};

/**
 * Obtient la couleur d'un événement selon le type d'activité
 * @param {string} typeActivite - Type d'activité
 * @returns {string} Code couleur hexadécimal
 */
export const getEventColor = (typeActivite) => {
  const colors = {
    'cours': '#2196F3',      // Bleu
    'reunion': '#FF9800',    // Orange
    'soutenance': '#F44336', // Rouge
    'examen': '#9C27B0',     // Violet
    'conference': '#4CAF50', // Vert
    'atelier': '#FF5722',    // Rouge foncé
    'seminaire': '#607D8B',  // Gris bleu
    'formation': '#795548',  // Marron
    'default': '#757575'     // Gris par défaut
  };
  
  return colors[typeActivite?.toLowerCase()] || colors.default;
};

/**
 * Obtient l'icône d'un événement selon le type d'activité
 * @param {string} typeActivite - Type d'activité
 * @returns {string} Première lettre du type d'activité pour l'avatar
 */
export const getEventIcon = (typeActivite) => {
  if (!typeActivite) return '?';
  return typeActivite.charAt(0).toUpperCase();
}; 