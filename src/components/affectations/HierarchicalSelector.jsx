import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import {
  Business as BusinessIcon,
  Layers as LayersIcon,
  MeetingRoom as MeetingRoomIcon
} from '@mui/icons-material';
import affectationService from '../../services/affectationService';
import './HierarchicalSelector.css';

const HierarchicalSelector = ({ 
  onSelectionChange, 
  showSalles = true, 
  required = false,
  disabled = false,
  sx = {},
  initialSelection = null
}) => {
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [selectedEtage, setSelectedEtage] = useState(null);
  const [selectedSalle, setSelectedSalle] = useState(null);
  
  const [blocs, setBlocs] = useState([]);
  const [etages, setEtages] = useState([]);
  const [salles, setSalles] = useState([]);
  
  const [loading, setLoading] = useState({
    blocs: false,
    etages: false,
    salles: false
  });
  
  const [error, setError] = useState(null);

  // Charger les blocs au montage du composant
  useEffect(() => {
    loadBlocs();
  }, []);

  // Gérer la sélection initiale
  useEffect(() => {
    if (initialSelection && blocs.length > 0) {
      console.log('🎯 HierarchicalSelector: Tentative de sélection initiale du bloc:', initialSelection.bloc);
      // Trouver et sélectionner le bloc initial
      if (initialSelection.bloc) {
        const bloc = blocs.find(b => b.nom === initialSelection.bloc.nom);
        if (bloc) {
          console.log('✅ HierarchicalSelector: Bloc trouvé et sélectionné:', bloc);
          setSelectedBloc(bloc);
        } else {
          console.log('❌ HierarchicalSelector: Bloc non trouvé. Blocs disponibles:', blocs.map(b => b.nom));
        }
      }
    }
  }, [initialSelection, blocs]);

  // Charger les étages quand un bloc est sélectionné
  useEffect(() => {
    if (selectedBloc) {
      loadEtages(selectedBloc.id);
      setSelectedEtage(null);
      setSelectedSalle(null);
    } else {
      setEtages([]);
      setSalles([]);
    }
  }, [selectedBloc]);

  // Gérer la sélection initiale de l'étage
  useEffect(() => {
    if (initialSelection && initialSelection.etage && etages.length > 0 && selectedBloc) {
      console.log('🎯 HierarchicalSelector: Tentative de sélection initiale de l\'étage:', initialSelection.etage);
      const etage = etages.find(e => e.numero === initialSelection.etage.numero);
      if (etage) {
        console.log('✅ HierarchicalSelector: Étage trouvé et sélectionné:', etage);
        setSelectedEtage(etage);
      } else {
        console.log('❌ HierarchicalSelector: Étage non trouvé. Étages disponibles:', etages.map(e => e.numero));
      }
    }
  }, [initialSelection, etages, selectedBloc]);

  // Charger les salles quand un étage est sélectionné
  useEffect(() => {
    if (selectedEtage && showSalles) {
      loadSalles(selectedEtage.id);
      setSelectedSalle(null);
    } else if (!selectedEtage) {
      setSalles([]);
    }
  }, [selectedEtage, showSalles]);

  // Gérer la sélection initiale de la salle
  useEffect(() => {
    if (initialSelection && initialSelection.salle && salles.length > 0 && selectedEtage) {
      console.log('🎯 HierarchicalSelector: Tentative de sélection initiale de la salle:', initialSelection.salle);
      const salle = salles.find(s => s.idSalle === initialSelection.salle.idSalle);
      if (salle) {
        console.log('✅ HierarchicalSelector: Salle trouvée et sélectionnée:', salle);
        setSelectedSalle(salle);
      } else {
        console.log('❌ HierarchicalSelector: Salle non trouvée. Salles disponibles:', salles.map(s => ({ idSalle: s.idSalle, nomSalle: s.nomSalle })));
      }
    }
  }, [initialSelection, salles, selectedEtage]);

  // Notifier le parent des changements de sélection
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        bloc: selectedBloc,
        etage: selectedEtage,
        salle: selectedSalle
      });
    }
  }, [selectedBloc, selectedEtage, selectedSalle, onSelectionChange]);

  const loadBlocs = async () => {
    try {
      setLoading(prev => ({ ...prev, blocs: true }));
      setError(null);
      const blocsData = await affectationService.getAllBlocs();
      setBlocs(blocsData);
    } catch (err) {
      console.error('Erreur lors du chargement des blocs:', err);
      setError('Erreur lors du chargement des blocs');
    } finally {
      setLoading(prev => ({ ...prev, blocs: false }));
    }
  };

  const loadEtages = async (blocId) => {
    try {
      setLoading(prev => ({ ...prev, etages: true }));
      setError(null);
      const etagesData = await affectationService.getEtagesByBlocId(blocId);
      setEtages(etagesData);
    } catch (err) {
      console.error('Erreur lors du chargement des étages:', err);
      setError('Erreur lors du chargement des étages');
    } finally {
      setLoading(prev => ({ ...prev, etages: false }));
    }
  };

  const loadSalles = async (etageId) => {
    try {
      setLoading(prev => ({ ...prev, salles: true }));
      setError(null);
      const sallesData = await affectationService.getSallesByEtageId(etageId);
      setSalles(sallesData);
    } catch (err) {
      console.error('Erreur lors du chargement des salles:', err);
      setError('Erreur lors du chargement des salles');
    } finally {
      setLoading(prev => ({ ...prev, salles: false }));
    }
  };

  const handleBlocChange = (event) => {
    const blocId = event.target.value;
    const bloc = blocs.find(b => b.id === blocId);
    setSelectedBloc(bloc);
  };

  const handleEtageChange = (event) => {
    const etageId = event.target.value;
    const etage = etages.find(e => e.id === etageId);
    setSelectedEtage(etage);
  };

  const handleSalleChange = (event) => {
    const salleId = event.target.value;
    const salle = salles.find(s => s.idSalle === salleId);
    setSelectedSalle(salle);
  };

  const getSelectionSummary = () => {
    const parts = [];
    if (selectedBloc) parts.push(selectedBloc.nom);
    if (selectedEtage) parts.push(selectedEtage.numero);
    if (selectedSalle && showSalles) parts.push(selectedSalle.nomSalle);
    return parts.join(' - ');
  };

  return (
    <Box sx={{ ...sx }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        {/* Sélection du Bloc */}
        <FormControl fullWidth required={required} disabled={disabled || loading.blocs}>
          <InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon fontSize="small" />
              Bloc
            </Box>
          </InputLabel>
          <Select
            value={selectedBloc?.id || ''}
            onChange={handleBlocChange}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" />
                Bloc
              </Box>
            }
          >
            <MenuItem value="">
              <em>Sélectionner un bloc</em>
            </MenuItem>
            {blocs.map((bloc) => (
              <MenuItem key={bloc.id} value={bloc.id}>
                {bloc.nom}
              </MenuItem>
            ))}
          </Select>
          {loading.blocs && (
            <CircularProgress size={20} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} />
          )}
        </FormControl>

        {/* Sélection de l'Étage */}
        <FormControl fullWidth required={required} disabled={disabled || !selectedBloc || loading.etages}>
          <InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LayersIcon fontSize="small" />
              Étage
            </Box>
          </InputLabel>
          <Select
            value={selectedEtage?.id || ''}
            onChange={handleEtageChange}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersIcon fontSize="small" />
                Étage
              </Box>
            }
          >
            <MenuItem value="">
              <em>Sélectionner un étage</em>
            </MenuItem>
            {etages.map((etage) => (
              <MenuItem key={etage.id} value={etage.id}>
                {etage.numero}
              </MenuItem>
            ))}
          </Select>
          {loading.etages && (
            <CircularProgress size={20} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} />
          )}
        </FormControl>

        {/* Sélection de la Salle (optionnel) */}
        {showSalles && (
          <FormControl fullWidth disabled={disabled || !selectedEtage || loading.salles}>
            <InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MeetingRoomIcon fontSize="small" />
                Salle
              </Box>
            </InputLabel>
            <Select
              value={selectedSalle?.idSalle || ''}
              onChange={handleSalleChange}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MeetingRoomIcon fontSize="small" />
                  Salle
                </Box>
              }
            >
              <MenuItem value="">
                <em>Sélectionner une salle</em>
              </MenuItem>
              {salles.map((salle) => (
                <MenuItem key={salle.idSalle} value={salle.idSalle}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography>{salle.nomSalle}</Typography>
                    <Chip 
                      label={`${salle.capacite} places`} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {loading.salles && (
              <CircularProgress size={20} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} />
            )}
          </FormControl>
        )}

        {/* Résumé de la sélection */}
        {(selectedBloc || selectedEtage || selectedSalle) && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Sélection actuelle:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {getSelectionSummary()}
            </Typography>
            {selectedSalle && (
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={`Type: ${selectedSalle.typeSalle}`} 
                  size="small" 
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`Capacité: ${selectedSalle.capacite} places`} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default HierarchicalSelector;
