package affectationsDesSalles.affectationDesSalles.repository;

import affectationsDesSalles.affectationDesSalles.model.Bloc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long> {
    Bloc findByNom(String nom);
    boolean existsByNom(String nom);
}
