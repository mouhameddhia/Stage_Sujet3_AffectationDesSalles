package affectationsDesSalles.affectationDesSalles.dto;

import java.time.LocalTime;
import java.util.List;

public class SmartRecommendationResponse {
    private List<RoomRecommendation> recommendations;
    private String aiReasoning;
    private String conflictAnalysis;
    private List<String> alternativeSuggestions;
    private Integer totalRoomsAnalyzed;
    private String confidenceLevel;
    
    // New fields for intelligent analysis
    private List<TimeSlotRecommendation> alternativeTimeSlots;
    private String optimalStrategy;
    private String conflictResolution;
    private Boolean hasConflicts;
    private String availabilitySummary;
    private String capacityAnalysis;
    private String locationAnalysis;
    private String timingAnalysis;

    // Constructors
    public SmartRecommendationResponse() {}

    public SmartRecommendationResponse(List<RoomRecommendation> recommendations, String aiReasoning) {
        this.recommendations = recommendations;
        this.aiReasoning = aiReasoning;
    }

    // Getters and Setters
    public List<RoomRecommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RoomRecommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public String getAiReasoning() {
        return aiReasoning;
    }

    public void setAiReasoning(String aiReasoning) {
        this.aiReasoning = aiReasoning;
    }

    public String getConflictAnalysis() {
        return conflictAnalysis;
    }

    public void setConflictAnalysis(String conflictAnalysis) {
        this.conflictAnalysis = conflictAnalysis;
    }

    public List<String> getAlternativeSuggestions() {
        return alternativeSuggestions;
    }

    public void setAlternativeSuggestions(List<String> alternativeSuggestions) {
        this.alternativeSuggestions = alternativeSuggestions;
    }

    public Integer getTotalRoomsAnalyzed() {
        return totalRoomsAnalyzed;
    }

