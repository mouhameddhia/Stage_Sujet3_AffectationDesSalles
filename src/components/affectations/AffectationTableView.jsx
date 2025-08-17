import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
  Tooltip,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Collapse
} from '@mui/material';
import './AffectationTableView.css';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Room as RoomIcon,
  AccessTime as TimeIcon,
  Event as EventIcon,
  CheckCircle as AvailableIcon,
  Warning as BusyIcon,
  Info as InfoIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Today as TodayIcon,
  ViewWeek as WeekIcon,
  CalendarToday as DayIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import AffectationModal from './AffectationModal';

const AffectationTableView = ({ affectations = [], salles = [], blocs = [], etages = [], loading = false, onCreateAffectation, onRefresh }) => {
  const theme = useTheme();
  const [expandedBlocs, setExpandedBlocs] = useState(new Set());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day' ou 'week'
  const [addAffectationOpen, setAddAffectationOpen] = useState(false);
  const [preSelectedRoom, setPreSelectedRoom] = useState(null);

  // Échelle horaire verticale (8h à 20h)
  const heures = useMemo(() => {
    const heures = [];
    for (let h = 8; h <= 20; h++) {
      heures.push({
        heure: h,
        label: `${h}h`,
        debut: `${h.toString().padStart(2, '0')}:00`,
        fin: `${(h + 1).toString().padStart(2, '0')}:00`
      });
    }
    return heures;
  }, []);

  // Générer les dates pour la vue semaine (lundi à dimanche)
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    // Aller au lundi de la semaine courante
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = dimanche
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    
    // Générer 7 jours (lundi à dimanche)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }, [currentDate]);

  // Navigation temporelle
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle expansion d'un bloc
  const toggleBloc = (blocId) => {
    const newExpanded = new Set(expandedBlocs);
    if (newExpanded.has(blocId)) {
      newExpanded.delete(blocId);
    } else {
      newExpanded.add(blocId);
    }
    setExpandedBlocs(newExpanded);
  };

    // Gérer le clic sur un créneau libre pour créer une affectation
  const handleSlotClick = (salleId, date, heure) => {
    const salle = salles.find(s => s.idSalle === salleId);
    
    if (salle) {
      // Trouver le bloc et l'étage de cette salle
      const bloc = blocs.find(b => b.id === salle.blocId);
      const etage = etages.find(e => e.id === salle.etageId);
      
      // Pré-remplir toutes les informations pour le modal
      setPreSelectedRoom({
        // Informations de la salle
        idSalle: salleId,
        nomSalle: salle.nomSalle,
        typeSalle: salle.typeSalle,
        capacite: salle.capacite,
        
        // Informations du bloc et étage pour le HierarchicalSelector
        blocNom: bloc?.nom || '',
        etageNumero: etage?.numero || 0,
        
        // Date et heure sélectionnées - utiliser une date valide
        date: (() => {
          const selectedDate = new Date(date);
          const today = new Date();
          
          // Si la date sélectionnée est dans le passé, utiliser demain
          if (selectedDate < today) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
          }
          
          return selectedDate.toISOString().split('T')[0];
        })(),
        heureDebut: `${heure.toString().padStart(2, '0')}:00`,
        heureFin: `${(heure + 1).toString().padStart(2, '0')}:00`,
        
        // Type d'activité vide (à remplir par l'utilisateur)
        typeActivite: ''
      });
      

      
             setAddAffectationOpen(true);
     } else {
       console.error('Salle non trouvée pour salleId:', salleId);
     }
  };

  // Gérer la fermeture du modal (même logique que le calendrier)
  const handleAddAffectationClose = () => {
    setAddAffectationOpen(false);
    setPreSelectedRoom(null);
  };

  // Gérer la création réussie d'une affectation (même logique que le calendrier)
  const handleAffectationCreated = (newAffectation) => {
    // Fermer d'abord le modal
    handleAddAffectationClose();
    
    // Notifier le composant parent si nécessaire
    if (onCreateAffectation) {
      onCreateAffectation(newAffectation);
    }
    
    // L'affectation sera automatiquement ajoutée à la liste via le composant parent
    // qui recharge les données depuis l'API
  };



  // Trouver une affectation pour une salle, date et heure données
  const findAffectation = (salleId, date, heure) => {
    
    
    const found = affectations.find(aff => {
      // Utiliser les mêmes noms de champs que le calendrier
      const affDate = aff.date;
      const affHeureDebut = aff.heuredebut; // Comme dans le calendrier
      const affHeureFin = aff.heurefin; // Comme dans le calendrier
      const affIdSalle = aff.idSalle; // Comme dans le calendrier
      
      // Validation des données requises
      if (!affDate || !affHeureDebut || !affHeureFin || !affIdSalle) {
        return false;
      }

      try {
        const affDateStr = new Date(affDate).toISOString().split('T')[0];
        const targetDate = date.toISOString().split('T')[0];
        
        // Vérifier si l'affectation couvre cette heure
        const affDebut = parseInt(affHeureDebut.split(':')[0]);
        const affFin = parseInt(affHeureFin.split(':')[0]);
        
        // Validation des heures
        if (isNaN(affDebut) || isNaN(affFin)) {
          return false;
        }
        
        const matches = affIdSalle === salleId && 
               affDateStr === targetDate &&
               heure >= affDebut && heure < affFin;
        

        
        return matches;
      } catch (error) {
        console.warn('Erreur lors du traitement d\'une affectation:', error, aff);
        return false;
      }
    });
    
    return found;
  };

  // Obtenir le statut de disponibilité d'une salle
  const getSalleStatus = (salleId, date, heure) => {
    try {
      const affectation = findAffectation(salleId, date, heure);
      if (affectation) {
        // Utiliser le même nom de champ que le calendrier
        const typeActivite = affectation.typeactivite || 'Activité';
        
        return {
          status: 'busy',
          data: affectation,
          color: 'error',
          icon: <EventIcon fontSize="small" />
        };
      }
      return {
        status: 'available',
        data: null,
        color: 'success',
        icon: <AvailableIcon fontSize="small" />
      };
    } catch (error) {
      console.warn('Erreur lors du calcul du statut de la salle:', error);
      return {
        status: 'available',
        data: null,
        color: 'success',
        icon: <AvailableIcon fontSize="small" />
      };
    }
  };

  // Grouper les salles par bloc et étage
  const sallesGrouped = useMemo(() => {
    const grouped = {};
    
    blocs.forEach(bloc => {
      grouped[bloc.id] = {
        bloc,
        etages: {}
      };
      
      etages.forEach(etage => {
        if (etage.blocId === bloc.id) {
          grouped[bloc.id].etages[etage.id] = {
            etage,
            salles: salles.filter(salle => 
              salle.blocId === bloc.id && salle.etageId === etage.id
            )
          };
        }
      });
    });
    
    return grouped;
  }, [salles, blocs, etages]);

  // Rendu d'une cellule du tableau
  const renderCell = (salleId, date, heure) => {
    try {
      const status = getSalleStatus(salleId, date, heure);
      
             if (status.status === 'busy' && status.data) {
          const affectation = status.data;
          const typeActivite = affectation.typeactivite || 'Activité';
          const heureDebut = affectation.heuredebut;
          const heureFin = affectation.heurefin;
         
         const tooltipText = typeActivite && heureDebut && heureFin 
           ? `${typeActivite} - ${heureDebut} à ${heureFin}`
           : 'Affectation';
           
         return (
           <Tooltip title={tooltipText}>
             <Box 
               data-affectation-cell
                               data-affectation-id={affectation.idaffectation || 'unknown'}
               sx={{ 
                 p: 0.5, 
                 bgcolor: 'error.50', 
                 border: '1px solid', 
                 borderColor: 'error.light',
                 borderRadius: 1,
                 cursor: 'pointer',
                 height: 40,
                 display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'center',
                 '&:hover': {
                   bgcolor: 'error.100'
                 }
               }}
             >
               <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main', fontSize: '0.65rem', textAlign: 'center' }}>
                 {typeActivite}
               </Typography>
             </Box>
           </Tooltip>
         );
       }
      
             return (
         <Tooltip title="Cliquer pour créer une affectation">
           <Box 
             data-available-cell
             data-salle-id={salleId}
             data-heure={heure}
             onClick={() => handleSlotClick(salleId, date, heure)}
             sx={{ 
               p: 0.5, 
               bgcolor: 'success.50', 
               border: '1px solid', 
               borderColor: 'success.light',
               borderRadius: 1,
               textAlign: 'center',
               height: 40,
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center',
               cursor: 'pointer',
               transition: 'all 0.2s ease',
               '&:hover': {
                 bgcolor: 'success.100',
                 borderColor: 'success.main',
                 transform: 'scale(1.02)'
               },
               '&:active': {
                 transform: 'scale(0.98)'
               }
             }}
           >
             <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main', fontSize: '0.65rem' }}>
               Libre
             </Typography>
           </Box>
         </Tooltip>
       );
    } catch (error) {
      console.warn('Erreur lors du rendu de la cellule:', error);
      return (
        <Box 
          sx={{ 
            p: 0.5, 
            bgcolor: 'grey.50', 
            border: '1px solid', 
            borderColor: 'grey.light',
            borderRadius: 1,
            textAlign: 'center',
            height: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'grey.main', fontSize: '0.65rem' }}>
            Erreur
          </Typography>
        </Box>
      );
    }
  };

  // Rendu d'une ligne de salle
  const renderSalleRow = (salle) => (
    <TableRow 
      key={salle.idSalle} 
      data-salle-row
      data-salle-id={salle.idSalle}
      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
    >
      {/* Colonne de la salle */}
      <TableCell sx={{ 
        minWidth: 200, 
        borderRight: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.default',
        position: 'sticky',
        left: 0,
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RoomIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {salle.nomSalle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Capacité: {salle.capacite} pers. | {salle.typeSalle}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      {/* Colonnes des jours avec échelle horaire verticale */}
      {weekDates.map(date => (
        <TableCell 
          key={date.toISOString()} 
          sx={{ 
            p: 0.5, 
            borderRight: '1px solid', 
            borderColor: 'divider',
            minWidth: 120
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
            </Typography>
          </Box>
          
          {/* Échelle horaire verticale */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {heures.map(heure => (
              <Box key={heure.heure} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Indicateur d'heure */}
                <Box sx={{ 
                  minWidth: 30, 
                  textAlign: 'center',
                  py: 0.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 600, 
                    color: 'text.secondary' 
                  }}>
                    {heure.label}
                  </Typography>
                </Box>
                
                {/* Cellule de disponibilité */}
                <Box sx={{ flex: 1 }}>
                  {renderCell(salle.idSalle, date, heure.heure)}
                </Box>
              </Box>
            ))}
          </Box>
        </TableCell>
      ))}
    </TableRow>
  );

  // Rendu d'un étage
  const renderEtage = (etage, salles) => (
    <React.Fragment key={etage.id}>
      <TableRow sx={{ bgcolor: 'grey.50' }}>
        <TableCell colSpan={weekDates.length + 1} sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {etage.numero === 0 ? 'RDC' : `${etage.numero}ème étage`}
            </Typography>
            <Chip 
              label={`${salles.length} salle${salles.length > 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </TableCell>
      </TableRow>
      
      {salles.map(salle => renderSalleRow(salle))}
    </React.Fragment>
  );

  // Rendu d'un bloc
  const renderBloc = (blocId, blocData) => {
    const isExpanded = expandedBlocs.has(blocId);
    const hasSalles = Object.values(blocData.etages).some(etage => etage.salles.length > 0);
    
    if (!hasSalles) return null;
    
    return (
      <React.Fragment key={blocId}>
        <TableRow sx={{ bgcolor: 'primary.50' }} data-bloc-header data-bloc-id={blocId}>
          <TableCell colSpan={weekDates.length + 1} sx={{ py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  🏢 {blocData.bloc.nom}
                </Typography>
                <Chip 
                  label={`${Object.values(blocData.etages).reduce((total, etage) => total + etage.salles.length, 0)} salles`}
                  size="small"
                  color="primary"
                />
              </Box>
              
              <IconButton
                size="small"
                onClick={() => toggleBloc(blocId)}
                sx={{ color: 'primary.main' }}
              >
                {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
        
        <Collapse in={isExpanded}>
          <TableBody>
            {Object.values(blocData.etages)
              .filter(etage => etage.salles.length > 0)
              .sort((a, b) => a.etage.numero - b.etage.numero)
              .map(({ etage, salles }) => renderEtage(etage, salles))
            }
          </TableBody>
        </Collapse>
      </React.Fragment>
    );
  };

  // Gestion du chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={48} sx={{ mb: 2, color: 'primary.main' }} />
        <Typography variant="h6" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
          📊 Chargement de l'emploi du temps...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
          Préparation des données pour l'affichage en grille
        </Typography>
      </Box>
    );
  }

  // Gestion des erreurs
  if (!salles.length) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Aucune salle disponible pour afficher l'emploi du temps.
        </Typography>
      </Alert>
    );
  }

  return (
    <Paper className="emploi-du-temps-container" sx={{ bgcolor: 'background.paper' }}>
      {/* En-tête avec navigation et sélecteur de vue */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EventIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            📊 Emploi du Temps des Salles
          </Typography>
        </Box>
        
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
           {/* Bouton de rechargement */}
           {onRefresh && (
             <Button
               variant="outlined"
               startIcon={<RefreshIcon />}
               onClick={onRefresh}
               size="small"
               sx={{ minWidth: 'auto' }}
               title="Recharger les données"
             >
               Actualiser
             </Button>
           )}
           
           {/* Sélecteur de mode de vue */}
           <ToggleButtonGroup
             value={viewMode}
             exclusive
             onChange={(e, newMode) => newMode && setViewMode(newMode)}
             size="small"
           >
             <ToggleButton value="day">
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <DayIcon fontSize="small" />
                 Jour
               </Box>
             </ToggleButton>
             <ToggleButton value="week">
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <WeekIcon fontSize="small" />
                 Semaine
               </Box>
             </ToggleButton>
           </ToggleButtonGroup>
         </Box>
      </Box>

      {/* Navigation temporelle */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={goToPrevious}
            size="small"
            data-navigation="prev"
          >
            {viewMode === 'day' ? 'Jour précédent' : 'Semaine précédente'}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<TodayIcon />}
            onClick={goToToday}
            size="small"
            data-navigation="today"
          >
            Aujourd'hui
          </Button>
          
          <Button
            variant="outlined"
            endIcon={<NextIcon />}
            onClick={goToNext}
            size="small"
            data-navigation="next"
          >
            {viewMode === 'day' ? 'Jour suivant' : 'Semaine suivante'}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {viewMode === 'day' 
              ? currentDate.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
                             : `Semaine du ${weekDates[0]?.toLocaleDateString('fr-FR', { 
                   day: 'numeric', 
                   month: 'long' 
                 })} au ${weekDates[6]?.toLocaleDateString('fr-FR', { 
                   day: 'numeric', 
                   month: 'long' 
                 })}`
            }
          </Typography>
          
          <Chip 
            label={`${affectations.filter(aff => {
              const affDate = new Date(aff.date).toISOString().split('T')[0];
              if (viewMode === 'day') {
                return affDate === currentDate.toISOString().split('T')[0];
              } else {
                return weekDates.some(date => 
                  date.toISOString().split('T')[0] === affDate
                );
              }
            }).length} affectations`}
            color="info"
            size="small"
          />
        </Box>
      </Box>

      {/* Légende */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.light' }}>
        <Typography variant="body2" color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon fontSize="small" />
          <strong>Légende :</strong> 
          <Chip label="Libre" color="success" size="small" sx={{ ml: 1 }} />
          <Chip label="Occupé" color="error" size="small" sx={{ ml: 1 }} />
          Cliquez sur les blocs pour développer/réduire la vue
        </Typography>
      </Box>

             {/* Tableau principal */}
       <TableContainer className="emploi-du-temps-table-container">
        <Table stickyHeader size="small">
                     <TableHead>
             <TableRow>
               <TableCell sx={{ 
                 minWidth: 200, 
                 bgcolor: 'primary.main', 
                 color: 'white',
                 fontWeight: 700,
                 borderRight: '1px solid',
                 borderColor: 'primary.dark',
                 position: 'sticky',
                 left: 0,
                 zIndex: 2
               }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <RoomIcon />
                   Salles
                 </Box>
               </TableCell>
               
               {/* En-têtes des jours - Supprimés pour simplifier l'interface */}
               {weekDates.map(date => (
                 <TableCell 
                   key={date.toISOString()} 
                   align="center"
                   sx={{ 
                     minWidth: 120, 
                     bgcolor: 'primary.main', 
                     color: 'white',
                     fontWeight: 700,
                     borderRight: '1px solid',
                     borderColor: 'primary.dark'
                   }}
                 >
                   {/* En-tête vide - les jours sont affichés dans chaque colonne */}
                 </TableCell>
               ))}
             </TableRow>
           </TableHead>
          
          <TableBody>
            {Object.entries(sallesGrouped)
              .filter(([_, blocData]) => 
                Object.values(blocData.etages).some(etage => etage.salles.length > 0)
              )
              .map(([blocId, blocData]) => renderBloc(blocId, blocData))
            }
          </TableBody>
                 </Table>
       </TableContainer>

               {/* Add Affectation Modal - Même composant que le calendrier */}
        <AffectationModal
          open={addAffectationOpen}
          onClose={handleAddAffectationClose}
          salles={salles}
          onAffectationCreated={handleAffectationCreated}
          preSelectedRoom={preSelectedRoom}
        />
     </Paper>
   );
 };

export default AffectationTableView;
