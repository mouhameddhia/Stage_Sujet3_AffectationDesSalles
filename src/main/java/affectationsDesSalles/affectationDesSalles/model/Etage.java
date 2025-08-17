package affectationsDesSalles.affectationDesSalles.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "etage")
public class Etage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idetage")
    private Long id;

    @NotBlank(message = "Le numéro de l'étage est requis")
    @Column(name = "numeroetage", nullable = false)
    private String numero;

    @NotNull(message = "Le bloc est requis")
    @ManyToOne(optional = false)
    @JoinColumn(name = "idbloc")
    private Bloc bloc;

    @OneToMany(mappedBy = "etage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Salle> salles = new ArrayList<>();

    public Etage() {}

    public Etage(String numero, Bloc bloc) {
        this.numero = numero;
        this.bloc = bloc;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Bloc getBloc() {
        return bloc;
    }

    public void setBloc(Bloc bloc) {
        this.bloc = bloc;
    }

    public List<Salle> getSalles() {
        return salles;
    }

    public void setSalles(List<Salle> salles) {
        this.salles = salles;
    }
}
