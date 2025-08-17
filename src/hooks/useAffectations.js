import { useState, useEffect, useCallback, useRef } from 'react';
import affectationService from '../services/affectationService';
import { transformAffectationsForCalendar } from '../utils/calendarUtils';

/**
 * Hook personnalisé pour gérer les affectations
 * @returns {Object} État et fonctions pour gérer les affectations
 */
export const useAffectations = () => {
  const [affectations, setAffectations] = useState([]);
  const [events, setEvents] = useState([]);
  const [salles, setSalles] = useState([]);
  const [typesActivites, setTypesActivites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Références pour éviter les rechargements inutiles
  const isInitialized = useRef(false);
  const sallesLoaded = useRef(false);

  // Charger toutes les affectations
  const loadAffectations = useCallback(async (sallesData = null) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await affectationService.getAllAffectations();
      
      // Utiliser les salles passées en paramètre ou celles du state
      const currentSalles = sallesData || salles;
      
      // Enrichir les affectations avec les informations des salles
      const enrichedAffectations = data.map(aff => {
        const salleInfo = currentSalles.find(s => s.idSalle === aff.idSalle);
        return {
          ...aff,
          nomSalle: salleInfo?.nomSalle || `Salle ${aff.idSalle}`,
          typeSalle: salleInfo?.typeSalle,
          capacite: salleInfo?.capacite,
          statut: aff.statut || 'active'
        };
      });
      
      setAffectations(enrichedAffectations);
      
      // Transformer pour FullCalendar
      const calendarEvents = transformAffectationsForCalendar(enrichedAffectations);
      setEvents(calendarEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des affectations');
    } finally {
      setLoading(false);
    }
  }, []); // Plus de dépendance sur salles

  // Charger les salles
  const loadSalles = useCallback(async () => {
    if (sallesLoaded.current) return; // Éviter les rechargements multiples
    
    try {
      const data = await affectationService.getSallesWithDetails();
      setSalles(data);
      sallesLoaded.current = true;
      
      // Charger les affectations après les salles
      if (!isInitialized.current) {
        await loadAffectations(data);
        isInitialized.current = true;
      }
    } catch (err) {
      console.error('Erreur lors du chargement des salles:', err);
    }
  }, [loadAffectations]);

  const buildSallePayloadFromSample = (salleData, sample) => {
    const nameKey = sample && Object.prototype.hasOwnProperty.call(sample, 'nomSalle') ? 'nomSalle'
      : (sample && Object.prototype.hasOwnProperty.call(sample, 'nom')) ? 'nom'
      : 'nomSalle';
    const typeKey = sample && Object.prototype.hasOwnProperty.call(sample, 'typeSalle') ? 'typeSalle'
      : (sample && Object.prototype.hasOwnProperty.call(sample, 'type')) ? 'type'
      : 'typeSalle';
    const capKey = sample && Object.prototype.hasOwnProperty.call(sample, 'capacite') ? 'capacite'
      : (sample && Object.prototype.hasOwnProperty.call(sample, 'capaciteSalle')) ? 'capaciteSalle'
      : 'capacite';

    return {
      [nameKey]: salleData.nomSalle ?? salleData.nom ?? '',
      [typeKey]: salleData.typeSalle ?? salleData.type ?? '',
      [capKey]: Number(salleData.capacite ?? salleData.capaciteSalle)
    };
  };

  // Ajouter une salle
  const createSalle = useCallback(async (salleData) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Try to adapt payload to backend by inspecting existing salle keys
      const sample = salles && salles.length > 0 ? salles[0] : null;
      const payload = buildSallePayloadFromSample(salleData, sample);
      const newSalle = await affectationService.createSalle(payload);
      
      // Mise à jour optimiste
      setSalles(prev => [newSalle, ...prev]);
      setSuccess('Salle créée avec succès !');
      return newSalle;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de la salle';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [salles, loading]);

  // Modifier une salle
  const updateSalle = useCallback(async (idSalle, salleData) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const sample = salles && salles.length > 0 ? salles[0] : null;
      const payload = buildSallePayloadFromSample(salleData, sample);
      const updatedSalle = await affectationService.updateSalle(idSalle, payload);
      
      // Mise à jour optimiste
      setSalles(prev => prev.map(s => s.idSalle === idSalle ? updatedSalle : s));
      
      // Mettre à jour les affectations qui utilisent cette salle
      setAffectations(prev => prev.map(aff => 
        aff.idSalle === idSalle 
          ? { ...aff, nomSalle: updatedSalle.nomSalle, typeSalle: updatedSalle.typeSalle, capacite: updatedSalle.capacite }
          : aff
      ));
      
      // Mettre à jour les événements du calendrier
      setEvents(prev => prev.map(event => 
        event.extendedProps.idSalle === idSalle
          ? { ...event, title: `${event.extendedProps.typeActivite} - ${updatedSalle.nomSalle}` }
          : event
      ));
      
      setSuccess('Salle modifiée avec succès !');
      return updatedSalle;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la modification de la salle';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [salles, loading]);

  // Supprimer une salle
  const deleteSalle = useCallback(async (idSalle) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Vérifier si la salle est utilisée par des affectations
      const salleUtilisee = affectations.some(aff => aff.idSalle === idSalle);
      if (salleUtilisee) {
        throw new Error('Impossible de supprimer une salle utilisée par des affectations');
      }
      
      await affectationService.deleteSalle(idSalle);
      
      // Mise à jour optimiste
      setSalles(prev => prev.filter(s => s.idSalle !== idSalle));
      setSuccess('Salle supprimée avec succès !');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression de la salle';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, affectations]);

  // Charger les types d'activités (optionnel maintenant)
  const loadTypesActivites = useCallback(async () => {
    try {
      // Plus besoin de charger des types prédéfinis
      setTypesActivites([]);
    } catch (err) {
      console.error('Erreur lors du chargement des types d\'activités:', err);
      setTypesActivites([]);
    }
  }, []);

  // Créer une nouvelle affectation
  const createAffectation = useCallback(async (affectationData) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const newAffectation = await affectationService.createAffectation(affectationData);
      
      // Récupérer les informations complètes de la salle
      const salleInfo = salles.find(s => s.idSalle === newAffectation.idSalle);
      
      // Créer un objet affectation complet avec les infos de la salle
      const completeAffectation = {
        ...newAffectation,
        nomSalle: salleInfo?.nomSalle || `Salle ${newAffectation.idSalle}`,
        typeSalle: salleInfo?.typeSalle,
        capacite: salleInfo?.capacite,
        statut: newAffectation.statut || 'active'
      };
      
      // Ajouter à la liste des affectations (mise à jour optimiste)
      setAffectations(prev => [...prev, completeAffectation]);
      
      // Transformer et ajouter aux événements du calendrier (mise à jour optimiste)
      const newEvent = transformAffectationsForCalendar([completeAffectation])[0];
      
      setEvents(prev => {
        const updatedEvents = [...prev, newEvent];
        return updatedEvents;
      });
      
      setSuccess('Affectation créée avec succès !');
      return completeAffectation;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de l\'affectation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [salles, loading]);

  // Modifier une affectation
  const updateAffectation = useCallback(async (id, affectationData) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedAffectation = await affectationService.updateAffectation(id, affectationData);
      
      // Récupérer les informations complètes de la salle
      const salleInfo = salles.find(s => s.idSalle === updatedAffectation.idSalle);
      
      // Créer un objet affectation complet avec les infos de la salle
      const completeAffectation = {
        ...updatedAffectation,
        nomSalle: salleInfo?.nomSalle || `Salle ${updatedAffectation.idSalle}`,
        statut: updatedAffectation.statut || 'active'
      };
      
      // Mise à jour optimiste dans la liste des affectations
      setAffectations(prev => 
        prev.map(aff => (aff.idaffectation === id || aff.idAffectation === id) ? completeAffectation : aff)
      );
      
      // Mise à jour optimiste des événements du calendrier
      const updatedEvent = transformAffectationsForCalendar([completeAffectation])[0];
      setEvents(prev => 
        prev.map(event => (event.id === id || event.extendedProps.idaffectation === id) ? updatedEvent : event)
      );
      
      setSuccess('Affectation modifiée avec succès !');
      return completeAffectation;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la modification de l\'affectation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [salles, loading]);

  // Rafraîchir les données (seulement sur demande explicite)
  const refreshData = useCallback(async () => {
    try {
      // Charger d'abord les salles, puis les affectations
      await loadSalles();
      // loadAffectations sera appelé automatiquement par loadSalles
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    }
  }, [loadSalles]);

  // Supprimer une affectation
  const deleteAffectation = useCallback(async (id) => {
    if (loading) return; // Éviter les appels multiples
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Mise à jour optimiste (supprimer immédiatement de l'UI)
      setAffectations(prev => prev.filter(aff => 
        aff.idaffectation !== id && aff.idAffectation !== id
      ));
      
      setEvents(prev => prev.filter(event => 
        event.id !== id && event.extendedProps.idaffectation !== id
      ));
      
      // Appel API après la mise à jour optimiste
      await affectationService.deleteAffectation(id);
      
      setSuccess('Affectation supprimée avec succès !');
    } catch (err) {
      // En cas d'erreur, restaurer l'état précédent
      console.error('Erreur lors de la suppression, restauration de l\'état...');
      await refreshData(); // Recharger les données pour restaurer l'état
      
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de l\'affectation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loading, refreshData]);

  // Vérifier les conflits
  const checkConflicts = useCallback(async (affectationData) => {
    try {
      const conflicts = await affectationService.checkConflicts(affectationData);
      return conflicts;
    } catch (err) {
      console.error('Erreur lors de la vérification des conflits:', err);
      return [];
    }
  }, []);

  // Obtenir une affectation par ID
  const getAffectationById = useCallback(async (id) => {
    try {
      const affectation = await affectationService.getAffectationById(id);
      return affectation;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'affectation:', err);
      return null;
    }
  }, []);

  // Filtrer les affectations
  const filterAffectations = useCallback((filters) => {
    let filtered = [...affectations];
    
    if (filters.dateDebut) {
      filtered = filtered.filter(aff => aff.date >= filters.dateDebut);
    }
    
    if (filters.dateFin) {
      filtered = filtered.filter(aff => aff.date <= filters.dateFin);
    }
    
    if (filters.idSalle) {
      filtered = filtered.filter(aff => aff.idSalle === filters.idSalle);
    }
    
    if (filters.typeactivite) {
      filtered = filtered.filter(aff => 
        aff.typeactivite.toLowerCase().includes(filters.typeactivite.toLowerCase())
      );
    }
    
    if (filters.statut && filters.statut !== 'tous') {
      filtered = filtered.filter(aff => aff.statut === filters.statut);
    }
    
    return filtered;
  }, [affectations]);

  // Effacer les messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Charger les données au montage (UNE SEULE FOIS)
  useEffect(() => {
    if (!isInitialized.current) {
      loadSalles();
    }
  }, []); // Dépendances vides = exécution unique au montage

  return {
    // État
    affectations,
    events,
    salles,
    typesActivites,
    loading,
    error,
    success,
    
    // Actions
    loadAffectations,
    createAffectation,
    updateAffectation,
    deleteAffectation,
    checkConflicts,
    getAffectationById,
    filterAffectations,
    refreshData,
    clearMessages,
    // CRUD salles
    createSalle,
    updateSalle,
    deleteSalle,
    
    // Utilitaires
    getSalleById: (id) => salles.find(s => s.idSalle === id),
    getTypeActiviteByName: (name) => typesActivites.find(t => t.nom === name)
  };
}; 