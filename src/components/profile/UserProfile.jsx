import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './UserProfile.css';



const UserProfile = ({ isOpen, onClose }) => {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nom: user?.nom || '',
      email: user?.email || '',
      motDePasse: '',
      confirmerMotDePasse: '',
      role: user?.role || 'user'
    }
  });

  const watchedPassword = watch('motDePasse');

  useEffect(() => {
    if (isOpen && user) {
      reset({
        nom: user.nom || '',
        email: user.email || '',
        motDePasse: '',
        confirmerMotDePasse: '',
        role: user.role || 'user'
      });
    }
  }, [isOpen, user, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données à envoyer (exclure confirmerMotDePasse)
      const updateData = {
        nom: data.nom,
        email: data.email,
        role: data.role
      };

      // Ajouter le mot de passe seulement s'il a été modifié
      if (data.motDePasse) {
        updateData.motDePasse = data.motDePasse;
      }

      const response = await api.put(`/api/users/${user.idUser}`, updateData);
      
      if (response.data) {
        setSuccess('Profil mis à jour avec succès !');
        
        // Mettre à jour le contexte avec les nouvelles données
        const updatedUser = {
          ...user,
          nom: data.nom,
          email: data.email,
          role: data.role
        };
        
        // Mettre à jour le localStorage et le contexte
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser);
        
        // Réinitialiser le formulaire
        reset({
          nom: data.nom,
          email: data.email,
          motDePasse: '',
          confirmerMotDePasse: '',
          role: data.role
        });
        
        // Fermer le modal après 2 secondes
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={handleClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Modifier le profil</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="profile-modal-content">
          {error && <ErrorMessage message={error} type="error" />}
          {success && <ErrorMessage message={success} type="success" />}

          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                {...register('nom')}
                className={errors.nom ? 'error' : ''}
                placeholder="Votre nom"
              />
              {errors.nom && <span className="error-message">{errors.nom.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={errors.email ? 'error' : ''}
                placeholder="votre.email@exemple.com"
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="motDePasse">Nouveau mot de passe (optionnel)</label>
              <input
                type="password"
                id="motDePasse"
                {...register('motDePasse')}
                className={errors.motDePasse ? 'error' : ''}
                placeholder="Laissez vide pour ne pas changer"
              />
              {errors.motDePasse && <span className="error-message">{errors.motDePasse.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmerMotDePasse">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmerMotDePasse"
                {...register('confirmerMotDePasse')}
                className={errors.confirmerMotDePasse ? 'error' : ''}
                placeholder="Confirmez le nouveau mot de passe"
                disabled={!watchedPassword}
              />
              {errors.confirmerMotDePasse && (
                <span className="error-message">{errors.confirmerMotDePasse.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <select
                id="role"
                {...register('role')}
                className={errors.role ? 'error' : ''}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
              {errors.role && <span className="error-message">{errors.role.message}</span>}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                disabled={isSubmitting || isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  'Mettre à jour'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 