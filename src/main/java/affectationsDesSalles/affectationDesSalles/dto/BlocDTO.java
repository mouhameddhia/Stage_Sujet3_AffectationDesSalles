package affectationsDesSalles.affectationDesSalles.dto;

import jakarta.validation.constraints.NotBlank;

public class BlocDTO {
    private Long id;
    @NotBlank(message = "Le nom du bloc est requis")
    private String nom;
    
    public BlocDTO() {}
    
    public BlocDTO(Long id, String nom) {
        this.id = id;
        this.nom = nom;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
}
