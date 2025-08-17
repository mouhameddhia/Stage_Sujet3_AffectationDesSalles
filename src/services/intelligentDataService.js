import affectationService from './affectationService';

class IntelligentDataService {
  constructor() {
    this.cache = {
      salles: null,
      affectations: null,
      blocs: null,
      etages: null,
      lastUpdate: null
    };
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Vérifier si le cache est valide
  isCacheValid() {
    return this.cache.lastUpdate && 
           (Date.now() - this.cache.lastUpdate) < this.cacheTimeout;
  }

  // Charger toutes les données nécessaires
  async loadAllData() {
    if (this.isCacheValid()) {
      console.log('📊 Utilisation du cache pour les données intelligentes');
      return this.cache;
    }

    console.log('🔄 Chargement des données intelligentes depuis la base...');
    
    try {
      const [salles, affectations, blocsEtages] = await Promise.all([
        this.fetchSallesWithDetails(),
        this.fetchAffectationsForDate(),
        this.fetchBlocsAndEtages()
      ]);

      // Extraire blocs et etages de l'objet retourné
      const { blocs, etages } = blocsEtages;

      this.cache = {
        salles,
        affectations,
        blocs,
        etages,
        lastUpdate: Date.now()
      };

      console.log(`✅ Données chargées: ${salles.length} salles, ${affectations.length} affectations, ${blocs.length} blocs, ${etages.length} étages`);
      return this.cache;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données intelligentes:', error);
      throw error;
    }
  }

  // Récupérer les salles avec tous les détails
  async fetchSallesWithDetails() {
    try {
      const salles = await affectationService.getSallesWithDetails();
      return salles.map(salle => ({
        id: salle.idSalle,
        nom: salle.nomSalle,
        capacite: salle.capacite,
        type: salle.typeSalle,
        etageId: salle.etageId,
        blocNom: salle.blocNom,
        etageNumero: salle.etageNumero,
        localisation: `${salle.blocNom || 'Bloc inconnu'} - ${salle.etageNumero || 'Étage inconnu'}`,
        score: 0, // Sera calculé plus tard
        isAvailable: true,
        conflicts: [],
        advantages: [],
        considerations: []
      }));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des salles:', error);
      return [];
    }
  }

  // Récupérer les affectations pour une date donnée
  async fetchAffectationsForDate(date = new Date().toISOString().split('T')[0]) {
    try {
      // Utiliser le service existant ou créer une nouvelle méthode
      const affectations = await affectationService.getAllAffectations();
      
             const filteredAffectations = affectations.filter(aff => aff.date === date);
       return filteredAffectations;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des affectations:', error);
      return [];
    }
  }

  // Récupérer les blocs et étages
  async fetchBlocsAndEtages() {
    try {
      const [blocs, etages] = await Promise.all([
        affectationService.getAllBlocs(),
        affectationService.getAllEtages()
      ]);
      return { blocs, etages };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des blocs/étages:', error);
      return { blocs: [], etages: [] };
    }
  }

  // Analyser la disponibilité d'une salle pour un créneau donné
  analyzeAvailability(salle, date, heureDebut, heureFin, affectations) {
    // Filtrer les affectations valides avec des temps
    const validAffectations = affectations.filter(aff => 
      aff.idSalle === salle.id && 
      aff.date === date &&
      aff.heureDebut && 
      aff.heureFin &&
      typeof aff.heureDebut === 'string' &&
      typeof aff.heureFin === 'string'
    );
    
         const conflicts = validAffectations.filter(aff => 
       this.hasTimeConflict(aff.heureDebut, aff.heureFin, heureDebut, heureFin)
     );

    return {
      isAvailable: conflicts.length === 0,
      conflicts,
      availabilityStatus: conflicts.length === 0 ? 'Disponible' : 'Occupée',
      nextAvailableSlot: this.findNextAvailableSlot(salle, date, heureDebut, heureFin, validAffectations)
    };
  }

  // Vérifier les conflits de temps
  hasTimeConflict(start1, end1, start2, end2) {
    // Validation des paramètres
    if (!start1 || !end1 || !start2 || !end2) {
      console.warn('⚠️ hasTimeConflict: paramètres manquants:', { start1, end1, start2, end2 });
      return false;
    }
    
    const time1Start = this.timeToMinutes(start1);
    const time1End = this.timeToMinutes(end1);
    const time2Start = this.timeToMinutes(start2);
    const time2End = this.timeToMinutes(end2);

    // Vérifier que les temps sont valides
    if (time1Start === 0 || time1End === 0 || time2Start === 0 || time2End === 0) {
      console.warn('⚠️ hasTimeConflict: temps invalides, pas de conflit détecté');
      return false;
    }

    return !(time1End <= time2Start || time2End <= time1Start);
  }

  // Convertir l'heure en minutes pour la comparaison
  timeToMinutes(time) {
    if (!time || typeof time !== 'string') {
      console.warn('⚠️ timeToMinutes: time invalide:', time);
      return 0;
    }
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        console.warn('⚠️ timeToMinutes: format d\'heure invalide:', time);
        return 0;
      }
      return hours * 60 + minutes;
    } catch (error) {
      console.error('❌ Erreur dans timeToMinutes:', error, 'pour time:', time);
      return 0;
    }
  }

  // Trouver le prochain créneau disponible
  findNextAvailableSlot(salle, date, heureDebut, heureFin, affectations) {
    const duration = this.timeToMinutes(heureFin) - this.timeToMinutes(heureDebut);
    
    // Vérifier que la durée est valide
    if (duration <= 0) {
      console.warn('⚠️ findNextAvailableSlot: durée invalide:', duration, 'pour', heureDebut, '-', heureFin);
      return [];
    }
    
    const conflicts = affectations.filter(aff => 
      aff.idSalle === salle.id && 
      aff.date === date &&
      aff.heureDebut && 
      aff.heureFin
    ).sort((a, b) => this.timeToMinutes(a.heureDebut) - this.timeToMinutes(b.heureDebut));

    // Chercher des créneaux libres
    const timeSlots = [];
    let currentTime = 8 * 60; // 8h00
    const endTime = 20 * 60; // 20h00

    while (currentTime + duration <= endTime) {
      const slotStart = this.minutesToTime(currentTime);
      const slotEnd = this.minutesToTime(currentTime + duration);
      
      const hasConflict = conflicts.some(conf => 
        this.hasTimeConflict(conf.heureDebut, conf.heureFin, slotStart, slotEnd)
      );

      if (!hasConflict) {
        timeSlots.push({
          heureDebut: slotStart,
          heureFin: slotEnd,
          score: this.calculateTimeSlotScore(slotStart, heureDebut, heureFin)
        });
      }

      currentTime += 30; // Incrémenter par 30 minutes
    }

    return timeSlots.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // Convertir les minutes en format heure
  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Calculer le score d'un créneau horaire
  calculateTimeSlotScore(slotStart, preferredStart, preferredEnd) {
    const slotMinutes = this.timeToMinutes(slotStart);
    const preferredMinutes = this.timeToMinutes(preferredStart);
    
    // Vérifier que les temps sont valides
    if (slotMinutes === 0 || preferredMinutes === 0) {
      console.warn('⚠️ calculateTimeSlotScore: temps invalides:', { slotStart, preferredStart, preferredEnd });
      return 60; // Score par défaut
    }
    
    const diff = Math.abs(slotMinutes - preferredMinutes);
    
    if (diff === 0) return 100;
    if (diff <= 30) return 90;
    if (diff <= 60) return 80;
    if (diff <= 120) return 70;
    return 60;
  }

  // Calculer le score intelligent d'une salle
  calculateIntelligentScore(salle, request, availability) {
    let score = 0;
    const advantages = [];
    const considerations = [];

    // Score de capacité (40% du score total)
    const capacityScore = this.calculateCapacityScore(salle.capacite, request.capaciteRequise);
    score += capacityScore.score * 0.4;
    advantages.push(...capacityScore.advantages);
    considerations.push(...capacityScore.considerations);

    // Score de localisation (30% du score total)
    const locationScore = this.calculateLocationScore(salle, request);
    score += locationScore.score * 0.3;
    advantages.push(...locationScore.advantages);
    considerations.push(...locationScore.considerations);

    // Score de disponibilité (30% du score total)
    const availabilityScore = this.calculateAvailabilityScore(availability);
    score += availabilityScore.score * 0.3;
    advantages.push(...availabilityScore.advantages);
    considerations.push(...availabilityScore.considerations);

    return {
      total: Math.round(score),
      breakdown: {
        capacity: capacityScore.score,
        location: locationScore.score,
        availability: availabilityScore.score
      },
      advantages,
      considerations
    };
  }

  // Calculer le score de capacité
  calculateCapacityScore(salleCapacity, requiredCapacity) {
    const ratio = salleCapacity / requiredCapacity;
    let score = 0;
    const advantages = [];
    const considerations = [];

    if (ratio >= 0.8 && ratio <= 1.2) {
      score = 100;
      advantages.push('Capacité parfaitement adaptée');
    } else if (ratio >= 0.6 && ratio < 0.8) {
      score = 70;
      advantages.push('Capacité suffisante');
      considerations.push('Légèrement sous-dimensionnée');
    } else if (ratio > 1.2 && ratio <= 1.5) {
      score = 85;
      advantages.push('Capacité confortable');
      considerations.push('Légèrement sur-dimensionnée');
    } else if (ratio > 1.5) {
      score = 60;
      advantages.push('Très spacieuse');
      considerations.push('Peut être trop grande');
    } else {
      score = 30;
      considerations.push('Capacité insuffisante');
    }

    return { score, advantages, considerations };
  }

  // Calculer le score de localisation
  calculateLocationScore(salle, request) {
    let score = 50; // Score de base
    const advantages = [];
    const considerations = [];

    // Vérifier les préférences de bloc
    if (request.blocPrefere && salle.blocNom === request.blocPrefere) {
      score += 30;
      advantages.push('Bloc préféré');
    }

    // Vérifier les préférences d'étage
    if (request.etagePrefere && salle.etageNumero === request.etagePrefere) {
      score += 20;
      advantages.push('Étage préféré');
    }

    // Bonus pour la proximité
    if (salle.blocNom && salle.etageNumero) {
      score += 10;
      advantages.push('Localisation précise');
    }

    return { score: Math.min(score, 100), advantages, considerations };
  }

  // Calculer le score de disponibilité
  calculateAvailabilityScore(availability) {
    let score = 0;
    const advantages = [];
    const considerations = [];

    if (availability.isAvailable) {
      score = 100;
      advantages.push('Disponible immédiatement');
    } else if (availability.nextAvailableSlot && availability.nextAvailableSlot.length > 0) {
      score = 70;
      advantages.push('Alternatives disponibles');
      considerations.push('Pas disponible au créneau demandé');
    } else {
      score = 20;
      considerations.push('Pas de créneaux disponibles');
    }

    return { score, advantages, considerations };
  }

  // Générer des recommandations intelligentes
  async generateIntelligentRecommendations(request) {
    try {
      // Charger toutes les données
      const { salles, affectations } = await this.loadAllData();
      
      if (salles.length === 0) {
        throw new Error('Aucune salle disponible');
      }
      
      // Vérifier que la requête a des temps valides
      if (!request.heureDebut || !request.heureFin) {
        console.warn('⚠️ Requête sans temps valides, utilisation de valeurs par défaut');
        request.heureDebut = request.heureDebut || '09:00';
        request.heureFin = request.heureFin || '10:00';
      }

      // Analyser la disponibilité de chaque salle
      const sallesWithAvailability = salles.map(salle => {
        try {
          const availability = this.analyzeAvailability(
            salle, 
            request.date, 
            request.heureDebut, 
            request.heureFin, 
            affectations
          );

          const scoreData = this.calculateIntelligentScore(salle, request, availability);
          
          return {
            ...salle,
            availability,
            score: scoreData.total,
            breakdown: scoreData.breakdown,
            advantages: scoreData.advantages,
            considerations: scoreData.considerations,
            isOptimal: false
          };
        } catch (error) {
          console.error(`❌ Erreur lors de l'analyse de la salle ${salle.nom}:`, error);
          // Retourner une salle avec des valeurs par défaut
          return {
            ...salle,
            availability: {
              isAvailable: true,
              conflicts: [],
              availabilityStatus: 'Disponible',
              nextAvailableSlot: []
            },
            score: 50,
            breakdown: { capacity: 50, location: 50, availability: 50 },
            advantages: ['Disponible'],
            considerations: ['Analyse incomplète'],
            isOptimal: false
          };
        }
      });

      // Trier par score décroissant
      const sortedSalles = sallesWithAvailability
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Top 10

      // Marquer la première comme optimale
      if (sortedSalles.length > 0) {
        sortedSalles[0].isOptimal = true;
        sortedSalles[0].whyOptimal = this.generateOptimalReason(sortedSalles[0], request);
      }

      // Générer les données intelligentes
      const intelligentData = {
        optimalRoom: sortedSalles[0] || null,
        optimalTimeSlot: sortedSalles[0]?.availability?.nextAvailableSlot?.[0] || {
          heureDebut: request.heureDebut,
          heureFin: request.heureFin,
          score: 100
        },
        aiReasoning: this.generateAIReasoning(sortedSalles, request),
        hasConflicts: sortedSalles.some(s => s.availability.conflicts.length > 0),
        conflictResolution: this.generateConflictResolution(sortedSalles),
        alternativeTimeSlots: this.generateAlternativeTimeSlots(sortedSalles),
        optimalStrategy: this.generateOptimalStrategy(sortedSalles, request),
        capacityAnalysis: this.generateCapacityAnalysis(sortedSalles, request),
        locationAnalysis: this.generateLocationAnalysis(sortedSalles, request),
        timingAnalysis: this.generateTimingAnalysis(sortedSalles, request)
      };

      return {
        recommendations: sortedSalles,
        intelligentData
      };

    } catch (error) {
      console.error('❌ Erreur lors de la génération des recommandations:', error);
      throw error;
    }
  }

  // Générer la raison pour laquelle une salle est optimale
  generateOptimalReason(salle, request) {
    const reasons = [];
    
    if (salle.breakdown.capacity >= 90) reasons.push('Capacité parfaitement adaptée');
    if (salle.breakdown.location >= 90) reasons.push('Localisation idéale');
    if (salle.breakdown.availability >= 90) reasons.push('Disponibilité immédiate');
    
    if (reasons.length === 0) reasons.push('Meilleur compromis global');
    
    return reasons.join(', ');
  }

  // Générer le raisonnement IA
  generateAIReasoning(salles, request) {
    if (salles.length === 0) return "Aucune salle disponible pour cette demande.";
    
    const bestSalle = salles[0];
    let reasoning = `L'IA a analysé ${salles.length} salles et recommande ${bestSalle.nom} `;
    
    if (bestSalle.breakdown.capacity >= 90) {
      reasoning += "pour sa capacité parfaitement adaptée ";
    }
    
    if (bestSalle.breakdown.location >= 90) {
      reasoning += "et sa localisation idéale ";
    }
    
    if (bestSalle.breakdown.availability >= 90) {
      reasoning += "avec disponibilité immédiate. ";
    }
    
    reasoning += `Score global: ${bestSalle.score}/100.`;
    
    return reasoning;
  }

  // Générer la résolution de conflits
  generateConflictResolution(salles) {
    const conflictedSalles = salles.filter(s => s.availability.conflicts.length > 0);
    
    if (conflictedSalles.length === 0) return null;
    
    return `L'IA a détecté ${conflictedSalles.length} salles avec des conflits et propose des créneaux alternatifs.`;
  }

  // Générer des créneaux alternatifs
  generateAlternativeTimeSlots(salles) {
    const allAlternatives = [];
    
    salles.forEach(salle => {
      if (salle.availability.nextAvailableSlot) {
        salle.availability.nextAvailableSlot.forEach(slot => {
          allAlternatives.push({
            salleId: salle.id,
            salleNom: salle.nom,
            heureDebut: slot.heureDebut,
            heureFin: slot.heureFin,
            score: slot.score,
            localisation: salle.localisation
          });
        });
      }
    });

    return allAlternatives
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 alternatives
  }

  // Générer la stratégie optimale
  generateOptimalStrategy(salles, request) {
    if (salles.length === 0) return "Aucune stratégie disponible";

    const bestSalle = salles[0];
    let strategy = `Stratégie optimale : ${bestSalle.nom} `;

    if (bestSalle.availability.isAvailable) {
      strategy += `(disponible immédiatement)`;
    } else {
      strategy += `(alternatives proposées)`;
    }

    strategy += ` avec priorité sur la capacité (${bestSalle.breakdown.capacity}/100) `;
    strategy += `et la localisation (${bestSalle.breakdown.location}/100).`;

    return strategy;
  }

  // Générer l'analyse de capacité
  generateCapacityAnalysis(salles, request) {
    const capacityStats = salles.reduce((stats, salle) => {
      const ratio = salle.capacite / request.capaciteRequise;
      if (ratio >= 0.8 && ratio <= 1.2) stats.perfect++;
      else if (ratio >= 0.6 && ratio < 0.8) stats.small++;
      else if (ratio > 1.2 && ratio <= 1.5) stats.large++;
      else if (ratio > 1.5) stats.veryLarge++;
      else stats.tooSmall++;
      return stats;
    }, { perfect: 0, small: 0, large: 0, veryLarge: 0, tooSmall: 0 });

    return {
      required: request.capaciteRequise,
      available: salles.map(s => s.capacite),
      distribution: capacityStats,
      recommendation: this.getCapacityRecommendation(capacityStats, request.capaciteRequise)
    };
  }

  // Générer l'analyse de localisation
  generateLocationAnalysis(salles, request) {
    const blocDistribution = {};
    const etageDistribution = {};

    salles.forEach(salle => {
      blocDistribution[salle.blocNom] = (blocDistribution[salle.blocNom] || 0) + 1;
      etageDistribution[salle.etageNumero] = (etageDistribution[salle.etageNumero] || 0) + 1;
    });

    return {
      blocs: blocDistribution,
      etages: etageDistribution,
      preferredBloc: request.blocPrefere,
      preferredEtage: request.etagePrefere,
      recommendation: this.getLocationRecommendation(blocDistribution, etageDistribution, request)
    };
  }

  // Générer l'analyse de timing
  generateTimingAnalysis(salles, request) {
    const timingStats = salles.reduce((stats, salle) => {
      if (salle.availability.isAvailable) stats.immediate++;
      else if (salle.availability.nextAvailableSlot && salle.availability.nextAvailableSlot.length > 0) stats.alternatives++;
      else stats.unavailable++;
      return stats;
    }, { immediate: 0, alternatives: 0, unavailable: 0 });

    return {
      requestedSlot: `${request.heureDebut} - ${request.heureFin}`,
      immediateAvailability: timingStats.immediate,
      alternativesAvailable: timingStats.alternatives,
      recommendation: this.getTimingRecommendation(timingStats, request)
    };
  }

  // Recommandations spécifiques
  getCapacityRecommendation(stats, required) {
    if (stats.perfect > 0) return "Salles parfaitement dimensionnées disponibles";
    if (stats.large > 0) return "Salles légèrement sur-dimensionnées recommandées";
    if (stats.small > 0) return "Salles sous-dimensionnées mais utilisables";
    return "Aucune salle adaptée trouvée";
  }

  getLocationRecommendation(blocDistribution, etageDistribution, request) {
    if (request.blocPrefere && blocDistribution[request.blocPrefere]) {
      return `Bloc préféré ${request.blocPrefere} disponible`;
    }
    if (request.etagePrefere && etageDistribution[request.etagePrefere]) {
      return `Étage préféré ${request.etagePrefere} disponible`;
    }
    return "Localisation flexible recommandée";
  }

  getTimingRecommendation(timingStats, request) {
    if (timingStats.immediate > 0) return "Créneaux immédiatement disponibles";
    if (timingStats.alternatives > 0) return "Alternatives de créneaux proposées";
    return "Aucun créneau disponible pour ce créneau";
  }
}

export default new IntelligentDataService();
