package affectationsDesSalles.affectationDesSalles.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class SmartRecommendationRequest {
    @NotNull(message = "La date est requise")
    private LocalDate date;
    
    @NotNull(message = "L'heure de début est requise")
    private LocalTime heureDebut;
    
    @NotNull(message = "L'heure de fin est requise")
    private LocalTime heureFin;
    
    @NotNull(message = "Le type d'activité est requis")
    private String typeActivite;
    
    @NotNull(message = "La capacité requise est requise")
    @Positive(message = "La capacité doit être positive")
    private Integer capaciteRequise;
    
    private String descriptionActivite;
    private String blocPrefere;
    private String etagePrefere;
    private String typeSallePrefere;
    private Boolean accessibiliteRequise = false;
    private String notesSpeciales;
    
    // New fields for intelligent analysis
    private Integer capaciteMaxAcceptable; // Maximum capacity willing to accept
    private Integer capaciteMinAcceptable; // Minimum capacity willing to accept
    private List<String> blocsAcceptables; // List of acceptable blocs
    private List<String> typesSalleAcceptables; // List of acceptable room types
    private Boolean flexibleHoraire = false; // Willing to adjust time if needed
    private Integer margeHoraire = 0; // Time margin in minutes for alternatives
    private LocalTime heureDebutMin; // Earliest acceptable start time
    private LocalTime heureFinMax; // Latest acceptable end time
    private Boolean prioriteCapacite = true; // Priority: capacity vs location vs time
    private Boolean prioriteLocalisation = false;
    private Boolean prioriteHoraire = false;

    // Constructors
    public SmartRecommendationRequest() {}

    public SmartRecommendationRequest(LocalDate date, LocalTime heureDebut, LocalTime heureFin, 
                                    String typeActivite, Integer capaciteRequise) {
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.typeActivite = typeActivite;
        this.capaciteRequise = capaciteRequise;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

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

    public String getTypeActivite() {
        return typeActivite;
    }

    public void setTypeActivite(String typeActivite) {
        this.typeActivite = typeActivite;
    }

    public Integer getCapaciteRequise() {
        return capaciteRequise;
    }

    public void setCapaciteRequise(Integer capaciteRequise) {
        this.capaciteRequise = capaciteRequise;
    }

    public String getDescriptionActivite() {
        return descriptionActivite;
    }

    public void setDescriptionActivite(String descriptionActivite) {
        this.descriptionActivite = descriptionActivite;
    }

    public String getBlocPrefere() {
        return blocPrefere;
    }

    public void setBlocPrefere(String blocPrefere) {
        this.blocPrefere = blocPrefere;
    }

    public String getEtagePrefere() {
        return etagePrefere;
    }

    public void setEtagePrefere(String etagePrefere) {
        this.etagePrefere = etagePrefere;
    }

    public String getTypeSallePrefere() {
        return typeSallePrefere;
    }

    public void setTypeSallePrefere(String typeSallePrefere) {
        this.typeSallePrefere = typeSallePrefere;
    }

    public Boolean getAccessibiliteRequise() {
        return accessibiliteRequise;
    }

    public void setAccessibiliteRequise(Boolean accessibiliteRequise) {
        this.accessibiliteRequise = accessibiliteRequise;
    }

    public String getNotesSpeciales() {
        return notesSpeciales;
    }

    public void setNotesSpeciales(String notesSpeciales) {
        this.notesSpeciales = notesSpeciales;
    }

    public Integer getCapaciteMaxAcceptable() {
        return capaciteMaxAcceptable;
    }

    public void setCapaciteMaxAcceptable(Integer capaciteMaxAcceptable) {
        this.capaciteMaxAcceptable = capaciteMaxAcceptable;
    }

    public Integer getCapaciteMinAcceptable() {
        return capaciteMinAcceptable;
    }

    public void setCapaciteMinAcceptable(Integer capaciteMinAcceptable) {
        this.capaciteMinAcceptable = capaciteMinAcceptable;
    }

    public List<String> getBlocsAcceptables() {
        return blocsAcceptables;
    }

    public void setBlocsAcceptables(List<String> blocsAcceptables) {
        this.blocsAcceptables = blocsAcceptables;
    }

    public List<String> getTypesSalleAcceptables() {
        return typesSalleAcceptables;
    }

    public void setTypesSalleAcceptables(List<String> typesSalleAcceptables) {
        this.typesSalleAcceptables = typesSalleAcceptables;
    }

    public Boolean getFlexibleHoraire() {
        return flexibleHoraire;
    }

    public void setFlexibleHoraire(Boolean flexibleHoraire) {
        this.flexibleHoraire = flexibleHoraire;
    }

    public Integer getMargeHoraire() {
        return margeHoraire;
    }

    public void setMargeHoraire(Integer margeHoraire) {
        this.margeHoraire = margeHoraire;
    }

    public LocalTime getHeureDebutMin() {
        return heureDebutMin;
    }

    public void setHeureDebutMin(LocalTime heureDebutMin) {
        this.heureDebutMin = heureDebutMin;
    }

    public LocalTime getHeureFinMax() {
        return heureFinMax;
    }

    public void setHeureFinMax(LocalTime heureFinMax) {
        this.heureFinMax = heureFinMax;
    }

    public Boolean getPrioriteCapacite() {
        return prioriteCapacite;
    }

    public void setPrioriteCapacite(Boolean prioriteCapacite) {
        this.prioriteCapacite = prioriteCapacite;
    }

    public Boolean getPrioriteLocalisation() {
        return prioriteLocalisation;
    }

    public void setPrioriteLocalisation(Boolean prioriteLocalisation) {
        this.prioriteLocalisation = prioriteLocalisation;
    }

    public Boolean getPrioriteHoraire() {
        return prioriteHoraire;
    }

    public void setPrioriteHoraire(Boolean prioriteHoraire) {
        this.prioriteHoraire = prioriteHoraire;
    }
}
