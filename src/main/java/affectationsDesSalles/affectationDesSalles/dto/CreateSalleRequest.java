package affectationsDesSalles.affectationDesSalles.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateSalleRequest {
    @NotBlank(message = "Le nom de la salle est requis")
    private String nom;
    
    @NotNull(message = "La capacité est requise")
    @Positive(message = "La capacité doit être un entier positif")
    private Integer capacite;
    
    @NotBlank(message = "Le type de salle est requis")
    private String type;
    
    @NotNull(message = "L'ID de l'étage est requis")
    private Long etageId;
    
    public CreateSalleRequest() {}
    
    public CreateSalleRequest(String nom, Integer capacite, String type, Long etageId) {
        this.nom = nom;
        this.capacite = capacite;
        this.type = type;
        this.etageId = etageId;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public Integer getCapacite() {
        return capacite;
    }
    
    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Long getEtageId() {
        return etageId;
    }
    
    public void setEtageId(Long etageId) {
        this.etageId = etageId;
    }
}
