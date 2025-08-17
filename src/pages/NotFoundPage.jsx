import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🔍</div>
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        
        <div className="not-found-actions">
          {isAuthenticated ? (
            <Link to="/" className="home-button">
              🏠 Retour à l'accueil
            </Link>
          ) : (
            <Link to="/login" className="home-button">
              🔐 Se connecter
            </Link>
          )}
        </div>
        
        <div className="not-found-help">
          <p>Vous pouvez essayer de :</p>
          <ul>
            <li>Vérifier l'URL dans la barre d'adresse</li>
            <li>Utiliser le bouton de retour de votre navigateur</li>
            <li>Retourner à la page d'accueil</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 