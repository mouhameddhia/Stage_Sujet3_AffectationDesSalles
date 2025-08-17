package affectationsDesSalles.affectationDesSalles.repository;

import affectationsDesSalles.affectationDesSalles.model.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SalleRepository extends JpaRepository<Salle, Long> {
    // Use nested property traversal with underscores to avoid ambiguity
    List<Salle> findByEtage_Id(Long etageId);
    List<Salle> findByEtage_Bloc_Id(Long blocId);
    List<Salle> findByEtage_Bloc_Nom(String blocNom);
    List<Salle> findByEtage_Bloc_NomAndEtage_Numero(String blocNom, String etageNumero);
}