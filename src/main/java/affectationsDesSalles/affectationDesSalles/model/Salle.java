package affectationsDesSalles.affectationDesSalles.model;

import jakarta.persistence.*;

@Entity
@Table(name = "salle")
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"idSalle\"")
    private Long id;

    @Column(name = "nom")
    private String nom;
    
    @Column(name = "capacite")
    private int capacite;
    
    @Column(name = "type")
    private String type;

    public Salle() {}

    public Salle(String nom, int capacite, String type) {
        this.nom = nom;
        this.capacite = capacite;
        this.type = type;
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

    public int getCapacite() {
        return capacite;
    }

    public void setCapacite(int capacite) {
        this.capacite = capacite;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
} 