package affectationsDesSalles.affectationDesSalles.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bloc")
public class Bloc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbloc")
    private Long id;

    @NotBlank(message = "Le nom du bloc est requis")
    @Column(name = "nombloc", nullable = false, unique = true)
    private String nom;

    @OneToMany(mappedBy = "bloc", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Etage> etages = new ArrayList<>();

    public Bloc() {}

    public Bloc(String nom) {
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

    public List<Etage> getEtages() {
        return etages;
    }

    public void setEtages(List<Etage> etages) {
        this.etages = etages;
    }
}
