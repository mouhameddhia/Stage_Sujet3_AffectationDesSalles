import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import affectationService from '../../services/affectationService';

const CreateBlocForm = ({ onBlocCreated, onCancel, initialData = null, isEdit = false, sx = {} }) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      setError('Le nom du bloc est requis');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      let result;
      if (isEdit) {
        result = await affectationService.updateBloc(initialData.id, formData);
      } else {
        result = await affectationService.createBloc(formData);
      }

      onBlocCreated(result);
    } catch (err) {
      console.error('Erreur lors de la création/modification du bloc:', err);
      console.error('Détails complets de l\'erreur:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = 'Erreur lors de la sauvegarde du bloc';
      
      if (err.response?.status === 500) {
        errorMessage = 'Erreur serveur (500). Vérifiez que l\'endpoint /api/blocs est implémenté côté backend.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint /api/blocs non trouvé. Vérifiez l\'implémentation backend.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, ...sx }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {isEdit ? 'Modifier le Bloc' : 'Nouveau Bloc'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit 
            ? 'Modifiez les informations du bloc existant'
            : 'Créez un nouveau bloc pour organiser vos salles'
          }
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="nom"
            label="Nom du Bloc"
            value={formData.nom}
            onChange={handleInputChange}
            placeholder="Ex: Bloc A, Bâtiment Principal, etc."
            fullWidth
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Divider />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : (isEdit ? <SaveIcon /> : <AddIcon />)}
              disabled={loading || !formData.nom.trim()}
            >
              {loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer le Bloc')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateBlocForm;
