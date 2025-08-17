import * as yup from 'yup';

// Schéma de validation pour la connexion
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Format d\'email invalide')
    .required('L\'email est requis'),
  motDePasse: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
});

// Schéma de validation pour l'inscription
export const signupSchema = yup.object({
  nom: yup
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est requis'),
  email: yup
    .string()
    .email('Format d\'email invalide')
    .required('L\'email est requis'),
  motDePasse: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  confirmerMotDePasse: yup
    .string()
    .oneOf([yup.ref('motDePasse'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Le rôle doit être "user" ou "admin"')
    .default('user'),
});

// Schéma de validation pour la modification du profil
export const profileSchema = yup.object({
  nom: yup
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est requis'),
  email: yup
    .string()
    .email('Format d\'email invalide')
    .required('L\'email est requis'),
  motDePasse: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .nullable(),
  confirmerMotDePasse: yup
    .string()
    .oneOf([yup.ref('motDePasse'), null], 'Les mots de passe doivent correspondre')
    .when('motDePasse', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required('La confirmation du mot de passe est requise'),
      otherwise: (schema) => schema.nullable(),
    }),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Le rôle doit être "user" ou "admin"')
    .required('Le rôle est requis'),
});

// Schéma de validation pour une affectation
export const affectationSchema = yup.object({
  typeActivite: yup
    .string()
    .min(3, 'Le type d\'activité doit contenir au moins 3 caractères')
    .max(100, 'Le type d\'activité ne peut pas dépasser 100 caractères')
    .required('Le type d\'activité est requis'),
  idSalle: yup.string().required('La salle est requise'),
  date: yup.string().required('La date est requise'),
  heureDebut: yup.string().required('L\'heure de début est requise'),
  heureFin: yup.string().required('L\'heure de fin est requise'),
});

// Schéma de validation pour une salle
export const salleSchema = yup.object({
  nomSalle: yup
    .string()
    .min(2, 'Le nom de la salle doit contenir au moins 2 caractères')
    .required('Le nom de la salle est requis'),
  typeSalle: yup
    .string()
    .required('Le type de salle est requis'),
  capacite: yup
    .number()
    .typeError('La capacité doit être un nombre')
    .integer('La capacité doit être un entier')
    .min(1, 'La capacité doit être au moins 1')
    .required('La capacité est requise'),
});

// Fonction utilitaire pour valider un token JWT (vérification basique)
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Décoder le token JWT (partie payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Vérifier si le token n'est pas expiré
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}; 