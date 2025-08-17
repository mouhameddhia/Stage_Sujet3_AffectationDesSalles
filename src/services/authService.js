import api from '../utils/api';
import { isTokenValid } from '../utils/validation';

class AuthService {
  // Connexion
  async login(email, motDePasse) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        motDePasse,
      });
      
      const { token, nom, role, idUser } = response.data;
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ nom, email, role, idUser }));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Inscription
  async signup(nom, email, motDePasse, role = 'user') {
    try {
      const response = await api.post('/api/auth/signup', {
        nom,
        email,
        motDePasse,
        role,
      });
      
      const { token, role: userRole, idUser } = response.data;
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ nom, email, role: userRole, idUser }));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    
    return token && user && isTokenValid(token);
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem('token');
  }

  // Tester l'authentification avec le backend
  async testAuth() {
    try {
      const response = await api.get('/api/auth/test');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService; 