import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
  Schedule as PendingIcon,
  Person as PersonIcon,
  Room as RoomIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import affectationService from '../../services/affectationService';
import './AdminApprovalDashboard.css';

const AdminApprovalDashboard = ({ onAffectationStatusChanged }) => {
  const { user } = useAuth();
  const [pendingAffectations, setPendingAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [rejectionDialog, setRejectionDialog] = useState({
    open: false,
    affectationId: null,
    rejectionReason: ''
  });

  // Load pending affectations
  const loadPendingAffectations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await affectationService.getPendingAffectations();
      setPendingAffectations(data);
      setSuccess(`Chargé ${data.length} affectations en attente`);
    } catch (err) {
      console.error('Error loading pending affectations:', err);
      setError('Erreur lors du chargement des affectations en attente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingAffectations();
  }, []);

  // Handle approval
  const handleApprove = async (affectationId) => {
    try {
      console.log('🔄 Approbation de l\'affectation:', affectationId);
      console.log('👤 Approbateur:', user?.id);
      
      const result = await affectationService.approveAffectation(affectationId, {
        approverId: user?.id
      });
      
      console.log('✅ Résultat de l\'approbation:', result);
      setSuccess('Affectation approuvée avec succès');
      loadPendingAffectations(); // Refresh the list
      
      // Notifier le calendrier de rafraîchir ses données
      if (onAffectationStatusChanged) {
        onAffectationStatusChanged();
      }
    } catch (err) {
      console.error('❌ Erreur lors de l\'approbation:', err);
      console.error('❌ Détails de l\'erreur:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      setError(`Erreur lors de l'approbation: ${err.message}`);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    const { affectationId, rejectionReason } = rejectionDialog;
    if (!rejectionReason.trim()) {
      setError('Veuillez fournir une raison de rejet');
      return;
    }

    try {
      console.log('🔄 Rejet de l\'affectation:', affectationId);
      console.log('📝 Raison du rejet:', rejectionReason);
      
      const result = await affectationService.rejectAffectation(affectationId, rejectionReason);
      
      console.log('✅ Résultat du rejet:', result);
      setSuccess('Affectation rejetée avec succès');
      setRejectionDialog({ open: false, affectationId: null, rejectionReason: '' });
      loadPendingAffectations(); // Refresh the list
      
      // Notifier le calendrier de rafraîchir ses données
      if (onAffectationStatusChanged) {
        onAffectationStatusChanged();
      }
    } catch (err) {
      console.error('❌ Erreur lors du rejet:', err);
      console.error('❌ Détails de l\'erreur:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      setError(`Erreur lors du rejet: ${err.message}`);
    }
  };

  // Open rejection dialog
  const openRejectionDialog = (affectationId) => {
    setRejectionDialog({ open: true, affectationId, rejectionReason: '' });
  };

  // Close rejection dialog
  const closeRejectionDialog = () => {
    setRejectionDialog({ open: false, affectationId: null, rejectionReason: '' });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date and time
  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box className="admin-approval-dashboard">
      {/* Header */}
      <Card className="dashboard-header">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                🎯 Tableau d'Approbation des Affectations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gérez les demandes d'affectation en attente d'approbation
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPendingAffectations}
              disabled={loading}
            >
              Actualiser
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {pendingAffectations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En attente
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {new Set(pendingAffectations.map(a => a.requesterId)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Demandeurs uniques
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="stat-card">
            <CardContent>
              <Box display="flex" alignItems="center">
                <RoomIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {new Set(pendingAffectations.map(a => a.idSalle)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Salles concernées
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Pending Affectations Table */}
      <Paper className="approval-table-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Demandeur</strong></TableCell>
                <TableCell><strong>Salle</strong></TableCell>
                <TableCell><strong>Activité</strong></TableCell>
                <TableCell><strong>Date & Heure</strong></TableCell>
                <TableCell><strong>Durée</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingAffectations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box py={4}>
                      <Typography variant="h6" color="text.secondary">
                        🎉 Aucune affectation en attente d'approbation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Toutes les demandes ont été traitées
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                pendingAffectations.map((affectation) => (
                  <TableRow key={affectation.idaffectation} className="affectation-row">
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {affectation.requesterName || 'Utilisateur'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {affectation.requesterEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <RoomIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {affectation.nomSalle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Capacité: {affectation.capaciteSalle}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={affectation.typeactivite}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <EventIcon sx={{ mr: 1, color: 'info.main' }} />
                        <Box>
                          <Typography variant="body2">
                            {formatDateTime(affectation.date, affectation.heuredebut)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Fin: {affectation.heurefin}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {affectation.duree || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={affectation.status || 'pending'}
                        color={getStatusColor(affectation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Approuver">
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(affectation.idaffectation)}
                            size="small"
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejeter">
                          <IconButton
                            color="error"
                            onClick={() => openRejectionDialog(affectation.idaffectation)}
                            size="small"
                          >
                            <RejectIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.open} onClose={closeRejectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Rejeter l'affectation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Veuillez fournir une raison pour le rejet de cette affectation :
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Raison du rejet"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={rejectionDialog.rejectionReason}
            onChange={(e) => setRejectionDialog(prev => ({
              ...prev,
              rejectionReason: e.target.value
            }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectionDialog}>Annuler</Button>
          <Button onClick={handleReject} color="error" variant="contained">
            Rejeter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminApprovalDashboard;
