import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Alert,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon,
  Event as EventIcon,
  Room as RoomIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import affectationService from '../../services/affectationService';
import AffectationModal from './AffectationModal';
import './AffectationCalendar.css';

const AffectationCalendar = ({ preSelectedRoom }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [addAffectationOpen, setAddAffectationOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Load affectations on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load rooms
  useEffect(() => {
    loadSalles();
  }, []);

  // Auto-open affectation modal if room is pre-selected
  useEffect(() => {
    if (preSelectedRoom) {
      setAddAffectationOpen(true);
    }
  }, [preSelectedRoom]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const affectationsData = await affectationService.getAllAffectations();
      
      if (!affectationsData) {
        throw new Error('No data received from API');
      }
      
      console.log('📊 Données brutes reçues de l\'API:', affectationsData);
      
      // Déduplication basée sur l'ID de l'affectation
      const uniqueAffectations = affectationsData.filter((aff, index, self) => 
        index === self.findIndex(a => a.idaffectation === aff.idaffectation)
      );
      
      console.log('🔍 Affectations après déduplication:', uniqueAffectations);
      
      const transformedEvents = uniqueAffectations.map(aff => ({
        id: aff.idaffectation,
        title: `${aff.typeactivite} - ${aff.nomSalle}`,
        start: new Date(`${aff.date}T${aff.heuredebut}`),
        end: new Date(`${aff.date}T${aff.heurefin}`),
        salle: aff.nomSalle,
        typeActivite: aff.typeactivite,
        capaciteSalle: aff.capaciteSalle,
        backgroundColor: getEventColor(aff.typeactivite),
        borderColor: getEventColor(aff.typeactivite),
        textColor: '#ffffff',
        // Ajouter des données supplémentaires pour le debug
        rawData: aff
      }));
      
      console.log('🎯 Événements transformés pour le calendrier:', transformedEvents);
      
        // Validation finale : vérifier qu'il n'y a pas de duplication
  const finalEvents = transformedEvents.filter((event, index, self) => 
    index === self.findIndex(e => e.id === event.id)
  );
  
  if (finalEvents.length !== transformedEvents.length) {
    console.warn('⚠️ Duplication détectée et corrigée:', {
      original: transformedEvents.length,
      final: finalEvents.length,
      duplicates: transformedEvents.length - finalEvents.length
    });
  }
  
  // Validation supplémentaire : vérifier qu'il n'y a pas de répétitions par date
  const eventsByDate = {};
  finalEvents.forEach(event => {
    const dateStr = event.start.toISOString().split('T')[0];
    if (!eventsByDate[dateStr]) {
      eventsByDate[dateStr] = [];
    }
    eventsByDate[dateStr].push(event);
  });
  
  // Vérifier les répétitions par date
  Object.entries(eventsByDate).forEach(([date, dateEvents]) => {
    const uniqueDateEvents = dateEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    if (uniqueDateEvents.length !== dateEvents.length) {
      console.warn(`⚠️ Répétitions détectées pour la date ${date}:`, {
        total: dateEvents.length,
        unique: uniqueDateEvents.length,
        duplicates: dateEvents.length - uniqueDateEvents.length
      });
    }
  });
  
  setEvents(finalEvents);
  setSuccess(`Chargé ${finalEvents.length} affectations uniques (${transformedEvents.length - finalEvents.length} doublons supprimés)`);
    } catch (err) {
      console.error('Error loading affectations:', err);
      setError('Erreur lors du chargement des affectations');
    } finally {
      setLoading(false);
    }
  };

  const loadSalles = async () => {
    try {
      const sallesData = await affectationService.getSallesWithDetails();
      setSalles(sallesData);
    } catch (err) {
      console.error('Error loading salles:', err);
      try {
        const basicSalles = await affectationService.getSalles();
        setSalles(basicSalles);
      } catch (fallbackErr) {
        console.error('Error loading basic salles:', fallbackErr);
      }
    }
  };

  const reloadData = async () => {
    console.log('🔄 ReloadData appelé manuellement');
    await loadData();
  };

  // Fonction de debug pour vérifier l'état des événements
  const debugEvents = () => {
    console.log('🔍 Debug des événements du calendrier:');
    console.log('📊 Nombre total d\'événements:', events.length);
    console.log('🎯 Événements uniques par ID:', events.map(e => ({ id: e.id, title: e.title, date: e.start.toISOString().split('T')[0] })));
    
    // Vérifier les doublons
    const ids = events.map(e => e.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      console.warn('⚠️ Doublons détectés:', duplicates);
    } else {
      console.log('✅ Aucun doublon détecté');
    }
    
         // Debug spécifique pour les vues semaine et jour
     if (currentView === 'week' || currentView === 'day') {
       console.log('🔍 Debug spécifique pour la vue:', currentView);
       const today = new Date();
       const todayStr = today.toISOString().split('T')[0];
       
       // Vérifier les événements d'aujourd'hui
       const todayEvents = getEventsForDate(today);
       console.log('📅 Événements d\'aujourd\'hui:', todayEvents);
       
       // Vérifier les créneaux horaires
       console.log('🕐 Analyse des créneaux horaires:');
       for (let hour = 7; hour <= 22; hour++) {
         const hourEvents = getEventsForTimeSlot(today, hour);
         if (hourEvents.length > 0) {
           console.log(`  ${hour.toString().padStart(2, '0')}:00 - ${hourEvents.length} événements:`, hourEvents.map(e => ({ id: e.id, title: e.title, start: e.start.getHours(), end: e.end.getHours() })));
         }
       }
       
       // Vérifier qu'il n'y a pas de répétitions
       const allHourEvents = [];
       for (let hour = 7; hour <= 22; hour++) {
         const hourEvents = getEventsForTimeSlot(today, hour);
         allHourEvents.push(...hourEvents);
       }
       
       const eventIds = allHourEvents.map(e => e.id);
       const duplicates = eventIds.filter((id, index) => eventIds.indexOf(id) !== index);
       
       if (duplicates.length > 0) {
         console.warn('⚠️ Répétitions détectées dans les créneaux horaires:', duplicates);
       } else {
         console.log('✅ Aucune répétition détectée dans les créneaux horaires');
       }
     }
  };

  const getEventColor = (typeActivite) => {
    const colors = {
      'Cours': '#2196F3',
      'Réunion': '#FF9800',
      'Examen': '#F44336',
      'TP': '#4CAF50',
      'Conférence': '#9C27B0',
      'Atelier': '#795548',
      'Séminaire': '#607D8B'
    };
    
    for (const [key, color] of Object.entries(colors)) {
      if (typeActivite.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    return '#757575';
  };

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setCurrentView(newView);
    }
  };

  const handleAddAffectationOpen = () => {
    setAddAffectationOpen(true);
  };

  const handleAddAffectationClose = () => {
    setAddAffectationOpen(false);
  };

  const handleAffectationCreated = (newAffectation) => {
    console.log('🎉 Nouvelle affectation créée, rechargement des données...', newAffectation);
    
    // Fermer d'abord le modal
    handleAddAffectationClose();
    
    // Attendre un peu avant de recharger pour laisser l'API se stabiliser
    setTimeout(async () => {
      try {
        console.log('🔄 Rechargement des données après création...');
        await loadData();
        console.log('✅ Données rechargées avec succès');
      } catch (error) {
        console.error('❌ Erreur lors du rechargement:', error);
        setError('Erreur lors du rechargement des données');
      }
    }, 500);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getWeekData = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getDayData = () => {
    return [currentDate];
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Récupérer tous les événements pour cette date
    const dateEvents = events.filter(event => {
      const eventDate = event.start.toISOString().split('T')[0];
      return eventDate === dateStr;
    });
    
    // Déduplication basée sur l'ID de l'événement
    const uniqueEvents = dateEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    // Trier par heure de début pour un affichage cohérent
    const sortedEvents = uniqueEvents.sort((a, b) => a.start.getHours() - b.start.getHours());
    
    console.log(`📅 Date ${dateStr} - Événements uniques triés:`, sortedEvents.map(e => ({ id: e.id, title: e.title, start: e.start.getHours(), end: e.end.getHours() })));
    
    return sortedEvents;
  };

  const getEventsForTimeSlot = (date, hour) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Récupérer tous les événements pour cette date
    const dateEvents = events.filter(event => {
      const eventDate = event.start.toISOString().split('T')[0];
      return eventDate === dateStr;
    });
    
    // Pour éviter les répétitions, on n'affiche un événement que dans son créneau de début
    const eventsStartingAtHour = dateEvents.filter(event => {
      const eventStartHour = event.start.getHours();
      return eventStartHour === hour;
    });
    
    // Déduplication basée sur l'ID de l'événement
    const uniqueEvents = eventsStartingAtHour.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    console.log(`🕐 Créneau ${hour}:00 - Événements uniques (début uniquement):`, uniqueEvents.map(e => ({ id: e.id, title: e.title, start: e.start.getHours(), end: e.end.getHours() })));
    
    return uniqueEvents;
  };

  const renderMonthView = () => {
    const days = getMonthData();
    const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    return (
      <div className="calendar-view month-view">
        <div className="calendar-header">
          <Typography variant="h6" className="calendar-title">
            {monthName}
          </Typography>
        </div>
        <div className="calendar-grid month-grid">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const dayEvents = getEventsForDate(date);
            
            return (
              <div
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="day-number">{date.getDate()}</div>
                <div className="day-events">
                  {dayEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="calendar-event" style={{ backgroundColor: event.backgroundColor }}>
                      <div className="event-title">{event.typeActivite}</div>
                      <div className="event-time">{formatTime(event.start)}</div>
                      <div className="event-salle">{event.salle}</div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">+{dayEvents.length - 3}</div>
                  )}
                  {dayEvents.length === 0 && (
                    <div className="no-events">Aucun événement</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekData();
    const weekRange = `${formatDate(days[0])} - ${formatDate(days[6])}`;
    const timeSlots = [];
    for (let hour = 7; hour <= 22; hour++) {
      timeSlots.push(hour);
    }
    
    return (
      <div className="calendar-view week-view">
        <div className="calendar-header">
          <Typography variant="h6" className="calendar-title">
            Semaine du {weekRange}
          </Typography>
        </div>
        <div className="calendar-scroll-container">
          <div className="calendar-grid week-grid">
            <div className="time-column">
              <div className="time-header">Heure</div>
              {timeSlots.map(hour => (
                <div key={hour} className="time-slot">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            {days.map((date, dayIndex) => {
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={dayIndex} className={`day-column ${isToday ? 'today' : ''}`}>
                  <div className="day-header">
                    <div className="day-name">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                    <div className="day-date">{date.getDate()}</div>
                  </div>
                                     {timeSlots.map(hour => {
                     const hourEvents = getEventsForTimeSlot(date, hour);
                     
                     return (
                       <div key={hour} className="time-cell">
                         {hourEvents.map(event => (
                           <div key={`${event.id}-${hour}`} className="calendar-event" style={{ backgroundColor: event.backgroundColor }}>
                             <div className="event-title">{event.typeActivite}</div>
                             <div className="event-time">{formatTime(event.start)} - {formatTime(event.end)}</div>
                             <div className="event-salle">{event.salle}</div>
                           </div>
                         ))}
                         {hourEvents.length === 0 && (
                           <div className="no-events-time">-</div>
                         )}
                       </div>
                     );
                   })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const day = currentDate;
    const dayEvents = getEventsForDate(day);
    const timeSlots = [];
    for (let hour = 7; hour <= 22; hour++) {
      timeSlots.push(hour);
    }
    
    return (
      <div className="calendar-view day-view">
        <div className="calendar-header">
          <Typography variant="h6" className="calendar-title">
            {formatDate(day)}
          </Typography>
        </div>
        <div className="calendar-scroll-container">
          <div className="calendar-grid day-grid">
            <div className="time-column">
              <div className="time-header">Heure</div>
              {timeSlots.map(hour => (
                <div key={hour} className="time-slot">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            <div className="day-column">
              <div className="day-header">
                <div className="day-name">{day.toLocaleDateString('fr-FR', { weekday: 'long' })}</div>
                <div className="day-date">{formatDate(day)}</div>
              </div>
                             {timeSlots.map(hour => {
                 const hourEvents = getEventsForTimeSlot(day, hour);
                 
                 return (
                   <div key={hour} className="time-cell">
                     {hourEvents.map(event => (
                       <div key={`${event.id}-${hour}`} className="calendar-event detailed" style={{ backgroundColor: event.backgroundColor }}>
                         <div className="event-title">{event.typeActivite}</div>
                         <div className="event-time">{formatTime(event.start)} - {formatTime(event.end)}</div>
                         <div className="event-salle">{event.salle}</div>
                         <div className="event-capacity">Capacité: {event.capaciteSalle}</div>
                       </div>
                     ))}
                     {hourEvents.length === 0 && (
                       <div className="no-events-time">-</div>
                     )}
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    switch (currentView) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Calendrier des Affectations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez et visualisez vos réservations de salles
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAffectationOpen}
            sx={{ minWidth: 200 }}
          >
            Nouvelle Affectation
          </Button>
        </Box>
      </Paper>

      {/* Controls */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
          <ToggleButtonGroup
            value={currentView}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="month" sx={{ px: 3 }}>
              <CalendarIcon sx={{ mr: 1 }} />
              Mois
            </ToggleButton>
            <ToggleButton value="week" sx={{ px: 3 }}>
              <WeekIcon sx={{ mr: 1 }} />
              Semaine
            </ToggleButton>
            <ToggleButton value="day" sx={{ px: 3 }}>
              <DayIcon sx={{ mr: 1 }} />
              Jour
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={goToPreviousPeriod} size="small">
              <ChevronLeftIcon />
            </IconButton>
            
            <Button
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={goToToday}
              size="small"
            >
              Aujourd'hui
            </Button>
            
            <IconButton onClick={goToNextPeriod} size="small">
              <ChevronRightIcon />
            </IconButton>
            
                         <IconButton onClick={reloadData} size="small">
               <RefreshIcon />
             </IconButton>
             
             {/* Bouton de debug en mode développement */}
             {process.env.NODE_ENV === 'development' && (
               <IconButton 
                 onClick={debugEvents} 
                 size="small"
                 sx={{ color: 'warning.main' }}
                 title="Debug des événements"
               >
                 <span>🐛</span>
               </IconButton>
             )}
          </Box>
        </Box>
      </Paper>

      {/* Status Messages */}
      {loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <CircularProgress size={16} sx={{ mr: 1 }} />
          Chargement des affectations...
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

      {/* Calendar Content */}
      <div className="calendar-container">
        <div className="calendar-content">
          {renderCalendarView()}
        </div>
      </div>

      {/* Add Affectation Modal */}
      <AffectationModal
        open={addAffectationOpen}
        onClose={handleAddAffectationClose}
        salles={salles}
        onAffectationCreated={handleAffectationCreated}
        preSelectedRoom={preSelectedRoom}
      />
    </Box>
  );
};

export default AffectationCalendar;
