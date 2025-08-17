import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import './AuthForms.css';

const SignupForm = () => {
  const { signup, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      clearError();
      await signup(data.nom, data.email, data.motDePasse, data.role);
      navigate('/', { replace: true });
    } catch (error) {
      // L'erreur est déjà gérée par le contexte
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-form-header">
          <h2>📝 Inscription</h2>
          <p>Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <ErrorMessage 
            message={error} 
            onClose={clearError}
            type="error"
          />

          <div className="form-group">
            <label htmlFor="nom">Nom complet</label>
            <input
              type="text"
              id="nom"
              {...register('nom')}
              className={errors.nom ? 'form-input error' : 'form-input'}
              placeholder="Votre nom complet"
            />
            {errors.nom && (
              <span className="error-text">{errors.nom.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={errors.email ? 'form-input error' : 'form-input'}
              placeholder="votre@email.com"
            />
            {errors.email && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="motDePasse">Mot de passe</label>
            <input
              type="password"
              id="motDePasse"
              {...register('motDePasse')}
              className={errors.motDePasse ? 'form-input error' : 'form-input'}
              placeholder="Votre mot de passe (min. 6 caractères)"
            />
            {errors.motDePasse && (
              <span className="error-text">{errors.motDePasse.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmerMotDePasse">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmerMotDePasse"
              {...register('confirmerMotDePasse')}
              className={errors.confirmerMotDePasse ? 'form-input error' : 'form-input'}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmerMotDePasse && (
              <span className="error-text">{errors.confirmerMotDePasse.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              {...register('role')}
              className={errors.role ? 'form-input error' : 'form-input'}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            {errors.role && (
              <span className="error-text">{errors.role.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" message="" />
            ) : (
              'Créer un compte'
            )}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            Déjà un compte ?{' '}
            <a href="/login" className="link">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm; 