// Utilitaires pour la gestion des dates et heures

/**
 * Formate une date au format YYYY-MM-DD
 * @param {Date} date - La date à formater
 * @returns {string} Date formatée
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formate une heure au format HH:MM
 * @param {Date|string} time - L'heure à formater
 * @returns {string} Heure formatée
 */
export const formatTime = (time) => {
  if (!time) return '';
  const d = new Date(time);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Combine une date et une heure
 * @param {string} date - Date au format YYYY-MM-DD
 * @param {string} time - Heure au format HH:MM
 * @returns {Date} Date combinée
 */
export const combineDateAndTime = (date, time) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}`);
};

/**
 * Vérifie si une date est dans le passé
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {boolean} True si la date est dans le passé
 */
export const isDateInPast = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  return checkDate < today;
};

/**
 * Vérifie si une heure est valide (format HH:MM)
 * @param {string} time - Heure à vérifier
 * @returns {boolean} True si l'heure est valide
 */
export const isValidTime = (time) => {
  if (!time) return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Vérifie si une heure de fin est après une heure de début
 * @param {string} startTime - Heure de début
 * @param {string} endTime - Heure de fin
 * @returns {boolean} True si l'heure de fin est valide
 */
export const isEndTimeAfterStart = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  return end > start;
};

/**
 * Calcule la durée entre deux heures
 * @param {string} startTime - Heure de début
 * @param {string} endTime - Heure de fin
 * @returns {number} Durée en minutes
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  return Math.round((end - start) / (1000 * 60));
};

/**
 * Formate une durée en heures et minutes
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0h 0min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  
  return `${hours}h ${mins}min`;
};

/**
 * Vérifie si une date est un week-end
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {boolean} True si c'est un week-end
 */
export const isWeekend = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6; // 0 = dimanche, 6 = samedi
};

/**
 * Obtient le nom du jour de la semaine
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {string} Nom du jour
 */
export const getDayName = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[d.getDay()];
};

/**
 * Obtient le nom du mois
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {string} Nom du mois
 */
export const getMonthName = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[d.getMonth()];
};

/**
 * Formate une date pour l'affichage
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {string} Date formatée pour l'affichage
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const dayName = getDayName(date);
  const day = d.getDate();
  const monthName = getMonthName(date);
  const year = d.getFullYear();
  
  return `${dayName} ${day} ${monthName} ${year}`;
}; 