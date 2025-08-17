import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Alert,
  Chip,
  Divider,
  useTheme,
  Container
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Lightbulb as SuggestionIcon,
  TrendingUp as ScoreIcon,
  LocationOn as LocationIcon,
  Schedule as TimeIcon,
  Group as CapacityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SmartRecommendations from '../components/affectations/SmartRecommendations';

const SmartRecommendationsPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [requestData, setRequestData] = useState({
    date: new Date().toISOString().split('T')[0],
    heureDebut: '09:00',
    heureFin: '11:00',
    typeActivite: '',
    capaciteRequise: '',
    descriptionActivite: ''
  });

  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleInputChange = (field, value) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoomSelected = (room) => {
    console.log('🏢 Salle sélectionnée:', room);
    setSelectedRoom(room);
  };

  const handleTimeSlotSelected = (timeSlot) => {
    // Update the request data with the selected time slot
    setRequestData(prev => ({
      ...prev,
      heureDebut: timeSlot.heureDebut,
      heureFin: timeSlot.heureFin
    }));

    // If a room is also selected with the time slot
    if (timeSlot.roomId) {
      setSelectedRoom({
        roomId: timeSlot.roomId,
        roomName: `Salle ${timeSlot.roomId}`,
        score: timeSlot.score || 85
      });
    }
  };

  const handleCreateAffectation = (room) => {
    // Prepare affectation data from the selected room and request
    const affectationData = {
      idSalle: room.id || room.roomId,
      nomSalle: room.nom || room.roomName,
      date: requestData.date,
      heureDebut: requestData.heureDebut,
      heureFin: requestData.heureFin,
      typeActivite: requestData.typeActivite || 'Activité',
      capaciteRequise: requestData.capaciteRequise || room.capacite || 20,
      descriptionActivite: requestData.descriptionActivite || '',
      // Additional room details
      blocNom: room.blocNom,
      etageNumero: room.etageNumero,
      typeSalle: room.type,
      capaciteSalle: room.capacite,
      // Score and reasoning from AI
      score: room.score,
      whyOptimal: room.whyOptimal,
      localisation: room.localisation
    };

    console.log('📅 Redirection vers la page des affectations avec les données:', affectationData);
    
    // Rediriger vers la page des affectations avec les données pré-remplies
    navigate('/affectations', { 
      state: { 
        preSelectedRoom: affectationData,
        fromSmartRecommendations: true
      }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Très bon';
    if (score >= 50) return 'Bon';
    return 'Acceptable';
  };

  const renderSelectedRoom = () => {
    if (!selectedRoom) return null;

    return (
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
        <Typography variant="h6" sx={{ color: 'success.main', mb: 2 }}>
          ✅ Salle Sélectionnée
        </Typography>
        
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {selectedRoom.nom || selectedRoom.roomName || `Salle ${selectedRoom.id || selectedRoom.roomId}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {selectedRoom.id || selectedRoom.roomId || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {selectedRoom.type || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScoreIcon color="action" />
              <Chip 
                label={`${selectedRoom.score || 0}%`}
                color={getScoreColor(selectedRoom.score || 0)}
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                {getScoreLabel(selectedRoom.score || 0)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip 
            icon={<CapacityIcon />}
            label={`Capacité: ${selectedRoom.capacite || selectedRoom.capacity || 'N/A'} personnes`}
            size="small"
            variant="outlined"
          />
          <Chip 
            icon={<LocationIcon />}
            label={`${selectedRoom.localisation || selectedRoom.location || 'N/A'}`}
            size="small"
            variant="outlined"
          />
          <Chip 
            icon={<TimeIcon />}
            label={selectedRoom.availability?.availabilityStatus || 'Disponible'}
            size="small"
            color={selectedRoom.availability?.isAvailable ? 'success' : 'warning'}
          />
        </Box>

        {selectedRoom.whyOptimal && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>🎯 Pourquoi cette salle :</strong> {selectedRoom.whyOptimal}
            </Typography>
          </Box>
        )}

        {/* Affectation Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<TimeIcon />}
            onClick={() => handleCreateAffectation(selectedRoom)}
            sx={{ px: 4, py: 1.5 }}
          >
            📅 Créer une Affectation avec cette Salle
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: 'primary.50', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AIIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Recommandations IA Simples
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Écrivez ce que vous voulez, l'IA trouve la meilleure salle et le meilleur créneau
        </Typography>
      </Paper>

      <Grid container spacing={4} justifyContent="center">
        {/* Configuration Panel - LIBRE pour écrire ce que vous voulez */}
        <Grid xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content', bgcolor: 'background.paper' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center', justifyContent: 'center' }}>
              <SuggestionIcon color="primary" />
              Écrivez vos Besoins
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  value={requestData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>

              <Grid xs={6}>
                <TextField
                  label="Heure début"
                  type="time"
                  value={requestData.heureDebut}
                  onChange={(e) => handleInputChange('heureDebut', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>

              <Grid xs={6}>
                <TextField
                  label="Heure fin"
                  type="time"
                  value={requestData.heureFin}
                  onChange={(e) => handleInputChange('heureFin', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Type d'activité"
                  value={requestData.typeActivite}
                  onChange={(e) => handleInputChange('typeActivite', e.target.value)}
                  fullWidth
                  placeholder="Écrivez ce que vous voulez faire..."
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Capacité requise"
                  value={requestData.capaciteRequise}
                  onChange={(e) => handleInputChange('capaciteRequise', e.target.value)}
                  fullWidth
                  placeholder="Écrivez le nombre de personnes ou vos besoins..."
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  label="Description détaillée"
                  value={requestData.descriptionActivite}
                  onChange={(e) => handleInputChange('descriptionActivite', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Décrivez en détail ce que vous voulez faire, vos préférences, équipements nécessaires..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 3, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.light' }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                <strong>💡 Écrivez librement ce que vous voulez :</strong>
                <br />• "Cours de mathématiques avec projecteur pour 25 étudiants"
                <br />• "Réunion équipe marketing, besoin tableau blanc, 15 personnes"
                <br />• "Formation Excel, salle informatique, 30 participants"
                <br />• L'IA comprend et trouve la meilleure solution !
              </Typography>
            </Box>

            {/* Bouton de recommandation directement accessible */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                startIcon={<AIIcon />}
                data-testid="main-recommendation-button"
                onClick={() => {
                  // Déclencher directement les recommandations
                  const smartRecommendationsComponent = document.querySelector('[data-smart-recommendations]');
                  if (smartRecommendationsComponent) {
                    smartRecommendationsComponent.scrollIntoView({ behavior: 'smooth' });
                  }
                  // Déclencher automatiquement les recommandations après un court délai
                  setTimeout(() => {
                    // Appeler directement la méthode du composant enfant
                    if (window.smartRecommendationsRef && window.smartRecommendationsRef.getRecommendations) {
                      window.smartRecommendationsRef.getRecommendations();
                    }
                  }, 500);
                }}
                disabled={!requestData?.date || !requestData?.heureDebut || !requestData?.heureFin || 
                         (!requestData?.typeActivite && !requestData?.capaciteRequise && !requestData?.descriptionActivite)}
                sx={{ 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  boxShadow: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-3px)',
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)',
                    transform: 'none',
                    boxShadow: 1
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                🤖 Demander une Recommandation IA
              </Button>
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
                Remplissez au moins la date, l'heure et décrivez votre activité
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Smart Recommendations Panel */}
        <Grid xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }} data-smart-recommendations>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center', justifyContent: 'center' }}>
              <AIIcon color="primary" />
              Recommandations IA
            </Typography>

            <SmartRecommendations
              requestData={requestData}
              onRoomSelected={handleRoomSelected}
              onTimeSlotSelected={handleTimeSlotSelected}
              ref={(ref) => {
                // Stocker la référence pour pouvoir appeler les méthodes du composant
                if (ref) {
                  window.smartRecommendationsRef = ref;
                }
              }}
            />

            {renderSelectedRoom()}
          </Paper>
        </Grid>
      </Grid>

      {/* Information Panel - LIBRE */}
      <Paper elevation={1} sx={{ p: 4, mt: 4, bgcolor: 'info.50', borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'info.main', textAlign: 'center' }}>
          ℹ️ Comment ça fonctionne ?
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <SuggestionIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Libre
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Écrivez librement ce que vous voulez faire
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <AIIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Intelligent
              </Typography>
              <Typography variant="body2" color="text.secondary">
                L'IA comprend et trouve la meilleure solution
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <AIIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Automatique
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Détecte et résout les conflits automatiquement
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SmartRecommendationsPage;
