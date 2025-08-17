package affectationsDesSalles.affectationDesSalles.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;
import java.time.LocalTime;

public class AffectationRequest {
    
    @NotNull(message = "La date est requise")
    @FutureOrPresent(message = "La date doit être aujourd'hui ou dans le futur")
    private LocalDate date;
    
    @NotNull(message = "L'heure de début est requise")
    private LocalTime heureDebut;
    
    @NotNull(message = "L'heure de fin est requise")
    private LocalTime heureFin;
    
    @NotBlank(message = "Le type d'activité est requis")
    private String typeActivite;
    
    @NotNull(message = "L'ID de la salle est requis")
    private Long idSalle;

    public AffectationRequest() {}

    public AffectationRequest(LocalDate date, LocalTime heureDebut, LocalTime heureFin, String typeActivite, Long idSalle) {
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.typeActivite = typeActivite;
        this.idSalle = idSalle;
    }

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

    public Long getIdSalle() {
        return idSalle;
    }

    public void setIdSalle(Long idSalle) {
        this.idSalle = idSalle;
    }
} 