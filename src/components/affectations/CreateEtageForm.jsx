import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import affectationService from '../../services/affectationService';

const CreateEtageForm = ({ onEtageCreated, onCancel, initialData = null, isEdit = false, sx = {} }) => {
  const [formData, setFormData] = useState({
    numero: initialData?.numero || '',
    blocId: initialData?.blocId || ''
  });
  const [blocs, setBlocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBlocs, setLoadingBlocs] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlocs();
  }, []);

  const loadBlocs = async () => {
    try {
      setLoadingBlocs(true);
      const blocsData = await affectationService.getAllBlocs();
      setBlocs(blocsData);
    } catch (err) {
      console.error('Erreur lors du chargement des blocs:', err);
      setError('Erreur lors du chargement des blocs');
    } finally {
      setLoadingBlocs(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.numero.trim()) {
      setError('Le numéro d\'étage est requis');
      return false;
    }
    if (!formData.blocId) {
      setError('Veuillez sélectionner un bloc');
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
        result = await affectationService.updateEtage(initialData.id, formData);
      } else {
        result = await affectationService.createEtage(formData);
      }

      onEtageCreated(result);
    } catch (err) {
      console.error('Erreur lors de la création/modification de l\'étage:', err);
      console.error('Détails complets de l\'erreur:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = 'Erreur lors de la sauvegarde de l\'étage';
      
      if (err.response?.status === 500) {
        errorMessage = 'Erreur serveur (500). Vérifiez que l\'endpoint /api/etages est implémenté côté backend.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint /api/etages non trouvé. Vérifiez l\'implémentation backend.';
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
          {isEdit ? 'Modifier l\'Étage' : 'Nouvel Étage'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit 
            ? 'Modifiez les informations de l\'étage existant'
            : 'Créez un nouvel étage dans un bloc existant'
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
          <FormControl fullWidth required disabled={loading || loadingBlocs}>
            <InputLabel>Bloc</InputLabel>
            <Select
              name="blocId"
              value={formData.blocId}
              onChange={handleInputChange}
              label="Bloc"
            >
              {blocs.map((bloc) => (
                <MenuItem key={bloc.id} value={bloc.id}>
                  {bloc.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="numero"
            label="Numéro d'Étage"
            value={formData.numero}
            onChange={handleInputChange}
            placeholder="Ex: 1er étage, 2ème étage, Rez-de-chaussée, etc."
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
              disabled={loading || !formData.numero.trim() || !formData.blocId}
            >
              {loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer l\'Étage')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateEtageForm;
