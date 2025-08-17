import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import AffectationCalendar from '../components/affectations/AffectationCalendar';
import AffectationTableView from '../components/affectations/AffectationTableView';
import ViewSelector from '../components/affectations/ViewSelector';
import affectationService from '../services/affectationService';

const AffectationsPage = () => {
  const location = useLocation();
  const preSelectedRoom = location.state?.preSelectedRoom;
  const fromSmartRecommendations = location.state?.fromSmartRecommendations;
  
  // État pour la gestion des vues
  const [currentView, setCurrentView] = useState('calendar');
  const [affectations, setAffectations] = useState([]);
  const [salles, setSalles] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [etages, setEtages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Charger les données nécessaires
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [affectationsData, sallesData, blocsData, etagesData] = await Promise.all([
          affectationService.getAllAffectations(),
          affectationService.getSallesWithDetails(),
          affectationService.getAllBlocs(),
          affectationService.getAllEtages()
        ]);
        
        setAffectations(affectationsData || []);
        setSalles(sallesData || []);
        setBlocs(blocsData || []);
        setEtages(etagesData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Gérer le changement de vue
  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  // Fonction de rechargement des données
  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      const [affectationsData, sallesData, blocsData, etagesData] = await Promise.all([
        affectationService.getAllAffectations(),
        affectationService.getSallesWithDetails(),
        affectationService.getAllBlocs(),
        affectationService.getAllEtages()
      ]);
      
      setAffectations(affectationsData || []);
      setSalles(sallesData || []);
      setBlocs(blocsData || []);
      setEtages(etagesData || []);
      
      setSnackbar({
        open: true,
        message: 'Données actualisées avec succès !',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'actualisation des données',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Gérer la création d'une nouvelle affectation
  const handleCreateAffectation = async (affectationData) => {
    try {
      const newAffectation = await affectationService.createAffectation(affectationData);
      
      // Recharger les affectations depuis l'API pour avoir les données complètes
      const updatedAffectations = await affectationService.getAllAffectations();
      setAffectations(updatedAffectations || []);
      
      // Notification supprimée - l'affectation apparaît directement dans l'emploi du temps
    } catch (error) {
      console.error('Erreur lors de la création de l\'affectation:', error);
      
      // Même en cas d'erreur, essayer de recharger les affectations
      try {
        const updatedAffectations = await affectationService.getAllAffectations();
        setAffectations(updatedAffectations || []);
      } catch (reloadError) {
        console.error('Erreur lors du rechargement:', reloadError);
      }
      
      // Garder la notification d'erreur pour informer l'utilisateur
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création de l\'affectation',
        severity: 'error'
      });
    }
  };

  return (
    <Box className="affectations-page">
      {/* Page Header */}
      <Paper 
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          📅 Gestion des Affectations
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Planifiez et gérez les affectations de salles avec le calendrier interactif
        </Typography>
        
        {/* Afficher les informations de la salle pré-sélectionnée */}
        {fromSmartRecommendations && preSelectedRoom && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              🎯 Salle Recommandée par l'IA
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              <strong>Salle:</strong> {preSelectedRoom.nomSalle} | 
              <strong> Date:</strong> {preSelectedRoom.date} | 
              <strong> Heure:</strong> {preSelectedRoom.heureDebut} - {preSelectedRoom.heureFin} | 
              <strong> Type:</strong> {preSelectedRoom.typeActivite}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Sélecteur de Vue */}
      <ViewSelector 
        currentView={currentView} 
        onViewChange={handleViewChange} 
      />

      {/* Affichage conditionnel selon la vue sélectionnée */}
      {currentView === 'calendar' ? (
        <AffectationCalendar preSelectedRoom={preSelectedRoom} />
                        ) : (
                                         <AffectationTableView
                       affectations={affectations}
                       salles={salles}
                       blocs={blocs}
                       etages={etages}
                       loading={loading}
                       onCreateAffectation={handleCreateAffectation}
                       onRefresh={handleRefresh}
                     />
                          )}

        {/* Snackbar pour les notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };

export default AffectationsPage;
