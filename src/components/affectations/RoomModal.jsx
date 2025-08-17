import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { salleSchema } from '../../utils/validation';
const RoomModal = ({ open, onClose, initialSalle = null, onSubmit }) => {
  // Parent should pass submit handler and loading state (if needed)
  const isEdit = Boolean(initialSalle);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(salleSchema),
    mode: 'onChange',
    defaultValues: {
      nomSalle: '',
      typeSalle: '',
      capacite: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (isEdit) {
        reset({
          nomSalle: initialSalle.nomSalle || '',
          typeSalle: initialSalle.typeSalle || '',
          capacite: initialSalle.capacite || ''
        });
      } else {
        reset({ nomSalle: '', typeSalle: '', capacite: '' });
      }
    }
  }, [open, isEdit, initialSalle, reset]);

  const onSubmitInternal = async (data) => {
    setSubmitError('');
    try {
      const payload = { ...data, capacite: Number(data.capacite) };
      if (onSubmit) {
        await onSubmit(isEdit ? { idSalle: initialSalle.idSalle, ...payload } : payload, { isEdit });
      }
      onClose();
    } catch (err) {
      // Show backend message if present
      const message = err?.response?.data?.message || err?.message || 'Erreur lors de l\'enregistrement de la salle';
      setSubmitError(message);
      // Keep modal open for user to fix input
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{isEdit ? 'Modifier la salle' : 'Ajouter une salle'}</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitInternal)}>
        <DialogContent>
          <Grid container spacing={2}>
            {submitError && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">{submitError}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Nom de la salle"
                fullWidth
                {...register('nomSalle')}
                error={!!errors.nomSalle}
                helperText={errors.nomSalle?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type de salle"
                fullWidth
                {...register('typeSalle')}
                error={!!errors.typeSalle}
                helperText={errors.typeSalle?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Capacité"
                type="number"
                fullWidth
                {...register('capacite')}
                error={!!errors.capacite}
                helperText={errors.capacite?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            {isEdit ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoomModal;

