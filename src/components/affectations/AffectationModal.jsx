import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { affectationSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import affectationService from '../../services/affectationService';
import HierarchicalSelector from './HierarchicalSelector';
import SmartRecommendations from './SmartRecommendations';
import './AffectationModal.css';

const AffectationModal = ({
  open,
  mode = 'create',
  affectation = null,
  salles = [],
  typesActivites = [],
  onClose,
  onAffectationCreated,
  loading = false,
  preSelectedRoom = null
}) => {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [selectedSalle, setSelectedSalle] = useState(null);
  const [showSmartRecommendations, setShowSmartRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(affectationSchema),
    mode: 'onChange',
    defaultValues: {
      typeActivite: '',
      idSalle: '',
      date: new Date().toISOString().split('T')[0],
      heureDebut: '',
      heureFin: ''
    }
  });

  // Réinitialiser le formulaire quand la modale s'ouvre
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && affectation) {
        // Pré-remplir avec les données existantes
        const editData = {
          typeActivite: affectation.typeActivite,
          idSalle: affectation.idSalle,
          date: affectation.date,
          heureDebut: affectation.heureDebut,
          heureFin: affectation.heureFin
        };
        reset(editData);
      } else if (preSelectedRoom) {
        // Pré-remplir avec les données de la salle recommandée par l'IA
        const preSelectedData = {
          typeActivite: preSelectedRoom.typeActivite || '',
          idSalle: preSelectedRoom.idSalle || '',
          date: preSelectedRoom.date || new Date().toISOString().split('T')[0],
          heureDebut: preSelectedRoom.heureDebut || '',
          heureFin: preSelectedRoom.heureFin || ''
        };
        reset(preSelectedData);
        
        // Mettre à jour la salle sélectionnée
        if (preSelectedRoom.idSalle) {
          const salle = salles.find(s => s.idSalle === preSelectedRoom.idSalle);
          if (salle) {
            setSelectedSalle(salle);
          }
        }
        

      } else {
        // Réinitialiser pour création normale
        reset({
          typeActivite: '',
          idSalle: '',
          date: new Date().toISOString().split('T')[0],
          heureDebut: '',
          heureFin: ''
        });
      }
      setConflicts([]);
      setSubmitError('');
    }
  }, [open, mode, affectation, reset, preSelectedRoom, salles]);

  // Gérer la sélection d'une salle depuis les recommandations
  const handleRoomSelected = (room) => {
    setValue('idSalle', room.roomId || room.id);
    setSelectedSalle(room);
    setShowSmartRecommendations(false);
  };

  const handleTimeSlotSelected = (timeSlot) => {
    if (timeSlot.heureDebut && timeSlot.heureFin) {
      setValue('heureDebut', timeSlot.heureDebut);
      setValue('heureFin', timeSlot.heureFin);
    }
    if (timeSlot.roomId && !selectedSalle) {
      // If a room is also selected with the time slot
      setValue('idSalle', timeSlot.roomId);
      setSelectedSalle({ idSalle: timeSlot.roomId });
    }
  };

  // Vérifier les conflits en temps réel
  const watchedValues = watch();
  

  
  useEffect(() => {
    if (watchedValues.idSalle && watchedValues.date && watchedValues.heureDebut && watchedValues.heureFin) {
      // Vérification simple : heure fin > heure début
      if (watchedValues.heureFin <= watchedValues.heureDebut) {
        setConflicts(['L\'heure de fin doit être après l\'heure de début']);
      } else {
        setConflicts([]);
      }
    } else {
      setConflicts([]);
    }
  }, [watchedValues]);

  const handleFormSubmit = async (data) => {
    try {
      setSubmitError('');
      
      // Validation des conflits
      if (conflicts.length > 0) {
        setSubmitError('Des conflits ont été détectés. Veuillez corriger les données.');
        return;
      }



      // Formater les données pour l'API - utiliser EXACTEMENT le même format que les recommandations IA
      const submitData = {
        idSalle: Number(data.idSalle) || data.idSalle,
        typeActivite: data.typeActivite,  // ✅ Même format que les recommandations IA
        date: data.date,
        heureDebut: data.heureDebut,      // ✅ Même format que les recommandations IA
        heureFin: data.heureFin           // ✅ Même format que les recommandations IA
      };
      
      // Ajouter les informations utilisateur si nécessaire pour l'approbation
      if (user && !isAdmin) {
        submitData.requesterId = user.id;
        submitData.status = 'pending';
        submitData.requestTime = new Date().toISOString();
      } else if (user && isAdmin) {
        // Admin affectations are automatically approved
        submitData.status = 'approved';
        submitData.approverId = user.id;
        submitData.approvalTime = new Date().toISOString();
      }
      


      
      // Validation côté client avant envoi - utiliser les noms de champs camelCase
      if (!submitData.idSalle) {
        setSubmitError('ID de salle manquant');
        return;
      }
      if (!submitData.typeActivite) {
        setSubmitError('Type d\'activité manquant');
        return;
      }
      if (!submitData.date) {
        setSubmitError('Date manquante');
        return;
      }
      
      // Validation de la date - doit être aujourd'hui ou dans le futur
      const selectedDate = new Date(submitData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer seulement les dates
      
      if (selectedDate < today) {
        setSubmitError('La date doit être aujourd\'hui ou dans le futur');
        return;
      }
      
      if (!submitData.heureDebut) {
        setSubmitError('Heure de début manquante');
        return;
      }
      if (!submitData.heureFin) {
        setSubmitError('Heure de fin manquante');
        return;
      }
      



      // Créer l'affectation via le service

      
      const createdAffectation = await affectationService.createAffectation(submitData);


      // Notifier le composant parent
      if (onAffectationCreated && createdAffectation) {
        await onAffectationCreated(createdAffectation);
      }
      
      // Fermer le modal
      onClose();
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'affectation:', error);
      setSubmitError(error.message || 'Une erreur est survenue lors de la soumission.');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getSalleInfo = (salleId) => {
    return salles.find(s => s.idSalle === salleId);
  };

  // Get status color and info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'warning', label: 'En attente d\'approbation' };
      case 'approved':
        return { color: 'success', label: 'Approuvée' };
      case 'rejected':
        return { color: 'error', label: 'Rejetée' };
      default:
        return { color: 'default', label: status || 'Non défini' };
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2">
          {mode === 'create' ? (
            preSelectedRoom ? '🤖 Nouvelle Affectation - Salle IA Recommandée' : '📅 Nouvelle Affectation'
          ) : (
            '✏️ Modifier l\'Affectation'
          )}
        </Typography>
        
        {preSelectedRoom && (
          <Box mt={1}>
            <Chip
              label="🎯 Recommandation IA"
              color="success"
              size="small"
              icon={<span>🤖</span>}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Salle recommandée par l'IA : <strong>{preSelectedRoom.nomSalle}</strong>
            </Typography>
            
            {/* Informations détaillées de la salle */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                📋 Détails de la Salle Recommandée
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>🏢 Salle:</strong> {preSelectedRoom.nomSalle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>📍 Localisation:</strong> {preSelectedRoom.blocNom || 'N/A'} - {preSelectedRoom.etageNumero || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>🏗️ Type:</strong> {preSelectedRoom.typeSalle || 'N/A'}
                  </Typography>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>👥 Capacité:</strong> {preSelectedRoom.capaciteSalle || preSelectedRoom.capaciteRequise || 'N/A'} personnes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>📅 Date:</strong> {preSelectedRoom.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>🕐 Horaire:</strong> {preSelectedRoom.heureDebut} - {preSelectedRoom.heureFin}
                  </Typography>
                </Grid>
              </Grid>
              
              {preSelectedRoom.typeActivite && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>🎯 Type d'activité:</strong> {preSelectedRoom.typeActivite}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        {mode === 'edit' && affectation?.status && (
          <Box mt={1}>
            <Chip
              label={getStatusInfo(affectation.status).label}
              color={getStatusInfo(affectation.status).color}
              size="small"
            />
            {!isAdmin && affectation.status === 'pending' && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                ⏳ Votre demande est en attente d'approbation par un administrateur
              </Typography>
            )}
            {affectation.status === 'rejected' && affectation.rejectionReason && (
              <Alert severity="error" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Raison du rejet :</strong> {affectation.rejectionReason}
                </Typography>
              </Alert>
            )}
          </Box>
        )}
        {mode === 'create' && !isAdmin && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            ℹ️ En tant qu'utilisateur, votre demande sera soumise à approbation
          </Typography>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Section: Salle */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                🏢 Sélection de la Salle
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {/* Indicateur de salle pré-sélectionnée */}
              {preSelectedRoom && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>✅ Salle pré-sélectionnée par l'IA :</strong> {preSelectedRoom.nomSalle} 
                    ({preSelectedRoom.blocNom || 'N/A'} - {preSelectedRoom.etageNumero || 'N/A'})
                  </Typography>
                </Alert>
              )}
              
              <HierarchicalSelector
                onSelectionChange={(selection) => {
                  setSelectedSalle(selection.salle);
                  if (selection.salle) {
                    setValue('idSalle', selection.salle.idSalle);
                  } else {
                    setValue('idSalle', '');
                  }
                }}
                showSalles={true}
                required={true}
                disabled={loading}
                initialSelection={{
                  bloc: preSelectedRoom?.blocNom ? { nom: preSelectedRoom.blocNom } : null,
                  etage: preSelectedRoom?.etageNumero ? { numero: preSelectedRoom.etageNumero } : null,
                  salle: preSelectedRoom?.idSalle ? { idSalle: preSelectedRoom.idSalle, nomSalle: preSelectedRoom.nomSalle } : null
                }}
                key={`selector-${preSelectedRoom?.idSalle || 'new'}`}
              />
              {errors.idSalle && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.idSalle.message}
                </Alert>
              )}
              
              {/* Smart Recommendations */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setShowSmartRecommendations(!showSmartRecommendations)}
                  sx={{ mb: 1 }}
                >
                  🤖 {showSmartRecommendations ? 'Masquer' : 'Afficher'} les recommandations IA
                </Button>
                
                                            {showSmartRecommendations && (
                              <SmartRecommendations
                                requestData={{
                                  date: watchedValues.date,
                                  heureDebut: watchedValues.heureDebut,
                                  heureFin: watchedValues.heureFin,
                                  typeActivite: watchedValues.typeActivite,
                                  capaciteRequise: selectedSalle?.capacite || 0,
                                  descriptionActivite: watchedValues.typeActivite,
                                  blocPrefere: selectedSalle?.blocNom || ''
                                }}
                                onRoomSelected={handleRoomSelected}
                                onTimeSlotSelected={handleTimeSlotSelected}
                                showConflictResolution={conflicts.length > 0}
                                conflictData={conflicts.length > 0 ? {
                                  date: watchedValues.date,
                                  heureDebut: watchedValues.heureDebut,
                                  heureFin: watchedValues.heureFin,
                                  typeActivite: watchedValues.typeActivite,
                                  conflicts: conflicts
                                } : null}
                              />
                            )}
              </Box>
            </Grid>

            {/* Section: Informations de l'activité */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                🎯 Type d'activité
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="typeActivite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Type d'activité"
                    placeholder="Ex: Cours de mathématiques, Réunion équipe, Formation..."
                    fullWidth
                    error={!!errors.typeActivite}
                    helperText={errors.typeActivite?.message || "Décrivez le type d'activité"}
                    required
                  />
                )}
              />
            </Grid>

            {/* Section: Horaire */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                🕐 Horaire
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    fullWidth
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Controller
                name="heureDebut"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Heure début"
                    type="time"
                    fullWidth
                    error={!!errors.heureDebut}
                    helperText={errors.heureDebut?.message}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Controller
                name="heureFin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Heure fin"
                    type="time"
                    fullWidth
                    error={!!errors.heureFin}
                    helperText={errors.heureFin?.message}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                )}
              />
            </Grid>

            {/* Conflits */}
            {conflicts.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  <Typography variant="subtitle2" gutterBottom>
                    Conflits détectés :
                  </Typography>
                  {conflicts.map((conflict, index) => (
                    <Typography key={index} variant="body2">
                      • {conflict}
                    </Typography>
                  ))}
                </Alert>
              </Grid>
            )}

            {/* Erreur de soumission */}
            {submitError && (
              <Grid item xs={12}>
                <Alert severity="error">
                  {submitError}
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCancel} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !isValid || conflicts.length > 0}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Enregistrement...' : (
              mode === 'create' 
                ? (isAdmin ? 'Créer' : 'Soumettre pour approbation')
                : 'Modifier'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AffectationModal; 