package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.SmartRecommendationRequest;
import affectationsDesSalles.affectationDesSalles.dto.SmartRecommendationResponse;
import affectationsDesSalles.affectationDesSalles.model.Salle;

import java.util.List;

public interface GeminiApiService {
    
    /**
     * Generate smart room recommendations using AI
     */
    SmartRecommendationResponse generateSmartRecommendations(
        SmartRecommendationRequest request, 
        List<Salle> availableRooms
    );
    
    /**
     * Analyze conflict and suggest alternatives
     */
    SmartRecommendationResponse resolveConflict(
        SmartRecommendationRequest request,
        List<Salle> alternativeRooms,
        String conflictDescription
    );
    
    /**
     * Get AI-powered form suggestions
     */
    String getFormSuggestions(String userInput, String context);
}
