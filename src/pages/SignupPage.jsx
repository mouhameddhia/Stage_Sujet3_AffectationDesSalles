import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Rediriger vers la page d'accueil si déjà connecté
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Afficher le formulaire d'inscription
  return <SignupForm />;
};

export default SignupPage; 