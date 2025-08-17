package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.dto.SmartRecommendationRequest;
import affectationsDesSalles.affectationDesSalles.dto.SmartRecommendationResponse;
import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.service.GeminiApiService;
import affectationsDesSalles.affectationDesSalles.service.SalleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/smart-recommendations")
@CrossOrigin(origins = "*")
public class SmartRecommendationController {
    
    private final GeminiApiService geminiApiService;
    private final SalleService salleService;
    
    @Autowired
    public SmartRecommendationController(GeminiApiService geminiApiService, SalleService salleService) {
        this.geminiApiService = geminiApiService;
        this.salleService = salleService;
    }
    
    /**
     * POST /api/smart-recommendations/rooms
     * Generate INTELLIGENT AI-powered room recommendations with REAL database analysis
     */
    @PostMapping("/rooms")
    public ResponseEntity<SmartRecommendationResponse> getSmartRoomRecommendations(
            @Valid @RequestBody SmartRecommendationRequest request) {
        
        try {
            // Get all rooms from REAL database
            List<Salle> allRooms = salleService.getAllSalles();
            
            if (allRooms.isEmpty()) {
                return ResponseEntity.ok(createNoRoomsResponse(request));
            }
            
            // Filter rooms by capacity requirements using REAL data
            List<Salle> availableRooms = allRooms.stream()
                .filter(room -> {
                    // Check minimum capacity
                    if (request.getCapaciteMinAcceptable() != null && 
                        room.getCapacite() < request.getCapaciteMinAcceptable()) {
                        return false;
                    }
                    // Check maximum capacity
                    if (request.getCapaciteMaxAcceptable() != null && 
                        room.getCapacite() > request.getCapaciteMaxAcceptable()) {
                        return false;
                    }
                    // Check required capacity
                    return room.getCapacite() >= request.getCapaciteRequise();
                })
                .filter(room -> {
                    // Filter by bloc preference if specified
                    if (request.getBlocPrefere() != null && room.getBlocNom() != null) {
                        return room.getBlocNom().equalsIgnoreCase(request.getBlocPrefere());
                    }
                    return true;
                })
                .filter(room -> {
                    // Filter by étage preference if specified
                    if (request.getEtagePrefere() != null && room.getEtageNumero() != null) {
                        return room.getEtageNumero().equalsIgnoreCase(request.getEtagePrefere());
                    }
                    return true;
                })
                .filter(room -> {
                    // Filter by room type preference if specified
                    if (request.getTypeSallePrefere() != null && room.getType() != null) {
                        return room.getType().toLowerCase().contains(request.getTypeSallePrefere().toLowerCase());
                    }
                    return true;
                })
                .toList();
            
            if (availableRooms.isEmpty()) {
                return ResponseEntity.ok(createNoRoomsResponse(request));
            }
            
            // Generate INTELLIGENT AI recommendations with REAL database analysis
            SmartRecommendationResponse response = geminiApiService.generateSmartRecommendations(request, availableRooms);
            
            // Add additional metadata about the analysis
            response.setTotalRoomsAnalyzed(availableRooms.size());
            response.setCapacityAnalysis(String.format("Analysé %d salles avec capacité requise: %d personnes", 
                availableRooms.size(), request.getCapaciteRequise()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Erreur lors de la génération des recommandations intelligentes basées sur les données réelles: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/smart-recommendations/conflict-resolution
     * Resolve conflicts with INTELLIGENT AI-powered alternatives
     */
    @PostMapping("/conflict-resolution")
    public ResponseEntity<SmartRecommendationResponse> resolveConflict(
            @Valid @RequestBody SmartRecommendationRequest request,
            @RequestParam String conflictDescription) {
        
        try {
            // Get alternative rooms with capacity filtering
            List<Salle> alternativeRooms = salleService.getAllSalles().stream()
                .filter(room -> {
                    if (request.getCapaciteMinAcceptable() != null && 
                        room.getCapacite() < request.getCapaciteMinAcceptable()) {
                        return false;
                    }
                    if (request.getCapaciteMaxAcceptable() != null && 
                        room.getCapacite() > request.getCapaciteMaxAcceptable()) {
                        return false;
                    }
                    return room.getCapacite() >= request.getCapaciteRequise();
                })
                .toList();
            
            if (alternativeRooms.isEmpty()) {
                return ResponseEntity.ok(createNoRoomsResponse(request));
            }
            
            // Generate INTELLIGENT AI conflict resolution
            SmartRecommendationResponse response = geminiApiService.resolveConflict(
                request, alternativeRooms, conflictDescription);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Erreur lors de la résolution intelligente du conflit: " + e.getMessage()));
        }
    }
    
    /**
     * POST /api/smart-recommendations/form-suggestions
     * Get INTELLIGENT AI-powered form suggestions
     */
    @PostMapping("/form-suggestions")
    public ResponseEntity<String> getFormSuggestions(
            @RequestParam String userInput,
            @RequestParam(defaultValue = "Formulaire de réservation de salle") String context) {
        
        try {
            String suggestions = geminiApiService.getFormSuggestions(userInput, context);
            return ResponseEntity.ok(suggestions);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Erreur lors de l'analyse intelligente de votre demande: " + e.getMessage());
        }
    }
    
    /**
     * GET /api/smart-recommendations/health
     * Check if AI service is available and healthy
     */
    @GetMapping("/health")
    public ResponseEntity<Object> checkHealth() {
        try {
            // Simple test call to check if Gemini API is accessible
            String testResponse = geminiApiService.getFormSuggestions("test", "test");
            return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "aiService", "available",
                "message", "Service de recommandations IA INTELLIGENT opérationnel",
                "features", List.of(
                    "Analyse intelligente des conflits",
                    "Recommandations optimales de salles",
                    "Créneaux alternatifs intelligents",
                    "Résolution automatique des conflits"
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                "status", "unhealthy",
                "aiService", "unavailable",
                "message", "Service de recommandations IA temporairement indisponible",
                "error", e.getMessage(),
                "fallback", "Algorithme intelligent de base disponible"
            ));
        }
    }
    
    /**
     * GET /api/smart-recommendations/capabilities
     * Get detailed information about AI capabilities
     */
    @GetMapping("/capabilities")
    public ResponseEntity<Object> getCapabilities() {
        return ResponseEntity.ok(Map.of(
            "systemName", "Système de Recommandations Intelligentes pour l'Affectation des Salles",
            "aiModel", "Google Gemini Pro",
            "capabilities", Map.of(
                "intelligentAnalysis", "Analyse intelligente des besoins et contraintes",
                "conflictDetection", "Détection automatique des conflits de réservation",
                "optimalRecommendations", "Recommandations optimales basées sur l'IA",
                "alternativeTimeSlots", "Suggestion de créneaux alternatifs intelligents",
                "conflictResolution", "Résolution automatique des conflits",
                "capacityOptimization", "Optimisation de la capacité des salles",
                "locationPreference", "Prise en compte des préférences de localisation",
                "formAssistance", "Assistance intelligente pour le remplissage des formulaires"
            ),
            "scoringCriteria", Map.of(
                "capacityOptimal", "40% - Salle ni trop grande ni trop petite",
                "typeCompatibility", "25% - Type de salle adapté à l'activité",
                "locationPreference", "20% - Proximité des préférences utilisateur",
                "availability", "15% - Créneau libre et accessible"
            ),
            "fallbackSystem", "Algorithme intelligent de base en cas d'indisponibilité de l'IA"
        ));
    }
    
    private SmartRecommendationResponse createNoRoomsResponse(SmartRecommendationRequest request) {
        SmartRecommendationResponse response = new SmartRecommendationResponse();
        response.setRecommendations(List.of());
        response.setAiReasoning("Aucune salle disponible correspondant aux critères de capacité spécifiés");
        response.setConflictAnalysis("Aucun conflit à analyser - problème de capacité");
        response.setAlternativeSuggestions(List.of(
            "Réduire la capacité requise",
            "Augmenter la capacité maximale acceptable",
            "Choisir une date différente",
            "Consulter la disponibilité des salles existantes"
        ));
        response.setTotalRoomsAnalyzed(0);
        response.setConfidenceLevel("N/A");
        response.setHasConflicts(false);
        response.setOptimalStrategy("Aucune stratégie possible avec les contraintes actuelles");
        response.setCapacityAnalysis(String.format("Capacité requise: %d, Capacité disponible: Insuffisante", 
            request.getCapaciteRequise()));
        return response;
    }
    
    private SmartRecommendationResponse createErrorResponse(String errorMessage) {
        SmartRecommendationResponse response = new SmartRecommendationResponse();
        response.setRecommendations(List.of());
        response.setAiReasoning("Erreur lors de l'analyse IA intelligente");
        response.setConflictAnalysis("Analyse non disponible");
        response.setAlternativeSuggestions(List.of(
            "Réessayer plus tard",
            "Utiliser les recommandations de base",
            "Contacter l'administrateur",
            "Vérifier la configuration du service IA"
        ));
        response.setTotalRoomsAnalyzed(0);
        response.setConfidenceLevel("Faible");
        response.setHasConflicts(false);
        response.setOptimalStrategy("Stratégie non disponible en raison d'une erreur");
        response.setAiReasoning("Erreur: " + errorMessage);
        return response;
    }
}
