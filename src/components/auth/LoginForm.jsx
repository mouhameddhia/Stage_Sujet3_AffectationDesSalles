import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import './AuthForms.css';

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      clearError();
      await login(data.email, data.motDePasse);
      
      // Rediriger vers la page demandée ou la page d'accueil
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      // L'erreur est déjà gérée par le contexte
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-form-header">
          <h2>🔐 Connexion</h2>
          <p>Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <ErrorMessage 
            message={error} 
            onClose={clearError}
            type="error"
          />

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
              placeholder="Votre mot de passe"
            />
            {errors.motDePasse && (
              <span className="error-text">{errors.motDePasse.message}</span>
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
              'Se connecter'
            )}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            Pas encore de compte ?{' '}
            <a href="/signup" className="link">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 