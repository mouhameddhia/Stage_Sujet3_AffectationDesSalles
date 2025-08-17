import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Stack,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Layers as LayersIcon,
  MeetingRoom as MeetingRoomIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import affectationService from '../services/affectationService';
import HierarchicalSelector from '../components/affectations/HierarchicalSelector';
import SalleCard from '../components/affectations/SalleCard';
import CreateSalleForm from '../components/affectations/CreateSalleForm';
import CreateBlocForm from '../components/affectations/CreateBlocForm';
import CreateEtageForm from '../components/affectations/CreateEtageForm';


const SallesManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [salles, setSalles] = useState([]);
  const [blocs, setBlocs] = useState([]);
  const [etages, setEtages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [currentTab, setCurrentTab] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateBlocForm, setShowCreateBlocForm] = useState(false);
  const [showCreateEtageForm, setShowCreateEtageForm] = useState(false);
  const [editingSalle, setEditingSalle] = useState(null);
  const [editingBloc, setEditingBloc] = useState(null);
  const [editingEtage, setEditingEtage] = useState(null);
  const [filterSelection, setFilterSelection] = useState({
    bloc: null,
    etage: null,
    salle: null
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
             // Chargement séquentiel pour mieux diagnostiquer les erreurs
      let sallesData = [];
      let blocsData = [];
      let etagesData = [];
      
      try {
        console.log('🔄 Chargement des salles...');
        sallesData = await affectationService.getSallesWithDetails();
        console.log('✅ Salles chargées:', sallesData);
        console.log('📊 Structure des salles:', sallesData.map(s => ({
          idSalle: s.idSalle,
          nomSalle: s.nomSalle,
          typeSalle: s.typeSalle,
          capacite: s.capacite,
          blocNom: s.blocNom,
          etageNumero: s.etageNumero
        })));
      } catch (err) {
        console.error('❌ Erreur chargement salles:', err);
        // Continuer avec les autres données
      }
      
      try {
        console.log('🔄 Chargement des blocs...');
        blocsData = await affectationService.getAllBlocs();
        console.log('✅ Blocs chargés:', blocsData);
      } catch (err) {
        console.error('❌ Erreur chargement blocs:', err);
        // Continuer avec les autres données
      }
      
      try {
        console.log('🔄 Chargement des étages...');
        etagesData = await affectationService.getAllEtages();
        console.log('✅ Étages chargés:', etagesData);
      } catch (err) {
        console.error('❌ Erreur chargement étages:', err);
        // Continuer avec les autres données
      }
      
      setSalles(sallesData);
      setBlocs(blocsData);
      setEtages(etagesData);
       
       
       
                const message = `Chargé ${sallesData.length} salles, ${blocsData.length} blocs et ${etagesData.length} étages`;
         setSuccess(message);
      
    } catch (err) {
      console.error('❌ Erreur générale lors du chargement des données:', err);
      
      // Message d'erreur plus informatif
      let errorMessage = 'Erreur lors du chargement des données';
      
      if (err.response?.status === 404) {
        errorMessage = 'Les endpoints backend ne sont pas encore implémentés. Utilisation du mode développement avec des données de test.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Erreur serveur (500). Vérifiez que le backend est démarré et que les endpoints sont implémentés.';
      } else if (err.message?.includes('Network Error')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSalle = async (newSalle) => {
    try {
      // Recharger les données pour avoir la hiérarchie complète
      await loadData();
      setShowCreateForm(false);
      setSuccess('Salle créée avec succès !');
    } catch (err) {
      setError('Erreur lors de la création de la salle');
    }
  };

  const handleEditSalle = (salle) => {
    setEditingSalle(salle);
    setShowCreateForm(true);
  };

  const handleUpdateSalle = async (updatedSalle) => {
    try {
      // Recharger les données pour avoir la hiérarchie complète
      await loadData();
      setShowCreateForm(false);
      setEditingSalle(null);
      setSuccess('Salle mise à jour avec succès !');
    } catch (err) {
      setError('Erreur lors de la mise à jour de la salle');
    }
  };

  const handleDeleteSalle = async (salle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la salle "${salle.nomSalle}" ?`)) {
      try {
        await affectationService.deleteSalle(salle.idSalle);
        // Recharger les données pour avoir la hiérarchie complète
        await loadData();
        setSuccess('Salle supprimée avec succès !');
      } catch (err) {
        setError('Erreur lors de la suppression de la salle');
      }
    }
  };

  const handleCreateBloc = async (newBloc) => {
    try {
      // Après création, on recharge depuis le backend pour vérifier la persistance réelle
      await loadData();
      setShowCreateBlocForm(false);
      setEditingBloc(null);
      setSuccess('Bloc créé avec succès !');
    } catch (err) {
      setError('Erreur lors de la création du bloc');
    }
  };

  const handleEditBloc = (bloc) => {
    setEditingBloc(bloc);
    setShowCreateBlocForm(true);
  };

  const handleUpdateBloc = async (updatedBloc) => {
    try {
      await loadData();
      setShowCreateBlocForm(false);
      setEditingBloc(null);
      setSuccess('Bloc mis à jour avec succès !');
    } catch (err) {
      setError('Erreur lors de la mise à jour du bloc');
    }
  };

  const handleDeleteBloc = async (bloc) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le bloc "${bloc.nom}" ? Cette action supprimera également tous les étages et salles associés.`)) {
      try {
        await affectationService.deleteBloc(bloc.id);
        setBlocs(prev => prev.filter(b => b.id !== bloc.id));
        // Also remove salles from this bloc
        setSalles(prev => prev.filter(s => s.blocNom !== bloc.nom));
        setSuccess('Bloc supprimé avec succès !');
      } catch (err) {
        setError('Erreur lors de la suppression du bloc');
      }
    }
  };

  const handleCreateEtage = async (newEtage) => {
    try {
      await loadData();
      setShowCreateEtageForm(false);
      setEditingEtage(null);
      setSuccess('Étage créé avec succès !');
    } catch (err) {
      setError('Erreur lors de la création de l\'étage');
    }
  };

  const handleEditEtage = (etage) => {
    setEditingEtage(etage);
    setShowCreateEtageForm(true);
  };

  const handleUpdateEtage = async (updatedEtage) => {
    try {
      await loadData();
      setShowCreateEtageForm(false);
      setEditingEtage(null);
      setSuccess('Étage mis à jour avec succès !');
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'étage');
    }
  };

  const handleDeleteEtage = async (etage) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étage "${etage.numero}" ? Cette action supprimera également toutes les salles associées.`)) {
      try {
        await affectationService.deleteEtage(etage.id);
        setEtages(prev => prev.filter(e => e.id !== etage.id));
        // Also remove salles from this etage
        setSalles(prev => prev.filter(s => s.etageId !== etage.id));
        setSuccess('Étage supprimé avec succès !');
      } catch (err) {
        setError('Erreur lors de la suppression de l\'étage');
      }
    }
  };

  const handleFilterChange = (selection) => {
    setFilterSelection(selection);
  };

  const getFilteredSalles = () => {
    let filtered = salles;

    if (filterSelection.bloc) {
      filtered = filtered.filter(salle => {
        const salleBlocNom = salle.blocNom || 'Non défini';
        return salleBlocNom === filterSelection.bloc.nom;
      });
    }

    if (filterSelection.etage) {
      filtered = filtered.filter(salle => {
        const salleEtageNumero = salle.etageNumero || 'Non défini';
        return salleEtageNumero === filterSelection.etage.numero;
      });
    }

    return filtered;
  };

  const getSallesByBloc = (blocNom) => {
    return salles.filter(salle => salle.blocNom === blocNom);
  };

  const getSallesByType = (type) => {
    return salles.filter(salle => salle.typeSalle === type);
  };

  const getSalleTypes = () => {
    return [...new Set(salles.map(salle => salle.typeSalle))];
  };

  const renderAllSallesTab = () => (
    <Box>
             <Box sx={{ mb: 3 }}>
         <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
           Filtres
         </Typography>
         <HierarchicalSelector
           onSelectionChange={handleFilterChange}
           showSalles={false}
           required={false}
         />
         
         
       </Box>

      <Grid container spacing={3}>
        {getFilteredSalles().map((salle) => (
          <Grid item xs={12} md={6} lg={4} key={salle.idSalle}>
            <SalleCard
              salle={salle}
              variant="compact"
              showActions={isAdmin}
              onEdit={handleEditSalle}
              onDelete={handleDeleteSalle}
            />
          </Grid>
        ))}
      </Grid>

      {getFilteredSalles().length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune salle trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filterSelection.bloc || filterSelection.etage 
              ? 'Essayez de modifier vos filtres'
              : 'Aucune salle n\'est disponible'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderByBlocTab = () => (
    <Box>
      <Grid container spacing={3}>
        {blocs.map((bloc) => {
          const blocSalles = getSallesByBloc(bloc.nom);
          return (
            <Grid item xs={12} key={bloc.id}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {bloc.nom}
                    </Typography>
                    <Chip 
                      label={`${blocSalles.length} salles`} 
                      size="small" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  
                  {isAdmin && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditBloc(bloc)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteBloc(bloc)}
                      >
                        Supprimer
                      </Button>
                    </Stack>
                  )}
                </Box>

                {blocSalles.length > 0 ? (
                  <Grid container spacing={2}>
                    {blocSalles.map((salle) => (
                      <Grid item xs={12} md={6} lg={4} key={salle.idSalle}>
                        <SalleCard
                          salle={salle}
                          variant="list"
                          showActions={isAdmin}
                          onEdit={handleEditSalle}
                          onDelete={handleDeleteSalle}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aucune salle dans ce bloc
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderByTypeTab = () => (
    <Box>
      <Grid container spacing={3}>
        {getSalleTypes().map((type) => {
          const typeSalles = getSallesByType(type);
          return (
            <Grid item xs={12} key={type}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MeetingRoomIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {type}
                  </Typography>
                  <Chip 
                    label={`${typeSalles.length} salles`} 
                    size="small" 
                    sx={{ ml: 2 }}
                  />
                </Box>

                                  <Grid container spacing={2}>
                    {typeSalles.map((salle) => (
                      <Grid item xs={12} md={6} lg={4} key={salle.idSalle}>
                        <SalleCard
                          salle={salle}
                          variant="list"
                          showActions={isAdmin}
                          onEdit={handleEditSalle}
                          onDelete={handleDeleteSalle}
                        />
                      </Grid>
                    ))}
                  </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderBlocsEtagesTab = () => (
    <Box>
      <Grid container spacing={3}>
        {/* Blocs Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Blocs ({blocs.length})
                </Typography>
              </Box>
              {isAdmin && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateBlocForm(true)}
                >
                  Nouveau Bloc
                </Button>
              )}
            </Box>

            <Stack spacing={2}>
              {blocs.map((bloc) => (
                <Paper key={bloc.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {bloc.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getSallesByBloc(bloc.nom).length} salles
                      </Typography>
                    </Box>
                    {isAdmin && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEditBloc(bloc)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteBloc(bloc)}
                        >
                          Supprimer
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Paper>
              ))}
              
              {blocs.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Aucun bloc disponible
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Étages Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LayersIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Étages ({etages.length})
                </Typography>
              </Box>
              {isAdmin && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateEtageForm(true)}
                >
                  Nouvel Étage
                </Button>
              )}
            </Box>

            <Stack spacing={2}>
              {etages.map((etage) => {
                const bloc = blocs.find(b => b.id === etage.blocId);
                return (
                  <Paper key={etage.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {etage.numero}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bloc: {bloc?.nom || 'Inconnu'} • {salles.filter(s => s.etageId === etage.id).length} salles
                        </Typography>
                      </Box>
                      {isAdmin && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEditEtage(etage)}
                          >
                            Modifier
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteEtage(etage)}
                          >
                            Supprimer
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  </Paper>
                );
              })}
              
              {etages.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Aucun étage disponible
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderAllSallesTab();
      case 1:
        return renderByBlocTab();
      case 2:
        return renderByTypeTab();
      case 3:
        return renderBlocsEtagesTab();
      default:
        return renderAllSallesTab();
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Gestion des Salles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez les salles, blocs et étages de votre établissement
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadData}
              disabled={loading}
            >
              Actualiser
            </Button>
            
                         {isAdmin && (
               <>
                 <Button
                   variant="outlined"
                   startIcon={<BusinessIcon />}
                   onClick={() => setShowCreateBlocForm(true)}
                   sx={{ minWidth: 150 }}
                 >
                   Nouveau Bloc
                 </Button>
                 <Button
                   variant="outlined"
                   startIcon={<LayersIcon />}
                   onClick={() => setShowCreateEtageForm(true)}
                   sx={{ minWidth: 150 }}
                 >
                   Nouvel Étage
                 </Button>
                 <Button
                   variant="contained"
                   startIcon={<AddIcon />}
                   onClick={() => setShowCreateForm(true)}
                   sx={{ minWidth: 200 }}
                 >
                   Nouvelle Salle
                 </Button>
                 
                 {/* Test API Button - Only in development */}
                 {process.env.NODE_ENV === 'development' && (
                   <Button
                     variant="outlined"
                     color="secondary"
                     onClick={() => affectationService.testSallesEndpointOnly()}
                     sx={{ minWidth: 'auto' }}
                   >
                     🧪 Test API
                   </Button>
                 )}
               </>
             )}
          </Stack>
        </Box>
      </Paper>

      {/* Status Messages */}
      {loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          Chargement des données...
        </Alert>
      )}

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



      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ px: 2 }}
        >
          <Tab 
            label="Toutes les Salles" 
            icon={<MeetingRoomIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Par Bloc" 
            icon={<BusinessIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Par Type" 
            icon={<FilterIcon />} 
            iconPosition="start"
          />
          {isAdmin && (
            <Tab 
              label="Gestion Blocs/Étages" 
              icon={<LayersIcon />} 
              iconPosition="start"
            />
          )}
        </Tabs>
      </Paper>

      {/* Content */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        {renderTabContent()}
      </Paper>

      {/* Create/Edit Salle Modal */}
      <Dialog
        open={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingSalle(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CreateSalleForm
            onSalleCreated={editingSalle ? handleUpdateSalle : handleCreateSalle}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingSalle(null);
            }}
            initialData={editingSalle}
            isEdit={!!editingSalle}
          />
        </DialogContent>
      </Dialog>

      {/* Create/Edit Bloc Modal */}
      <Dialog
        open={showCreateBlocForm}
        onClose={() => {
          setShowCreateBlocForm(false);
          setEditingBloc(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CreateBlocForm
            onBlocCreated={editingBloc ? handleUpdateBloc : handleCreateBloc}
            onCancel={() => {
              setShowCreateBlocForm(false);
              setEditingBloc(null);
            }}
            initialData={editingBloc}
            isEdit={!!editingBloc}
          />
        </DialogContent>
      </Dialog>

      {/* Create/Edit Etage Modal */}
      <Dialog
        open={showCreateEtageForm}
        onClose={() => {
          setShowCreateEtageForm(false);
          setEditingEtage(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CreateEtageForm
            onEtageCreated={editingEtage ? handleUpdateEtage : handleCreateEtage}
            onCancel={() => {
              setShowCreateEtageForm(false);
              setEditingEtage(null);
            }}
            initialData={editingEtage}
            isEdit={!!editingEtage}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SallesManagementPage;