    public void setTotalRoomsAnalyzed(Integer totalRoomsAnalyzed) {
        this.totalRoomsAnalyzed = totalRoomsAnalyzed;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public List<TimeSlotRecommendation> getAlternativeTimeSlots() {
        return alternativeTimeSlots;
    }

    public void setAlternativeTimeSlots(List<TimeSlotRecommendation> alternativeTimeSlots) {
        this.alternativeTimeSlots = alternativeTimeSlots;
    }

    public String getOptimalStrategy() {
        return optimalStrategy;
    }

    public void setOptimalStrategy(String optimalStrategy) {
        this.optimalStrategy = optimalStrategy;
    }

    public String getConflictResolution() {
        return conflictResolution;
    }

    public void setConflictResolution(String conflictResolution) {
        this.conflictResolution = conflictResolution;
    }

    public Boolean getHasConflicts() {
        return hasConflicts;
    }

    public void setHasConflicts(Boolean hasConflicts) {
        this.hasConflicts = hasConflicts;
    }

    public String getAvailabilitySummary() {
        return availabilitySummary;
    }

    public void setAvailabilitySummary(String availabilitySummary) {
        this.availabilitySummary = availabilitySummary;
    }

    public String getCapacityAnalysis() {
        return capacityAnalysis;
    }

    public void setCapacityAnalysis(String capacityAnalysis) {
        this.capacityAnalysis = capacityAnalysis;
    }

    public String getLocationAnalysis() {
        return locationAnalysis;
    }

    public void setLocationAnalysis(String locationAnalysis) {
        this.locationAnalysis = locationAnalysis;
    }

    public String getTimingAnalysis() {
        return timingAnalysis;
    }

    public void setTimingAnalysis(String timingAnalysis) {
        this.timingAnalysis = timingAnalysis;
    }

    // Inner class for room recommendations
    public static class RoomRecommendation {
        private Long salleId;
        private String nomSalle;
        private String typeSalle;
        private Integer capacite;
        private String blocNom;
        private String etageNumero;
        private Double score;
        private String reasoning;
        private String availabilityStatus;
        private List<String> advantages;
        private List<String> considerations;
        
        // New fields for intelligent analysis
        private Boolean isOptimal;
        private String whyOptimal;
        private String conflictDetails;
        private List<String> alternativeTimes;
        private String capacityMatch;
        private String locationScore;
        private String timingScore;

        // Constructors
        public RoomRecommendation() {}

        public RoomRecommendation(Long salleId, String nomSalle, String typeSalle, Integer capacite, 
                                String blocNom, String etageNumero, Double score, String reasoning) {
            this.salleId = salleId;
            this.nomSalle = nomSalle;
            this.typeSalle = typeSalle;
            this.capacite = capacite;
            this.blocNom = blocNom;
            this.etageNumero = etageNumero;
            this.score = score;
            this.reasoning = reasoning;
        }

        // Getters and Setters
        public Long getSalleId() {
            return salleId;
        }

        public void setSalleId(Long salleId) {
            this.salleId = salleId;
        }

        public String getNomSalle() {
            return nomSalle;
        }

        public void setNomSalle(String nomSalle) {
            this.nomSalle = nomSalle;
        }

        public String getTypeSalle() {
            return typeSalle;
        }

        public void setTypeSalle(String typeSalle) {
            this.typeSalle = typeSalle;
        }

        public Integer getCapacite() {
            return capacite;
        }

        public void setCapacite(Integer capacite) {
            this.capacite = capacite;
        }

        public String getBlocNom() {
            return blocNom;
        }

        public void setBlocNom(String blocNom) {
            this.blocNom = blocNom;
        }

        public String getEtageNumero() {
            return etageNumero;
        }

        public void setEtageNumero(String etageNumero) {
            this.etageNumero = etageNumero;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }

        public String getReasoning() {
            return reasoning;
        }

        public void setReasoning(String reasoning) {
            this.reasoning = reasoning;
        }

        public String getAvailabilityStatus() {
            return availabilityStatus;
        }

        public void setAvailabilityStatus(String availabilityStatus) {
            this.availabilityStatus = availabilityStatus;
        }

        public List<String> getAdvantages() {
            return advantages;
        }

        public void setAdvantages(List<String> advantages) {
            this.advantages = advantages;
        }

        public List<String> getConsiderations() {
            return considerations;
        }

        public void setConsiderations(List<String> considerations) {
            this.considerations = considerations;
        }

        public Boolean getIsOptimal() {
            return isOptimal;
        }

        public void setIsOptimal(Boolean isOptimal) {
            this.isOptimal = isOptimal;
        }

        public String getWhyOptimal() {
            return whyOptimal;
        }

        public void setWhyOptimal(String whyOptimal) {
            this.whyOptimal = whyOptimal;
        }

        public String getConflictDetails() {
            return conflictDetails;
        }

        public void setConflictDetails(String conflictDetails) {
            this.conflictDetails = conflictDetails;
        }

        public List<String> getAlternativeTimes() {
            return alternativeTimes;
        }

        public void setAlternativeTimes(List<String> alternativeTimes) {
            this.alternativeTimes = alternativeTimes;
        }

        public String getCapacityMatch() {
            return capacityMatch;
        }

        public void setCapacityMatch(String capacityMatch) {
            this.capacityMatch = capacityMatch;
        }

        public String getLocationScore() {
            return locationScore;
        }

        public void setLocationScore(String locationScore) {
            this.locationScore = locationScore;
        }

        public String getTimingScore() {
            return timingScore;
        }

        public void setTimingScore(String timingScore) {
            this.timingScore = timingScore;
        }
    }
    
    // New inner class for time slot recommendations
    public static class TimeSlotRecommendation {
        private LocalTime heureDebut;
        private LocalTime heureFin;
        private String salleNom;
        private Long salleId;
        private Double score;
        private String reasoning;
        private String availabilityStatus;
        private List<String> advantages;
        private List<String> considerations;

        // Constructors
        public TimeSlotRecommendation() {}

        public TimeSlotRecommendation(LocalTime heureDebut, LocalTime heureFin, String salleNom, 
                                    Long salleId, Double score, String reasoning) {
            this.heureDebut = heureDebut;
            this.heureFin = heureFin;
            this.salleNom = salleNom;
            this.salleId = salleId;
            this.score = score;
            this.reasoning = reasoning;
        }

        // Getters and Setters
        public LocalTime getHeureDebut() {
            return heureDebut;
        }

        public void setHeureDebut(LocalTime heureDebut) {
            this.heureDebut = heureDebut;
        }

        public LocalTime getHeureFin() {
            return heureFin;
        }

        public void setHeureFin(LocalTime heureFin) {
            this.heureFin = heureFin;
        }

        public String getSalleNom() {
            return salleNom;
        }

        public void setSalleNom(String salleNom) {
            this.salleNom = salleNom;
        }

        public Long getSalleId() {
            return salleId;
        }

        public void setSalleId(Long salleId) {
            this.salleId = salleId;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }

        public String getReasoning() {
            return reasoning;
        }

        public void setReasoning(String reasoning) {
            this.reasoning = reasoning;
        }

        public String getAvailabilityStatus() {
            return availabilityStatus;
        }

        public void setAvailabilityStatus(String availabilityStatus) {
            this.availabilityStatus = availabilityStatus;
        }

        public List<String> getAdvantages() {
            return advantages;
        }

        public void setAdvantages(List<String> advantages) {
            this.advantages = advantages;
        }

        public List<String> getConsiderations() {
            return considerations;
        }

        public void setConsiderations(List<String> considerations) {
            this.considerations = considerations;
        }
    }
}
