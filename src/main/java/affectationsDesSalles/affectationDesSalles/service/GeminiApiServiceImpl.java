package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.config.GeminiConfig;
import affectationsDesSalles.affectationDesSalles.dto.SmartRecommendationRequest;
import affectationsDesSalles.affectationDesSalles.dto.SmartRecommendationResponse;
import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.model.Affectation;
import affectationsDesSalles.affectationDesSalles.repository.AffectationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiApiServiceImpl implements GeminiApiService {
    
    private static final Logger logger = LoggerFactory.getLogger(GeminiApiServiceImpl.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final AffectationRepository affectationRepository;
    
    @Autowired
    public GeminiApiServiceImpl(GeminiConfig geminiConfig, AffectationRepository affectationRepository) {
        this.geminiConfig = geminiConfig;
        this.restTemplate = new RestTemplate();
        this.affectationRepository = affectationRepository;
    }
    
    @Override
    public SmartRecommendationResponse generateSmartRecommendations(
            SmartRecommendationRequest request, 
            List<Salle> availableRooms) {
        
        try {
            // First, analyze current availability and conflicts
            AvailabilityAnalysis availabilityAnalysis = analyzeAvailability(request, availableRooms);
            
            // Generate intelligent AI recommendations
            String prompt = buildIntelligentRecommendationPrompt(request, availableRooms, availabilityAnalysis);
            String aiResponse = callGeminiApi(prompt);
            
            // Parse and enhance the response
            SmartRecommendationResponse response = parseIntelligentResponse(aiResponse, availableRooms, availabilityAnalysis);
            
            // Add alternative time slots if needed
            if (availabilityAnalysis.hasConflicts()) {
                response.setAlternativeTimeSlots(generateAlternativeTimeSlots(request, availableRooms, availabilityAnalysis));
            }
            
            return response;
            
        } catch (Exception e) {
            logger.error("Error generating intelligent recommendations: {}", e.getMessage(), e);
            return createIntelligentFallbackResponse(availableRooms, null);
        }
    }
    
    @Override
    public SmartRecommendationResponse resolveConflict(
            SmartRecommendationRequest request,
            List<Salle> alternativeRooms,
            String conflictDescription) {
        
        try {
            AvailabilityAnalysis availabilityAnalysis = analyzeAvailability(request, alternativeRooms);
            String prompt = buildConflictResolutionPrompt(request, alternativeRooms, conflictDescription, availabilityAnalysis);
            String aiResponse = callGeminiApi(prompt);
            return parseIntelligentResponse(aiResponse, alternativeRooms, availabilityAnalysis);
            
        } catch (Exception e) {
            logger.error("Error resolving conflict: {}", e.getMessage(), e);
            return createIntelligentFallbackResponse(alternativeRooms, null);
        }
    }
    
    @Override
    public String getFormSuggestions(String userInput, String context) {
        try {
            String prompt = buildFormSuggestionPrompt(userInput, context);
            return callGeminiApi(prompt);
        } catch (Exception e) {
            logger.error("Error getting form suggestions: {}", e.getMessage(), e);
            return "Désolé, je ne peux pas analyser votre demande pour le moment. Veuillez remplir le formulaire manuellement.";
        }
    }
    
    private AvailabilityAnalysis analyzeAvailability(SmartRecommendationRequest request, List<Salle> rooms) {
        AvailabilityAnalysis analysis = new AvailabilityAnalysis();
        
        try {
            // Check for conflicts in requested time slot using REAL database data
            List<Affectation> conflicts = affectationRepository.findConflictingAffectations(
                null, request.getDate(), request.getHeureDebut(), request.getHeureFin(), null);
            
            analysis.setHasConflicts(!conflicts.isEmpty());
            analysis.setConflicts(conflicts);
            
            // Analyze room availability using REAL database data
            Map<Long, Boolean> roomAvailability = new HashMap<>();
            Map<Long, List<Affectation>> roomConflicts = new HashMap<>();
            Map<Long, String> roomConflictDetails = new HashMap<>();
            
            for (Salle room : rooms) {
                // Check for conflicts in this specific room at the requested time
                List<Affectation> roomConflictsList = affectationRepository.findConflictingAffectations(
                    room.getId(), request.getDate(), request.getHeureDebut(), request.getHeureFin(), null);
                
                boolean isAvailable = roomConflictsList.isEmpty();
                roomAvailability.put(room.getId(), isAvailable);
                roomConflicts.put(room.getId(), roomConflictsList);
                
                // Generate detailed conflict information for AI analysis
                if (!isAvailable) {
                    String conflictDetails = generateConflictDetails(roomConflictsList, room);
                    roomConflictDetails.put(room.getId(), conflictDetails);
                }
            }
            
            analysis.setRoomAvailability(roomAvailability);
            analysis.setRoomConflicts(roomConflicts);
            analysis.setRoomConflictDetails(roomConflictDetails);
            
            // Find alternative time slots using REAL database data
            analysis.setAlternativeTimeSlots(findAlternativeTimeSlots(request, rooms));
            
            // Analyze capacity fit for each room
            analysis.setCapacityAnalysis(analyzeCapacityFit(rooms, request));
            
            // Analyze location preferences
            analysis.setLocationAnalysis(analyzeLocationPreferences(rooms, request));
            
            // Analyze room type compatibility
            analysis.setTypeCompatibilityAnalysis(analyzeTypeCompatibility(rooms, request));
            
        } catch (Exception e) {
            logger.error("Error analyzing availability with real database data: {}", e.getMessage(), e);
            // Fallback to basic analysis
            analysis.setHasConflicts(false);
            analysis.setConflicts(new ArrayList<>());
        }
        
        return analysis;
    }
    
    private String generateConflictDetails(List<Affectation> conflicts, Salle room) {
        if (conflicts.isEmpty()) return "Aucun conflit";
        
        StringBuilder details = new StringBuilder();
        details.append("Conflits détectés dans ").append(room.getNom()).append(": ");
        
        for (Affectation conflict : conflicts) {
            details.append("\n- ").append(conflict.getTypeactivite())
                   .append(" de ").append(conflict.getHeuredebut())
                   .append(" à ").append(conflict.getHeurefin())
                   .append(" (ID: ").append(conflict.getIdaffectation()).append(")");
        }
        
        return details.toString();
    }
    
    private Map<Long, String> analyzeCapacityFit(List<Salle> rooms, SmartRecommendationRequest request) {
        Map<Long, String> capacityAnalysis = new HashMap<>();
        
        for (Salle room : rooms) {
            int requiredCapacity = request.getCapaciteRequise();
            int roomCapacity = room.getCapacite();
            int capacityDiff = Math.abs(roomCapacity - requiredCapacity);
            
            String analysis;
            if (capacityDiff == 0) {
                analysis = "Capacité parfaite (" + roomCapacity + "/" + requiredCapacity + ")";
            } else if (capacityDiff <= 5) {
                analysis = "Capacité excellente (" + roomCapacity + "/" + requiredCapacity + ", ±" + capacityDiff + ")";
            } else if (capacityDiff <= 10) {
                analysis = "Capacité bonne (" + roomCapacity + "/" + requiredCapacity + ", ±" + capacityDiff + ")";
            } else if (capacityDiff <= 20) {
                analysis = "Capacité acceptable (" + roomCapacity + "/" + requiredCapacity + ", ±" + capacityDiff + ")";
            } else {
                analysis = "Capacité éloignée (" + roomCapacity + "/" + requiredCapacity + ", ±" + capacityDiff + ")";
            }
            
            capacityAnalysis.put(room.getId(), analysis);
        }
        
        return capacityAnalysis;
    }
    
    private Map<Long, String> analyzeLocationPreferences(List<Salle> rooms, SmartRecommendationRequest request) {
        Map<Long, String> locationAnalysis = new HashMap<>();
        
        for (Salle room : rooms) {
            StringBuilder analysis = new StringBuilder();
            int score = 0;
            
            // Check bloc preference
            if (request.getBlocPrefere() != null && room.getBlocNom() != null) {
                if (request.getBlocPrefere().equalsIgnoreCase(room.getBlocNom())) {
                    analysis.append("Bloc préféré respecté (").append(room.getBlocNom()).append(")");
                    score += 40;
                } else {
                    analysis.append("Bloc différent (").append(room.getBlocNom()).append(" vs ").append(request.getBlocPrefere()).append(")");
                    score += 20;
                }
            } else {
                analysis.append("Bloc: ").append(room.getBlocNom() != null ? room.getBlocNom() : "Non assigné");
                score += 10;
            }
            
            analysis.append(" | ");
            
            // Check étage preference
            if (request.getEtagePrefere() != null && room.getEtageNumero() != null) {
                if (request.getEtagePrefere().equalsIgnoreCase(room.getEtageNumero())) {
                    analysis.append("Étage préféré respecté (").append(room.getEtageNumero()).append(")");
                    score += 30;
                } else {
                    analysis.append("Étage différent (").append(room.getEtageNumero()).append(" vs ").append(request.getEtagePrefere()).append(")");
                    score += 15;
                }
            } else {
                analysis.append("Étage: ").append(room.getEtageNumero() != null ? room.getEtageNumero() : "Non assigné");
                score += 5;
            }
            
            analysis.append(" | Score: ").append(score).append("/70");
            locationAnalysis.put(room.getId(), analysis.toString());
        }
        
        return locationAnalysis;
    }
    
    private Map<Long, String> analyzeTypeCompatibility(List<Salle> rooms, SmartRecommendationRequest request) {
        Map<Long, String> typeAnalysis = new HashMap<>();
        
        for (Salle room : rooms) {
            String roomType = room.getType() != null ? room.getType().toLowerCase() : "";
            String activityType = request.getTypeActivite() != null ? request.getTypeActivite().toLowerCase() : "";
            
            String analysis;
            int score = 0;
            
            // Check type compatibility
            if (roomType.contains("cours") && activityType.contains("cours")) {
                analysis = "Type parfaitement compatible (Cours)";
                score = 100;
            } else if (roomType.contains("laboratoire") && (activityType.contains("tp") || activityType.contains("pratique"))) {
                analysis = "Type parfaitement compatible (Laboratoire)";
                score = 100;
            } else if (roomType.contains("amphithéâtre") && activityType.contains("cours")) {
                analysis = "Type très compatible (Amphithéâtre pour cours)";
                score = 90;
            } else if (roomType.contains("salle") && activityType.contains("cours")) {
                analysis = "Type compatible (Salle standard)";
                score = 80;
            } else if (roomType.contains("réunion") && activityType.contains("réunion")) {
                analysis = "Type parfaitement compatible (Réunion)";
                score = 100;
            } else {
                analysis = "Type fonctionnel mais pas optimal";
                score = 60;
            }
            
            analysis += " | Score: " + score + "/100";
            typeAnalysis.put(room.getId(), analysis);
        }
        
        return typeAnalysis;
    }
    
    private List<TimeSlot> findAlternativeTimeSlots(SmartRecommendationRequest request, List<Salle> rooms) {
        List<TimeSlot> alternatives = new ArrayList<>();
        
        // Check 30 minutes before and after
        int[] timeOffsets = {-30, 30, -60, 60, -90, 90};
        
        for (int offset : timeOffsets) {
            LocalTime newStart = request.getHeureDebut().plusMinutes(offset);
            LocalTime newEnd = request.getHeureFin().plusMinutes(offset);
            
            // Check if this time slot is available for any room
            for (Salle room : rooms) {
                if (room.getCapacite() >= request.getCapaciteRequise()) {
                    List<Affectation> conflicts = affectationRepository.findConflictingAffectations(
                        room.getId(), request.getDate(), newStart, newEnd, null);
                    
                    if (conflicts.isEmpty()) {
                        alternatives.add(new TimeSlot(newStart, newEnd, room.getId(), room.getNom()));
                    }
                }
            }
        }
        
        return alternatives.stream()
            .sorted(Comparator.comparing(ts -> Math.abs(ts.getStartTime().getMinute() - request.getHeureDebut().getMinute())))
            .limit(5)
            .collect(Collectors.toList());
    }
    
    private String buildIntelligentRecommendationPrompt(SmartRecommendationRequest request, 
                                                       List<Salle> availableRooms, 
                                                       AvailabilityAnalysis availabilityAnalysis) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        
        return String.format("""
            En tant qu'expert en gestion de salles et planification d'activités, vous devez analyser cette demande de réservation et fournir des recommandations INTELLIGENTES et OPTIMALES basées sur des données RÉELLES de la base de données.
            
            **DEMANDE DE RÉSERVATION:**
            - Activité: %s
            - Description: %s
            - Capacité requise: %d personnes
            - Capacité acceptable: %d - %d personnes
            - Date: %s
            - Horaire demandé: %s - %s
            - Horaire flexible: %s
            - Marge horaire: %d minutes
            - Préférences: Bloc %s, Étage %s, Type %s
            - Priorités: Capacité=%s, Localisation=%s, Horaire=%s
            - Accessibilité requise: %s
            - Notes spéciales: %s
            
            **ANALYSE RÉELLE DE LA BASE DE DONNÉES:**
            - Conflits détectés: %s
            - Nombre de conflits: %d
            - Salles disponibles: %d/%d
            - Créneaux alternatifs trouvés: %d
            
            **SALLES DISPONIBLES AVEC ANALYSE RÉELLE (%d salles):**
            %s
            
            **CONFLITS DÉTECTÉS (DONNÉES RÉELLES):**
            %s
            
            **CRÉNEAUX ALTERNATIFS (ANALYSÉS EN TEMPS RÉEL):**
            %s
            
            **ANALYSE DÉTAILLÉE DE CHAQUE SALLE:**
            %s
            
            **VOTRE MISSION:**
            Vous devez analyser cette situation RÉELLE et fournir:
            
            1. **ANALYSE INTELLIGENTE** de la situation actuelle basée sur les données réelles
            2. **RECOMMANDATIONS OPTIMALES** de salles avec scores détaillés et justification
            3. **STRATÉGIE DE RÉSOLUTION** des conflits détectés
            4. **CRÉNEAUX ALTERNATIFS** recommandés si nécessaire
            5. **EXPLICATION DÉTAILLÉE** de chaque choix avec référence aux données réelles
            
            **CRITÈRES D'ÉVALUATION (basés sur les données réelles):**
            - Capacité optimale (40%%): Salle ni trop grande ni trop petite selon l'analyse réelle
            - Compatibilité type (25%%): Type de salle adapté à l'activité selon l'analyse réelle
            - Localisation (20%%): Proximité des préférences utilisateur selon l'analyse réelle
            - Disponibilité (15%%): Créneau libre et accessible selon l'analyse réelle
            
            **FORMAT DE RÉPONSE ATTENDU (JSON):**
            {
              "aiReasoning": "Analyse intelligente basée sur les données réelles de la base...",
              "optimalStrategy": "Stratégie recommandée basée sur l'analyse des conflits réels",
              "conflictResolution": "Comment résoudre les conflits détectés dans la base",
              "hasConflicts": true/false,
              "availabilitySummary": "Résumé de la disponibilité réelle",
              "capacityAnalysis": "Analyse des besoins de capacité basée sur les données réelles",
              "locationAnalysis": "Analyse des préférences de localisation basée sur les données réelles",
              "timingAnalysis": "Analyse des contraintes horaires basée sur les données réelles",
              "recommendations": [
                {
                  "salleId": 1,
                  "nomSalle": "A101",
                  "typeSalle": "Salle de cours",
                  "capacite": 30,
                  "blocNom": "Bloc A",
                  "etageNumero": "1er étage",
                  "score": 95.0,
                  "reasoning": "Excellente correspondance capacité, type parfait pour cours, localisation idéale, AUCUN CONFLIT DÉTECTÉ",
                  "availabilityStatus": "Disponible (vérifié dans la base)",
                  "isOptimal": true,
                  "whyOptimal": "Meilleur équilibre capacité/localisation/disponibilité selon l'analyse des données réelles",
                  "conflictDetails": "Aucun conflit détecté dans la base de données",
                  "capacityMatch": "Capacité parfaite (30/30) selon l'analyse",
                  "locationScore": "Bloc préféré respecté (Bloc A)",
                  "timingScore": "Créneau libre (vérifié dans la base)",
                  "advantages": ["Capacité parfaite", "Type idéal", "Localisation préférée", "Aucun conflit"],
                  "considerations": ["Aucune"]
                }
              ],
              "alternativeSuggestions": ["Considérer les créneaux alternatifs suggérés basés sur l'analyse réelle"],
              "totalRoomsAnalyzed": 15,
              "confidenceLevel": "Élevé (basé sur des données réelles)"
            }
            
            Analysez maintenant cette situation RÉELLE de manière INTELLIGENTE et fournissez des recommandations OPTIMALES avec une justification détaillée de chaque choix basée sur les données de la base.
            """,
            request.getTypeActivite(),
            request.getDescriptionActivite() != null ? request.getDescriptionActivite() : "Non spécifiée",
            request.getCapaciteRequise(),
            request.getCapaciteMinAcceptable() != null ? request.getCapaciteMinAcceptable() : request.getCapaciteRequise(),
            request.getCapaciteMaxAcceptable() != null ? request.getCapaciteMaxAcceptable() : request.getCapaciteRequise(),
            request.getDate().format(dateFormatter),
            request.getHeureDebut().format(timeFormatter),
            request.getHeureFin().format(timeFormatter),
            request.getFlexibleHoraire() ? "Oui" : "Non",
            request.getMargeHoraire(),
            request.getBlocPrefere() != null ? request.getBlocPrefere() : "Non spécifié",
            request.getEtagePrefere() != null ? request.getEtagePrefere() : "Non spécifié",
            request.getTypeSallePrefere() != null ? request.getTypeSallePrefere() : "Non spécifié",
            request.getPrioriteCapacite() ? "Élevée" : "Faible",
            request.getPrioriteLocalisation() ? "Élevée" : "Faible",
            request.getPrioriteHoraire() ? "Élevée" : "Faible",
            request.getAccessibiliteRequise() ? "Oui" : "Non",
            request.getNotesSpeciales() != null ? request.getNotesSpeciales() : "Aucune",
            availabilityAnalysis.hasConflicts() ? "OUI" : "NON",
            availabilityAnalysis.getConflicts().size(),
            availabilityAnalysis.getRoomAvailability().values().stream().filter(v -> v).count(),
            availableRooms.size(),
            availabilityAnalysis.getAlternativeTimeSlots().size(),
            availableRooms.size(),
            formatRoomsWithRealAnalysis(availableRooms, availabilityAnalysis),
            formatConflictsForPrompt(availabilityAnalysis.getConflicts()),
            formatAlternativeTimeSlotsForPrompt(availabilityAnalysis.getAlternativeTimeSlots()),
            formatDetailedRoomAnalysis(availableRooms, availabilityAnalysis)
        );
    }
    
    private String formatRoomsWithRealAnalysis(List<Salle> rooms, AvailabilityAnalysis availabilityAnalysis) {
        return rooms.stream()
            .map(room -> {
                boolean isAvailable = availabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false);
                String capacityAnalysis = availabilityAnalysis.getCapacityAnalysis().getOrDefault(room.getId(), "Non analysé");
                String locationAnalysis = availabilityAnalysis.getLocationAnalysis().getOrDefault(room.getId(), "Non analysé");
                String typeAnalysis = availabilityAnalysis.getTypeCompatibilityAnalysis().getOrDefault(room.getId(), "Non analysé");
                String conflictDetails = availabilityAnalysis.getRoomConflictDetails().getOrDefault(room.getId(), "Aucun conflit");
                
                return String.format("- %s (ID: %d): Capacité: %d, Type: %s, Bloc: %s, Étage: %s | Disponible: %s | %s | %s | %s | Conflits: %s",
                    room.getNom(),
                    room.getId(),
                    room.getCapacite(),
                    room.getType(),
                    room.getBlocNom(),
                    room.getEtageNumero(),
                    isAvailable ? "OUI" : "NON",
                    capacityAnalysis,
                    locationAnalysis,
                    typeAnalysis,
                    conflictDetails
                );
            })
            .collect(Collectors.joining("\n"));
    }
    
    private String formatDetailedRoomAnalysis(List<Salle> rooms, AvailabilityAnalysis availabilityAnalysis) {
        return rooms.stream()
            .map(room -> {
                boolean isAvailable = availabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false);
                String capacityAnalysis = availabilityAnalysis.getCapacityAnalysis().getOrDefault(room.getId(), "Non analysé");
                String locationAnalysis = availabilityAnalysis.getLocationAnalysis().getOrDefault(room.getId(), "Non analysé");
                String typeAnalysis = availabilityAnalysis.getTypeCompatibilityAnalysis().getOrDefault(room.getId(), "Non analysé");
                String conflictDetails = availabilityAnalysis.getRoomConflictDetails().getOrDefault(room.getId(), "Aucun conflit");
                
                return String.format("""
                    **SALLE: %s (ID: %d)**
                    - Capacité: %d personnes
                    - Type: %s
                    - Bloc: %s
                    - Étage: %s
                    - Disponibilité: %s
                    - Analyse de capacité: %s
                    - Analyse de localisation: %s
                    - Compatibilité de type: %s
                    - Détails des conflits: %s
                    """,
                    room.getNom(),
                    room.getId(),
                    room.getCapacite(),
                    room.getType(),
                    room.getBlocNom(),
                    room.getEtageNumero(),
                    isAvailable ? "DISPONIBLE" : "CONFLIT DÉTECTÉ",
                    capacityAnalysis,
                    locationAnalysis,
                    typeAnalysis,
                    conflictDetails
                );
            })
            .collect(Collectors.joining("\n\n"));
    }
    
    private String buildConflictResolutionPrompt(SmartRecommendationRequest request, 
                                               List<Salle> alternativeRooms, 
                                               String conflictDescription,
                                               AvailabilityAnalysis availabilityAnalysis) {
        return String.format("""
            **RÉSOLUTION INTELLIGENTE DE CONFLIT DE RÉSERVATION**
            
            **CONFLIT DÉTECTÉ:**
            %s
            
            **DEMANDE ORIGINALE:**
            - Activité: %s
            - Capacité: %d personnes
            - Date: %s
            - Horaire: %s - %s
            
            **ANALYSE DES CONFLITS:**
            - Nombre de conflits: %d
            - Types de conflits: %s
            - Salles affectées: %s
            
            **SALLES ALTERNATIVES DISPONIBLES (%d salles):**
            %s
            
            **CRÉNEAUX ALTERNATIFS:**
            %s
            
            **VOTRE TÂCHE:**
            Analysez cette situation de conflit et recommandez les MEILLEURES solutions:
            
            1. **Salles alternatives optimales** avec justification détaillée
            2. **Créneaux alternatifs recommandés** avec analyse des avantages
            3. **Stratégies de résolution** du conflit avec priorisation
            4. **Recommandations professionnelles** avec explication du raisonnement
            
            Fournissez une réponse structurée en JSON avec des recommandations détaillées et une analyse intelligente.
            """,
            conflictDescription,
            request.getTypeActivite(),
            request.getCapaciteRequise(),
            request.getDate(),
            request.getHeureDebut(),
            request.getHeureFin(),
            availabilityAnalysis.getConflicts().size(),
            analyzeConflictTypes(availabilityAnalysis.getConflicts()),
            analyzeAffectedRooms(availabilityAnalysis.getConflicts()),
            alternativeRooms.size(),
            formatRoomsForPrompt(alternativeRooms),
            formatAlternativeTimeSlotsForPrompt(availabilityAnalysis.getAlternativeTimeSlots())
        );
    }
    
    private String buildFormSuggestionPrompt(String userInput, String context) {
        return String.format("""
            **ANALYSE INTELLIGENTE DE FORMULAIRE**
            
            **ENTRÉE UTILISATEUR:**
            "%s"
            
            **CONTEXTE:**
            %s
            
            **TÂCHE:**
            Analysez cette entrée utilisateur de manière INTELLIGENTE et suggérez:
            
            1. **Type d'activité** probable avec niveau de confiance
            2. **Capacité estimée** nécessaire avec justification
            3. **Type de salle** recommandé avec alternatives
            4. **Préférences de localisation** (si mentionnées)
            5. **Exigences spéciales** (accessibilité, équipements)
            6. **Contraintes horaires** suggérées
            7. **Priorités** à considérer
            
            **FORMAT DE RÉPONSE:**
            Répondez de manière claire, structurée et professionnelle en français, avec des suggestions concrètes et une justification de chaque recommandation.
            """,
            userInput,
            context
        );
    }
    
    private String formatRoomsForPrompt(List<Salle> rooms) {
        return rooms.stream()
            .map(room -> String.format("- %s (ID: %d): Capacité: %d, Type: %s, Bloc: %s, Étage: %s",
                room.getNom(),
                room.getId(),
                room.getCapacite(),
                room.getType(),
                room.getBlocNom(),
                room.getEtageNumero()))
            .collect(Collectors.joining("\n"));
    }
    
    private String formatConflictsForPrompt(List<Affectation> conflicts) {
        if (conflicts.isEmpty()) return "Aucun conflit détecté";
        
        return conflicts.stream()
            .map(conflict -> String.format("- Conflit: %s - %s dans %s (ID: %d)",
                conflict.getHeuredebut(),
                conflict.getHeurefin(),
                conflict.getSalle().getNom(),
                conflict.getSalle().getId()))
            .collect(Collectors.joining("\n"));
    }
    
    private String formatAlternativeTimeSlotsForPrompt(List<TimeSlot> timeSlots) {
        if (timeSlots.isEmpty()) return "Aucun créneau alternatif trouvé";
        
        return timeSlots.stream()
            .map(ts -> String.format("- %s - %s dans %s",
                ts.getStartTime(),
                ts.getEndTime(),
                ts.getSalleNom()))
            .collect(Collectors.joining("\n"));
    }
    
    private String analyzeConflictTypes(List<Affectation> conflicts) {
        if (conflicts.isEmpty()) return "Aucun";
        
        Set<String> types = conflicts.stream()
            .map(Affectation::getTypeactivite)
            .collect(Collectors.toSet());
        
        return String.join(", ", types);
    }
    
    private String analyzeAffectedRooms(List<Affectation> conflicts) {
        if (conflicts.isEmpty()) return "Aucune";
        
        Set<String> rooms = conflicts.stream()
            .map(conflict -> conflict.getSalle().getNom())
            .collect(Collectors.toSet());
        
        return String.join(", ", rooms);
    }
    
    private String callGeminiApi(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiConfig.getKey());
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Arrays.asList(
                Map.of("parts", Arrays.asList(
                    Map.of("text", prompt)
                ))
            ));
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                geminiConfig.getBaseUrl(),
                HttpMethod.POST,
                entity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return extractTextFromResponse(response.getBody());
            } else {
                throw new RuntimeException("Gemini API returned status: " + response.getStatusCode());
            }
            
        } catch (ResourceAccessException e) {
            logger.error("Network error calling Gemini API: {}", e.getMessage());
            throw new RuntimeException("Erreur de connexion à l'API Gemini", e);
        } catch (Exception e) {
            logger.error("Error calling Gemini API: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'appel à l'API Gemini", e);
        }
    }
    
    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }
            throw new RuntimeException("Unexpected response format from Gemini API");
        } catch (Exception e) {
            logger.error("Error parsing Gemini API response: {}", e.getMessage());
            throw new RuntimeException("Erreur lors de l'analyse de la réponse de l'API Gemini", e);
        }
    }
    
    private SmartRecommendationResponse parseIntelligentResponse(String aiResponse, 
                                                               List<Salle> availableRooms, 
                                                               AvailabilityAnalysis availabilityAnalysis) {
        try {
            JsonNode responseJson = objectMapper.readTree(aiResponse);
            return parseIntelligentJsonResponse(responseJson, availableRooms, availabilityAnalysis);
        } catch (Exception e) {
            logger.warn("Failed to parse JSON response, creating intelligent fallback: {}", e.getMessage());
            return createIntelligentFallbackResponse(availableRooms, availabilityAnalysis);
        }
    }
    
    private SmartRecommendationResponse parseIntelligentJsonResponse(JsonNode responseJson, 
                                                                   List<Salle> availableRooms,
                                                                   AvailabilityAnalysis availabilityAnalysis) {
        SmartRecommendationResponse response = new SmartRecommendationResponse();
        
        try {
            // Parse intelligent analysis
            response.setAiReasoning(responseJson.path("aiReasoning").asText("Analyse IA non disponible"));
            response.setOptimalStrategy(responseJson.path("optimalStrategy").asText("Stratégie non spécifiée"));
            response.setConflictResolution(responseJson.path("conflictResolution").asText(""));
            response.setHasConflicts(availabilityAnalysis.hasConflicts());
            response.setAvailabilitySummary(responseJson.path("availabilitySummary").asText(""));
            response.setCapacityAnalysis(responseJson.path("capacityAnalysis").asText(""));
            response.setLocationAnalysis(responseJson.path("locationAnalysis").asText(""));
            response.setTimingAnalysis(responseJson.path("timingAnalysis").asText(""));
            
            // Parse recommendations
            List<SmartRecommendationResponse.RoomRecommendation> recommendations = new ArrayList<>();
            JsonNode recsNode = responseJson.path("recommendations");
            
            if (recsNode.isArray()) {
                for (JsonNode recNode : recsNode) {
                    SmartRecommendationResponse.RoomRecommendation rec = new SmartRecommendationResponse.RoomRecommendation();
                    rec.setSalleId(recNode.path("salleId").asLong());
                    rec.setNomSalle(recNode.path("nomSalle").asText());
                    rec.setTypeSalle(recNode.path("typeSalle").asText());
                    rec.setCapacite(recNode.path("capacite").asInt());
                    rec.setBlocNom(recNode.path("blocNom").asText());
                    rec.setEtageNumero(recNode.path("etageNumero").asText());
                    rec.setScore(recNode.path("score").asDouble());
                    rec.setReasoning(recNode.path("reasoning").asText());
                    rec.setAvailabilityStatus(recNode.path("availabilityStatus").asText());
                    rec.setIsOptimal(recNode.path("isOptimal").asBoolean(false));
                    rec.setWhyOptimal(recNode.path("whyOptimal").asText(""));
                    rec.setConflictDetails(recNode.path("conflictDetails").asText(""));
                    rec.setCapacityMatch(recNode.path("capacityMatch").asText(""));
                    rec.setLocationScore(recNode.path("locationScore").asText(""));
                    rec.setTimingScore(recNode.path("timingScore").asText(""));
                    
                    // Parse arrays
                    List<String> advantages = new ArrayList<>();
                    JsonNode advNode = recNode.path("advantages");
                    if (advNode.isArray()) {
                        advNode.forEach(adv -> advantages.add(adv.asText()));
                    }
                    rec.setAdvantages(advantages);
                    
                    List<String> considerations = new ArrayList<>();
                    JsonNode consNode = recNode.path("considerations");
                    if (consNode.isArray()) {
                        consNode.forEach(cons -> considerations.add(cons.asText()));
                    }
                    rec.setConsiderations(considerations);
                    
                    recommendations.add(rec);
                }
            }
            
            response.setRecommendations(recommendations);
            response.setAlternativeSuggestions(Arrays.asList("Considérer les créneaux alternatifs suggérés"));
            response.setTotalRoomsAnalyzed(availableRooms.size());
            response.setConfidenceLevel(responseJson.path("confidenceLevel").asText("Moyen"));
            
        } catch (Exception e) {
            logger.error("Error parsing intelligent JSON response: {}", e.getMessage());
            return createIntelligentFallbackResponse(availableRooms, availabilityAnalysis);
        }
        
        return response;
    }
    
        private SmartRecommendationResponse createIntelligentFallbackResponse(List<Salle> availableRooms, 
                                                                         AvailabilityAnalysis availabilityAnalysis) {
        SmartRecommendationResponse response = new SmartRecommendationResponse();
        
        // Create a final copy of availabilityAnalysis to use in lambda
        final AvailabilityAnalysis finalAvailabilityAnalysis;
        if (availabilityAnalysis == null) {
            // Create basic fallback if no analysis available
            finalAvailabilityAnalysis = new AvailabilityAnalysis();
            finalAvailabilityAnalysis.setHasConflicts(false);
            finalAvailabilityAnalysis.setConflicts(new ArrayList<>());
            finalAvailabilityAnalysis.setRoomAvailability(new HashMap<>());
            finalAvailabilityAnalysis.setRoomConflicts(new HashMap<>());
            finalAvailabilityAnalysis.setCapacityAnalysis(new HashMap<>());
            finalAvailabilityAnalysis.setLocationAnalysis(new HashMap<>());
            finalAvailabilityAnalysis.setTypeCompatibilityAnalysis(new HashMap<>());
        } else {
            finalAvailabilityAnalysis = availabilityAnalysis;
        }
        
        // Create intelligent recommendations based on REAL database analysis
        List<SmartRecommendationResponse.RoomRecommendation> recommendations = availableRooms.stream()
            .limit(3)
            .map(room -> {
                double score = calculateIntelligentScore(room, finalAvailabilityAnalysis);
                String reasoning = generateIntelligentReasoning(room, finalAvailabilityAnalysis);
                
                SmartRecommendationResponse.RoomRecommendation rec = new SmartRecommendationResponse.RoomRecommendation(
                    room.getId(),
                    room.getNom(),
                    room.getType(),
                    room.getCapacite(),
                    room.getBlocNom(),
                    room.getEtageNumero(),
                    score,
                    reasoning
                );
                
                // Set additional intelligent fields
                rec.setIsOptimal(score >= 90.0);
                rec.setWhyOptimal(score >= 90.0 ? "Score élevé basé sur l'analyse des données réelles" : "Score moyen, alternatives disponibles");
                rec.setAvailabilityStatus(finalAvailabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false) ? "Disponible" : "Conflit détecté");
                rec.setCapacityMatch(finalAvailabilityAnalysis.getCapacityAnalysis().getOrDefault(room.getId(), "Non analysé"));
                rec.setLocationScore(finalAvailabilityAnalysis.getLocationAnalysis().getOrDefault(room.getId(), "Non analysé"));
                rec.setTimingScore("Analysé en temps réel");
                
                // Set advantages and considerations based on real analysis
                List<String> advantages = new ArrayList<>();
                List<String> considerations = new ArrayList<>();
                
                // Capacity advantages
                String capacityAnalysis = finalAvailabilityAnalysis.getCapacityAnalysis().getOrDefault(room.getId(), "");
                if (capacityAnalysis.contains("parfaite") || capacityAnalysis.contains("excellente")) {
                    advantages.add("Capacité optimale");
                }
                
                // Location advantages
                String locationAnalysis = finalAvailabilityAnalysis.getLocationAnalysis().getOrDefault(room.getId(), "");
                if (locationAnalysis.contains("préféré respecté")) {
                    advantages.add("Localisation préférée");
                }
                
                // Type advantages
                String typeAnalysis = finalAvailabilityAnalysis.getTypeCompatibilityAnalysis().getOrDefault(room.getId(), "");
                if (typeAnalysis.contains("parfaitement compatible")) {
                    advantages.add("Type idéal");
                }
                
                // Availability advantages
                if (finalAvailabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false)) {
                    advantages.add("Aucun conflit détecté");
                } else {
                    considerations.add("Conflits détectés dans cette salle");
                }
                
                // Add capacity considerations
                if (capacityAnalysis.contains("éloignée")) {
                    considerations.add("Capacité très différente de la demande");
                }
                
                // Add location considerations
                if (locationAnalysis.contains("différent")) {
                    considerations.add("Localisation différente des préférences");
                }
                
                rec.setAdvantages(advantages.isEmpty() ? List.of("Analyse en cours") : advantages);
                rec.setConsiderations(considerations.isEmpty() ? List.of("Aucune") : considerations);
                
                return rec;
            })
            .sorted((r1, r2) -> Double.compare(r2.getScore(), r1.getScore()))
            .collect(Collectors.toList());
        
        response.setRecommendations(recommendations);
        response.setAiReasoning("Recommandations générées par l'algorithme intelligent basé sur l'analyse RÉELLE des données (IA temporairement indisponible)");
        response.setConflictAnalysis(finalAvailabilityAnalysis.hasConflicts() ? "Conflits détectés et analysés dans la base de données" : "Aucun conflit détecté dans la base de données");
        response.setAlternativeSuggestions(Arrays.asList("Vérifiez la disponibilité des salles suggérées basée sur l'analyse réelle"));
        response.setTotalRoomsAnalyzed(availableRooms.size());
        response.setConfidenceLevel("Moyen (basé sur l'analyse des données réelles)");
        response.setHasConflicts(finalAvailabilityAnalysis.hasConflicts());
        response.setOptimalStrategy("Stratégie basée sur l'analyse des conflits réels détectés");
        
        // Set detailed analysis based on real data
        if (finalAvailabilityAnalysis.hasConflicts()) {
            response.setConflictResolution("Conflits détectés dans la base. Considérez les créneaux alternatifs suggérés.");
        }
        
        response.setAvailabilitySummary(String.format("Analyse de %d salles avec %d conflits détectés", 
            availableRooms.size(), finalAvailabilityAnalysis.getConflicts().size()));
        
        return response;
    }
    
    private String generateIntelligentReasoning(Salle room, AvailabilityAnalysis availabilityAnalysis) {
        StringBuilder reasoning = new StringBuilder();
        
        // Capacity reasoning
        String capacityAnalysis = availabilityAnalysis.getCapacityAnalysis().getOrDefault(room.getId(), "");
        if (capacityAnalysis.contains("parfaite")) {
            reasoning.append("Capacité parfaite. ");
        } else if (capacityAnalysis.contains("excellente")) {
            reasoning.append("Capacité excellente. ");
        } else if (capacityAnalysis.contains("bonne")) {
            reasoning.append("Capacité bonne. ");
        } else {
            reasoning.append("Capacité acceptable. ");
        }
        
        // Location reasoning
        String locationAnalysis = availabilityAnalysis.getLocationAnalysis().getOrDefault(room.getId(), "");
        if (locationAnalysis.contains("préféré respecté")) {
            reasoning.append("Localisation préférée respectée. ");
        } else if (locationAnalysis.contains("différent")) {
            reasoning.append("Localisation différente des préférences. ");
        }
        
        // Type reasoning
        String typeAnalysis = availabilityAnalysis.getTypeCompatibilityAnalysis().getOrDefault(room.getId(), "");
        if (typeAnalysis.contains("parfaitement compatible")) {
            reasoning.append("Type parfaitement compatible. ");
        } else if (typeAnalysis.contains("très compatible")) {
            reasoning.append("Type très compatible. ");
        } else {
            reasoning.append("Type fonctionnel. ");
        }
        
        // Availability reasoning
        if (availabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false)) {
            reasoning.append("Aucun conflit détecté dans la base de données. ");
        } else {
            reasoning.append("Conflits détectés dans la base de données. ");
        }
        
        reasoning.append("Recommandation basée sur l'analyse des données réelles.");
        
        return reasoning.toString();
    }
    
    private double calculateIntelligentScore(Salle room, AvailabilityAnalysis availabilityAnalysis) {
        double score = 0.0;
        
        // Availability score (40%) - Based on REAL database conflicts
        if (availabilityAnalysis.getRoomAvailability().getOrDefault(room.getId(), false)) {
            score += 40; // Room is available at requested time
        } else {
            score += 10; // Room has conflicts, but still usable
        }
        
        // Capacity score (30%) - Based on REAL capacity analysis
        String capacityAnalysis = availabilityAnalysis.getCapacityAnalysis().getOrDefault(room.getId(), "");
        if (capacityAnalysis.contains("parfaite")) {
            score += 30;
        } else if (capacityAnalysis.contains("excellente")) {
            score += 25;
        } else if (capacityAnalysis.contains("bonne")) {
            score += 20;
        } else if (capacityAnalysis.contains("acceptable")) {
            score += 15;
        } else {
            score += 10; // Capacity éloignée
        }
        
        // Location score (20%) - Based on REAL location analysis
        String locationAnalysis = availabilityAnalysis.getLocationAnalysis().getOrDefault(room.getId(), "");
        if (locationAnalysis.contains("préféré respecté")) {
            score += 20;
        } else if (locationAnalysis.contains("différent")) {
            score += 10;
        } else {
            score += 5; // Non assigné ou pas de préférence
        }
        
        // Type compatibility score (10%) - Based on REAL type analysis
        String typeAnalysis = availabilityAnalysis.getTypeCompatibilityAnalysis().getOrDefault(room.getId(), "");
        if (typeAnalysis.contains("parfaitement compatible")) {
            score += 10;
        } else if (typeAnalysis.contains("très compatible")) {
            score += 8;
        } else if (typeAnalysis.contains("compatible")) {
            score += 6;
        } else {
            score += 3; // Fonctionnel mais pas optimal
        }
        
        return Math.min(100.0, score);
    }
    
    private List<SmartRecommendationResponse.TimeSlotRecommendation> generateAlternativeTimeSlots(
            SmartRecommendationRequest request, 
            List<Salle> availableRooms, 
            AvailabilityAnalysis availabilityAnalysis) {
        
        List<SmartRecommendationResponse.TimeSlotRecommendation> timeSlots = new ArrayList<>();
        
        for (TimeSlot ts : availabilityAnalysis.getAlternativeTimeSlots()) {
            Salle salle = availableRooms.stream()
                .filter(r -> r.getId().equals(ts.getSalleId()))
                .findFirst()
                .orElse(null);
            
            if (salle != null) {
                double score = calculateTimeSlotScore(ts, request, salle);
                timeSlots.add(new SmartRecommendationResponse.TimeSlotRecommendation(
                    ts.getStartTime(),
                    ts.getEndTime(),
                    ts.getSalleNom(),
                    ts.getSalleId(),
                    score,
                    "Créneau alternatif disponible"
                ));
            }
        }
        
        return timeSlots.stream()
            .sorted((t1, t2) -> Double.compare(t2.getScore(), t1.getScore()))
            .limit(3)
            .collect(Collectors.toList());
    }
    
    private double calculateTimeSlotScore(TimeSlot timeSlot, SmartRecommendationRequest request, Salle salle) {
        double score = 0.0;
        
        // Time proximity score (50%)
        long minutesDiff = Math.abs(timeSlot.getStartTime().getMinute() - request.getHeureDebut().getMinute());
        if (minutesDiff <= 30) score += 50;
        else if (minutesDiff <= 60) score += 30;
        else if (minutesDiff <= 90) score += 20;
        else score += 10;
        
        // Room capacity score (30%)
        if (salle.getCapacite() >= request.getCapaciteRequise()) {
            score += 30;
        }
        
        // Availability score (20%)
        score += 20; // Already confirmed available
        
        return Math.min(100.0, score);
    }
    
    // Helper classes
    private static class AvailabilityAnalysis {
        private Boolean hasConflicts = false;
        private List<Affectation> conflicts = new ArrayList<>();
        private Map<Long, Boolean> roomAvailability = new HashMap<>();
        private Map<Long, List<Affectation>> roomConflicts = new HashMap<>();
        private Map<Long, String> roomConflictDetails = new HashMap<>();
        private Map<Long, String> capacityAnalysis = new HashMap<>();
        private Map<Long, String> locationAnalysis = new HashMap<>();
        private Map<Long, String> typeCompatibilityAnalysis = new HashMap<>();
        private List<TimeSlot> alternativeTimeSlots = new ArrayList<>();
        
        // Getters and Setters
        public Boolean hasConflicts() { return hasConflicts; }
        public void setHasConflicts(Boolean hasConflicts) { this.hasConflicts = hasConflicts; }
        
        public List<Affectation> getConflicts() { return conflicts; }
        public void setConflicts(List<Affectation> conflicts) { this.conflicts = conflicts; }
        
        public Map<Long, Boolean> getRoomAvailability() { return roomAvailability; }
        public void setRoomAvailability(Map<Long, Boolean> roomAvailability) { this.roomAvailability = roomAvailability; }
        
        public Map<Long, List<Affectation>> getRoomConflicts() { return roomConflicts; }
        public void setRoomConflicts(Map<Long, List<Affectation>> roomConflicts) { this.roomConflicts = roomConflicts; }
        
        public Map<Long, String> getRoomConflictDetails() { return roomConflictDetails; }
        public void setRoomConflictDetails(Map<Long, String> roomConflictDetails) { this.roomConflictDetails = roomConflictDetails; }
        
        public Map<Long, String> getCapacityAnalysis() { return capacityAnalysis; }
        public void setCapacityAnalysis(Map<Long, String> capacityAnalysis) { this.capacityAnalysis = capacityAnalysis; }
        
        public Map<Long, String> getLocationAnalysis() { return locationAnalysis; }
        public void setLocationAnalysis(Map<Long, String> locationAnalysis) { this.locationAnalysis = locationAnalysis; }
        
        public Map<Long, String> getTypeCompatibilityAnalysis() { return typeCompatibilityAnalysis; }
        public void setTypeCompatibilityAnalysis(Map<Long, String> typeCompatibilityAnalysis) { this.typeCompatibilityAnalysis = typeCompatibilityAnalysis; }
        
        public List<TimeSlot> getAlternativeTimeSlots() { return alternativeTimeSlots; }
        public void setAlternativeTimeSlots(List<TimeSlot> alternativeTimeSlots) { this.alternativeTimeSlots = alternativeTimeSlots; }
    }
    
    private static class TimeSlot {
        private LocalTime startTime;
        private LocalTime endTime;
        private Long salleId;
        private String salleNom;
        
        public TimeSlot(LocalTime startTime, LocalTime endTime, Long salleId, String salleNom) {
            this.startTime = startTime;
            this.endTime = endTime;
            this.salleId = salleId;
            this.salleNom = salleNom;
        }
        
        // Getters
        public LocalTime getStartTime() { return startTime; }
        public LocalTime getEndTime() { return endTime; }
        public Long getSalleId() { return salleId; }
        public String getSalleNom() { return salleNom; }
    }
}
