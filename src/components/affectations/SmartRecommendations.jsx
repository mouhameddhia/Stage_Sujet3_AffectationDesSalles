import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
  Grid,
  Chip,
  useTheme
} from '@mui/material';
import {
  SmartToy as AIIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Room as RoomIcon,
  AccessTime as TimeIcon,
  TrendingUp as ScoreIcon,
  LocationOn as LocationIcon,
  Group as CapacityIcon
} from '@mui/icons-material';
import affectationService from '../../services/affectationService';
import intelligentDataService from '../../services/intelligentDataService';


const SmartRecommendations = forwardRef(({ 
  requestData, 
  onRoomSelected, 
  onTimeSlotSelected
}, ref) => {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [serviceHealth, setServiceHealth] = useState(null);
  const [intelligentData, setIntelligentData] = useState({
    optimalRoom: null,
    optimalTimeSlot: null,
    aiReasoning: null,
    hasConflicts: false,
    conflictResolution: null,
    alternativeTimeSlots: [],
    optimalStrategy: null,
    capacityAnalysis: null,
    locationAnalysis: null,
    timingAnalysis: null
  });

  useEffect(() => {
    checkServiceHealth();
  }, []);

  // Exposer la méthode getRecommendations au composant parent
  useImperativeHandle(ref, () => ({
    getRecommendations
  }));

  const checkServiceHealth = async () => {
    try {
      const health = await affectationService.checkSmartRecommendationsHealth();
      setServiceHealth(health);
    } catch (error) {
      setServiceHealth({ status: 'unavailable', error: error.message });
    }
  };

  const getRecommendations = async () => {
    if (!requestData || !requestData.date || !requestData.heureDebut || !requestData.heureFin) {
      setError('Veuillez remplir au moins la date et les heures');
      return;
    }

    if (!requestData.typeActivite && !requestData.capaciteRequise && !requestData.descriptionActivite) {
      setError('Veuillez décrire ce que vous voulez faire (type d\'activité, capacité, ou description)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
             // Utiliser le service intelligent qui interroge la vraie base de données
      const result = await intelligentDataService.generateIntelligentRecommendations({
        date: requestData.date,
        heureDebut: requestData.heureDebut,
        heureFin: requestData.heureFin,
        typeActivite: requestData.typeActivite || '',
        capaciteRequise: parseInt(requestData.capaciteRequise) || 20,
        descriptionActivite: requestData.descriptionActivite || '',
        blocPrefere: requestData.blocPrefere || null,
        etagePrefere: requestData.etagePrefere || null,
        typeSallePrefere: requestData.typeSallePrefere || null,
        prioriteCapacite: true,
        prioriteLocalisation: false,
        prioriteHoraire: false
      });
      
      
      
      
      
      setRecommendations(result.recommendations || []);
      
      // Set intelligent data including all the new fields
      setIntelligentData({
        optimalRoom: result.optimalRoom || null,
        optimalTimeSlot: result.optimalTimeSlot || null,
        aiReasoning: result.aiReasoning || null,
        hasConflicts: result.hasConflicts || false,
        conflictResolution: result.conflictResolution || null,
        alternativeTimeSlots: result.alternativeTimeSlots || [],
        optimalStrategy: result.optimalStrategy || null,
        capacityAnalysis: result.capacityAnalysis || null,
        locationAnalysis: result.locationAnalysis || null,
        timingAnalysis: result.timingAnalysis || null
      });
      
      setExpanded(true);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des recommandations intelligentes:', error);
      setError('Impossible de récupérer les recommandations intelligentes. Vérifiez votre connexion à la base de données.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelected = (room) => {
    if (onRoomSelected) {
      onRoomSelected(room);
    }
  };

  const handleTimeSlotSelected = (timeSlot) => {
    if (onTimeSlotSelected) {
      onTimeSlotSelected(timeSlot);
    }
  };

  const handleOptimalSelection = () => {
    if (intelligentData.optimalRoom && intelligentData.optimalTimeSlot) {
      handleRoomSelected(intelligentData.optimalRoom);
      handleTimeSlotSelected(intelligentData.optimalTimeSlot);
    }
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

  const renderOptimalSolution = () => {
    if (!intelligentData.optimalRoom || !intelligentData.optimalTimeSlot) return null;

    return (
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
            🎯 Solution Optimale Trouvée !
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RoomIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                🏢 Salle Recommandée
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                {intelligentData.optimalRoom.nom || `Salle ${intelligentData.optimalRoom.id}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacité: {intelligentData.optimalRoom.capacite} personnes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Localisation: {intelligentData.optimalRoom.localisation || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {intelligentData.optimalRoom.type || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                🕐 Créneau Recommandé
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                {intelligentData.optimalTimeSlot.heureDebut} - {intelligentData.optimalTimeSlot.heureFin}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Score: {intelligentData.optimalTimeSlot.score}/100
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Affichage des scores détaillés */}
        {intelligentData.optimalRoom.breakdown && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
              📊 Analyse Détaillée des Scores
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CapacityIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Capacité
                  </Typography>
                  <Chip 
                    label={`${intelligentData.optimalRoom.breakdown.capacity}/100`}
                    color={getScoreColor(intelligentData.optimalRoom.breakdown.capacity)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <LocationIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Localisation
                  </Typography>
                  <Chip 
                    label={`${intelligentData.optimalRoom.breakdown.location}/100`}
                    color={getScoreColor(intelligentData.optimalRoom.breakdown.location)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <TimeIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Disponibilité
                  </Typography>
                  <Chip 
                    label={`${intelligentData.optimalRoom.breakdown.availability}/100`}
                    color={getScoreColor(intelligentData.optimalRoom.breakdown.availability)}
                    size="small"
                  />
                </Box>
              </Grid>
              <Grid xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <ScoreIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Type
                  </Typography>
                  <Chip 
                    label={`${intelligentData.optimalRoom.breakdown.type}/100`}
                    color={getScoreColor(intelligentData.optimalRoom.breakdown.type)}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Show conflict resolution if AI handled conflicts automatically */}
        {intelligentData.hasConflicts && intelligentData.conflictResolution && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.light' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
              ⚠️ L'IA a détecté et résolu des conflits automatiquement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intelligentData.conflictResolution}
            </Typography>
          </Box>
        )}

        {/* Show alternative time slots if available */}
        {intelligentData.alternativeTimeSlots && intelligentData.alternativeTimeSlots.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'info.main' }}>
              🕐 Créneaux Alternatifs Proposés
            </Typography>
            <Grid container spacing={1}>
              {intelligentData.alternativeTimeSlots.slice(0, 3).map((slot, index) => (
                <Grid xs={12} sm={4} key={index}>
                  <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'white' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {slot.salleNom}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {slot.heureDebut} - {slot.heureFin}
                    </Typography>
                    <Chip 
                      label={`${slot.score}/100`}
                      color={getScoreColor(slot.score)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Show optimal strategy */}
        {intelligentData.optimalStrategy && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.light' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
              🎯 Stratégie Optimale
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intelligentData.optimalStrategy}
            </Typography>
          </Box>
        )}
        
        {intelligentData.aiReasoning && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              🧠 Pourquoi cette recommandation ?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {intelligentData.aiReasoning}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            color="success"
            startIcon={<CheckIcon />}
            onClick={handleOptimalSelection}
            sx={{ px: 4, py: 1.5 }}
          >
            ✅ Sélectionner cette Solution
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderRecommendationItem = (rec, index) => (
    <Paper 
      key={rec.id || index} 
      elevation={2} 
      sx={{ 
        mb: 2, 
        p: 2, 
        border: '1px solid',
        borderColor: rec.isOptimal ? 'success.main' : 'primary.light',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
      onClick={() => handleRoomSelected(rec)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RoomIcon color={rec.isOptimal ? 'success' : 'primary'} sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: rec.isOptimal ? 'success.main' : 'primary.main' }}>
            {rec.nom || `Salle ${rec.id}`}
            {rec.isOptimal && ' 🏆'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={`${rec.score}/100`}
            color={getScoreColor(rec.score)}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {getScoreLabel(rec.score)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">
            <strong>Capacité:</strong> {rec.capacite || 'N/A'} personnes
          </Typography>
        </Grid>
        
        <Grid xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">
            <strong>Localisation:</strong> {rec.localisation || 'N/A'}
          </Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="body2" color="text.secondary">
            <strong>Type:</strong> {rec.type || 'N/A'}
          </Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Disponibilité:</strong>
            </Typography>
            <Chip 
              label={rec.availability?.availabilityStatus || 'N/A'}
              color={rec.availability?.isAvailable ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Show advantages and considerations */}
      {rec.advantages && rec.advantages.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>✅ Avantages:</strong> {rec.advantages.slice(0, 3).join(', ')}
          </Typography>
        </Box>
      )}

      {rec.considerations && rec.considerations.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>⚠️ Considérations:</strong> {rec.considerations.slice(0, 2).join(', ')}
          </Typography>
        </Box>
      )}

      {/* Show why optimal if applicable */}
      {rec.isOptimal && rec.whyOptimal && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>🎯 Pourquoi optimal:</strong> {rec.whyOptimal}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant={rec.isOptimal ? "contained" : "outlined"}
          size="small"
          color={rec.isOptimal ? "success" : "primary"}
          onClick={(e) => {
            e.stopPropagation();
            handleRoomSelected(rec);
          }}
        >
          {rec.isOptimal ? 'Sélectionner cette salle optimale' : 'Sélectionner cette salle'}
        </Button>
      </Box>
    </Paper>
  );

  if (serviceHealth?.status === 'unavailable') {
    return (
      <Paper sx={{ p: 2, bgcolor: 'grey.100', border: '1px solid', borderColor: 'grey.300' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Service de recommandations temporairement indisponible
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AIIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            🤖 Recommandations IA Intelligentes avec Données Réelles
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={checkServiceHealth}
            sx={{ borderRadius: 2 }}
          >
            Vérifier
          </Button>
          
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ 
              borderRadius: 2,
              '&:hover': { bgcolor: 'primary.50' }
            }}
          >
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {error}
            </Typography>
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
            <CircularProgress size={32} sx={{ mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
              🧠 L'IA analyse vos besoins...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
              Analyse de la base de données réelle en cours pour trouver la meilleure solution
            </Typography>
          </Box>
        )}

        {!loading && recommendations.length > 0 && (
          <Box>
            
            
            {/* Solution Optimale - Priorité 1 */}
            {renderOptimalSolution()}
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Autres salles disponibles :
            </Typography>
            
            <Box>
              {recommendations.slice(1).map((rec, index) => (
                <Box key={rec.id || index} sx={{ mb: 2 }}>
                  {renderRecommendationItem(rec, index + 1)}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!loading && recommendations.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Cliquez sur "Demander une Recommandation" pour commencer
            </Typography>
          </Box>
        )}

        {!loading && recommendations.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <AIIcon color="primary" sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
              Prêt à analyser vos besoins !
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Utilisez le bouton "Demander une Recommandation IA" dans le panneau de gauche pour commencer
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, p: 2, bgcolor: 'primary.50', borderRadius: 2, maxWidth: 300, mx: 'auto' }}>
              <AIIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                L'IA attend vos instructions pour analyser la base de données
              </Typography>
            </Box>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
});

export default SmartRecommendations;
