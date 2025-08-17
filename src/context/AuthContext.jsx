import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

// État initial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Types d'actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer pour gérer l'état
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

// Créer le contexte
const AuthContext = createContext();

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (email, motDePasse) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const userData = await authService.login(email, motDePasse);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: userData });
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data || 'Erreur de connexion';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage });
      throw error;
    }
  };

  // Fonction d'inscription
  const signup = async (nom, email, motDePasse, role) => {
    dispatch({ type: AUTH_ACTIONS.SIGNUP_START });
    
    try {
      const userData = await authService.signup(nom, email, motDePasse, role);
      dispatch({ type: AUTH_ACTIONS.SIGNUP_SUCCESS, payload: userData });
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data || 'Erreur d\'inscription';
      dispatch({ type: AUTH_ACTIONS.SIGNUP_FAILURE, payload: errorMessage });
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Fonction pour mettre à jour l'utilisateur
  const updateUser = (updatedUser) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: updatedUser });
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}; 