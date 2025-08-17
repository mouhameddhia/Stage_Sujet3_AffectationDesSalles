import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import affectationService from '../../services/affectationService';
import HierarchicalSelector from './HierarchicalSelector';

const CreateSalleForm = ({ 
  onSalleCreated, 
  onCancel,
  initialData = null,
  isEdit = false,
  sx = {} 
}) => {
  const [formData, setFormData] = useState({
    nomSalle: initialData?.nomSalle || '',
    capacite: initialData?.capacite || '',
    typeSalle: initialData?.typeSalle || '',
    etageId: initialData?.etageId || ''
  });

  const [hierarchicalSelection, setHierarchicalSelection] = useState({
    bloc: null,
    etage: null,
    salle: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const salleTypes = [
    'Salle de cours',
    'Amphithéâtre',
    'Salle de TP',
    'Salle de réunion',
    'Laboratoire',
    'Auditorium',
    'Salle informatique',
    'Salle de conférence'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHierarchicalChange = (selection) => {
    setHierarchicalSelection(selection);
    // Mettre à jour l'etageId si un étage est sélectionné
    if (selection.etage) {
      setFormData(prev => ({
        ...prev,
        etageId: selection.etage.id
      }));
    }
  };

  const validateForm = () => {
    if (!formData.nomSalle.trim()) {
      setError('Le nom de la salle est requis');
      return false;
    }
    if (!formData.capacite || formData.capacite <= 0) {
      setError('La capacité doit être un nombre positif');
      return false;
    }
    if (!formData.typeSalle.trim()) {
      setError('Le type de salle est requis');
      return false;
    }
    if (!formData.etageId) {
      setError('Veuillez sélectionner un étage');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const salleData = {
        nomSalle: formData.nom.trim(),
        capacite: parseInt(formData.capacite),
        typeSalle: formData.type.trim(),
        etageId: formData.etageId
      };

      let result;
      if (isEdit && initialData?.idSalle) {
        result = await affectationService.updateSalle(initialData.idSalle, salleData);
        setSuccess('Salle mise à jour avec succès !');
      } else {
        result = await affectationService.createSalle(salleData);
        setSuccess('Salle créée avec succès !');
      }

      // Réinitialiser le formulaire
      if (!isEdit) {
        setFormData({
          nomSalle: '',
          capacite: '',
          typeSalle: '',
          etageId: ''
        });
        setHierarchicalSelection({
          bloc: null,
          etage: null,
          salle: null
        });
      }

      // Notifier le parent
      if (onSalleCreated) {
        onSalleCreated(result);
      }

    } catch (err) {
      console.error('Erreur lors de la création/mise à jour de la salle:', err);
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde de la salle');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, ...sx }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {isEdit ? 'Modifier la Salle' : 'Créer une Nouvelle Salle'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit 
            ? 'Modifiez les informations de la salle ci-dessous'
            : 'Remplissez les informations pour créer une nouvelle salle'
          }
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Sélection hiérarchique */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Localisation
            </Typography>
            <HierarchicalSelector
              onSelectionChange={handleHierarchicalChange}
              showSalles={false}
              required={true}
              disabled={loading}
            />
          </Box>

          <Divider />

          {/* Informations de la salle */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Informations de la Salle
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom de la salle"
                  value={formData.nomSalle}
                  onChange={(e) => handleInputChange('nomSalle', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: A101, B203, etc."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Capacité"
                  type="number"
                  value={formData.capacite}
                  onChange={(e) => handleInputChange('capacite', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Nombre de places"
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required disabled={loading}>
                  <InputLabel>Type de salle</InputLabel>
                  <Select
                    value={formData.typeSalle}
                    onChange={(e) => handleInputChange('typeSalle', e.target.value)}
                    label="Type de salle"
                  >
                    <MenuItem value="">
                      <em>Sélectionner un type</em>
                    </MenuItem>
                    {salleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Résumé de la sélection */}
          {hierarchicalSelection.etage && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Localisation sélectionnée:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {hierarchicalSelection.bloc?.nom} - {hierarchicalSelection.etage?.numero}
              </Typography>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              startIcon={<CancelIcon />}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.etageId}
              startIcon={loading ? <CircularProgress size={20} /> : (isEdit ? <SaveIcon /> : <AddIcon />)}
            >
              {loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer la salle')}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateSalleForm;
