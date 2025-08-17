import * as yup from 'yup';
import { isDateInPast, isValidTime, isEndTimeAfterStart } from './dateUtils';

// Schéma de validation pour une affectation
export const affectationSchema = yup.object({
  typeactivite: yup
    .string()
    .required('Le type d\'activité est requis')
    .min(2, 'Le type d\'activité doit contenir au moins 2 caractères')
    .max(50, 'Le type d\'activité ne peut pas dépasser 50 caractères'),
  
  idSalle: yup
    .number()
    .required('La salle est requise')
    .positive('L\'ID de la salle doit être positif'),
  
  date: yup
    .string()
    .required('La date est requise')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .test('not-in-past', 'La date ne peut pas être dans le passé', (value) => {
      if (!value) return true;
      return !isDateInPast(value);
    }),
  
  heuredebut: yup
    .string()
    .required('L\'heure de début est requise')
    .test('valid-time', 'Format d\'heure invalide (HH:MM)', (value) => {
      if (!value) return true;
      return isValidTime(value);
    }),
  
  heurefin: yup
    .string()
    .required('L\'heure de fin est requise')
    .test('valid-time', 'Format d\'heure invalide (HH:MM)', (value) => {
      if (!value) return true;
      return isValidTime(value);
    })
    .test('end-after-start', 'L\'heure de fin doit être après l\'heure de début', function(value) {
      const { heuredebut } = this.parent;
      if (!value || !heuredebut) return true;
      return isEndTimeAfterStart(heuredebut, value);
    }),
  
  description: yup
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .nullable(),
  
  capacite: yup
    .number()
    .positive('La capacité doit être positive')
    .max(1000, 'La capacité ne peut pas dépasser 1000')
    .nullable(),
  
  statut: yup
    .string()
    .oneOf(['active', 'annulee', 'terminee'], 'Statut invalide')
    .default('active')
});

// Schéma de validation pour la recherche d'affectations
export const searchAffectationSchema = yup.object({
  dateDebut: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .nullable(),
  
  dateFin: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .nullable()
    .test('end-after-start', 'La date de fin doit être après la date de début', function(value) {
      const { dateDebut } = this.parent;
      if (!value || !dateDebut) return true;
      return new Date(value) >= new Date(dateDebut);
    }),
  
  idSalle: yup
    .number()
    .positive('L\'ID de la salle doit être positif')
    .nullable(),
  
  typeactivite: yup
    .string()
    .max(50, 'Le type d\'activité ne peut pas dépasser 50 caractères')
    .nullable()
});

// Fonction de validation des conflits
export const validateConflicts = (existingAffectations, newAffectation, excludeId = null) => {
  const conflicts = existingAffectations.filter(aff => {
    // Exclure l'affectation en cours de modification
    if (excludeId && aff.idaffectation === excludeId) {
      return false;
    }
    
    // Vérifier si c'est la même salle et la même date
    if (aff.idSalle !== newAffectation.idSalle || aff.date !== newAffectation.date) {
      return false;
    }
    
    // Vérifier le chevauchement horaire
    const newStart = new Date(`2000-01-01T${newAffectation.heuredebut}`);
    const newEnd = new Date(`2000-01-01T${newAffectation.heurefin}`);
    const existingStart = new Date(`2000-01-01T${aff.heuredebut}`);
    const existingEnd = new Date(`2000-01-01T${aff.heurefin}`);
    
    // Il y a conflit si les plages se chevauchent
    return (
      (newStart < existingEnd && newEnd > existingStart) ||
      (existingStart < newEnd && existingEnd > newStart) ||
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd)
    );
  });
  
  return conflicts;
};

// Fonction de validation des contraintes métier
export const validateBusinessRules = (affectation, salles) => {
  const errors = [];
  
  // Trouver la salle correspondante
  const salle = salles.find(s => s.idSalle === affectation.idSalle);
  
  if (salle) {
    // Vérifier la capacité si spécifiée
    if (affectation.capacite && affectation.capacite > salle.capaciteSalle) {
      errors.push(`La capacité demandée (${affectation.capacite}) dépasse la capacité de la salle (${salle.capaciteSalle})`);
    }
    
    // Vérifier les horaires d'ouverture (exemple : 8h-20h)
    const startHour = parseInt(affectation.heuredebut.split(':')[0]);
    const endHour = parseInt(affectation.heurefin.split(':')[0]);
    
    if (startHour < 8 || endHour > 20) {
      errors.push('Les horaires doivent être entre 8h00 et 20h00');
    }
    
    // Vérifier la durée minimale (30 minutes)
    const duration = calculateDuration(affectation.heuredebut, affectation.heurefin);
    if (duration < 30) {
      errors.push('La durée minimale d\'une affectation est de 30 minutes');
    }
    
    // Vérifier la durée maximale (4 heures)
    if (duration > 240) {
      errors.push('La durée maximale d\'une affectation est de 4 heures');
    }
  }
  
  return errors;
};

// Fonction utilitaire pour calculer la durée
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  return Math.round((end - start) / (1000 * 60));
};

// Schéma de validation pour les filtres
export const filterSchema = yup.object({
  dateDebut: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide')
    .nullable(),
  
  dateFin: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide')
    .nullable(),
  
  salles: yup
    .array()
    .of(yup.number().positive())
    .nullable(),
  
  typesActivites: yup
    .array()
    .of(yup.string().min(1))
    .nullable(),
  
  statut: yup
    .string()
    .oneOf(['active', 'annulee', 'terminee', 'tous'])
    .default('tous')
});

// Fonction de validation des permissions
export const validatePermissions = (user, action) => {
  if (!user) return false;
  
  // Seuls les administrateurs peuvent gérer les affectations
  if (user.role !== 'admin') {
    return false;
  }
  
  // Vérifications spécifiques selon l'action
  switch (action) {
    case 'create':
    case 'update':
    case 'delete':
      return user.role === 'admin';
    case 'view':
      return true; // Tout le monde peut voir
    default:
      return false;
  }
}; 