package affectationsDesSalles.affectationDesSalles.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "salle")
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idSalle\"")
    private Long id;

    @NotBlank(message = "Le nom de la salle est requis")
    @Column(name = "nom", nullable = false)
    private String nom;
    
    @NotNull(message = "La capacité est requise")
    @Positive(message = "La capacité doit être un entier positif")
    @Column(name = "capacite", nullable = false)
    private Integer capacite;
    
    @NotBlank(message = "Le type de salle est requis")
    @Column(name = "type", nullable = false)
    private String type;
    
    @ManyToOne(optional = true)
    @JoinColumn(name = "idetage")
    private Etage etage;

    public Salle() {}

    public Salle(String nom, Integer capacite, String type, Etage etage) {
        this.nom = nom;
        this.capacite = capacite;
        this.type = type;
        this.etage = etage;
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
    
    public Etage getEtage() {
        return etage;
    }
    
    public void setEtage(Etage etage) {
        this.etage = etage;
    }
    
    // Helper methods for hierarchical access
    public Bloc getBloc() {
        return etage != null ? etage.getBloc() : null;
    }
    
    public String getBlocNom() {
        return getBloc() != null ? getBloc().getNom() : "Non assigné";
    }
    
    public String getEtageNumero() {
        return etage != null ? etage.getNumero() : "Non assigné";
    }
}